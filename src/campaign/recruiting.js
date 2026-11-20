import * as R from "./rules";
import entries from "./recruitment.json";
import profiles from "./mercenary-profiles.json";
import { mercenariesList } from "../Data.js/Mercenaries";
import { createUnit } from "../Functions/createUnit";
import { getUnitAvailability, PAIRED_UNITS } from "../Functions/getUnitAvailability";
import { applyCompanyRules, companyLevel, campaignModelLimit } from "./company";
import { findCatalog, livingCount } from "./effects";
import { recruitTaxes } from "./trading";
export const rosterModels = (post) =>
  post.units
    .filter((u) => !["Najemne Ostrze", "Postać Dramatu"].includes(u.type))
    .reduce((n, u) => n + livingCount(u), 0);
export function recruitAvailability(army, name, mercenary = false) {
  const key = R.normal(name);
  if (mercenary)
    return profiles.find((p) => R.normal(p.name) === key)?.availability ?? null;
  return (
    entries.find(
      (e) =>
        R.normal(e.army) === R.normal(army.name) && R.normal(e.name) === key,
    )?.availability ?? null
  );
}
export function recruitmentProblem(post, army, name, mercenary = false) {
  const definition = mercenary ? mercenariesList[name] : army.heroes?.[name];
  if (!definition) return "Brak profilu rekruta.";
  const living = post.units
    .filter((u) => livingCount(u) > 0)
    .map((u) => ({ ...u, selectedNumber: livingCount(u) }));
  if (mercenary) {
    if ((post.mercenaryBans?.[name] || 0) > 0)
      return `Najemnik niedostępny przez ${post.mercenaryBans[name]} rozgrywki.`;
    if (!army.mercenaries?.includes(name))
      return "Najemnik niedostępny dla tej kompanii.";
    if (living.some((u) => u.unitName === name))
      return "Ten Najemnik już służy w kompanii.";
  } else {
    const state = getUnitAvailability(army, living)[name];
    if (!state?.isAvailable)
      return state?.blockedBy || "Osiągnięto limit tego rodzaju modeli.";
    const count = R.modelCount(createUnit(army.heroes, name));
    if (rosterModels(post) + count > campaignModelLimit(army, post))
      return "Osiągnięto limit modeli kompanii.";
    if (definition.type === "Bohater" && living.filter(R.isHero).length >= 6)
      return "Kompania ma już 6 bohaterów.";
  }
  return null;
}

export const recruitGroups = (post, name, profile) =>
  profile?.type === "Stronnik" && !PAIRED_UNITS.includes(name)
    ? post.units.filter((u) =>
        u.unitName === name && R.isGroup(u) && livingCount(u) > 0 && !R.hasRule(u, "Nieświadomy"),
      )
    : [];

const equipmentSignature = (group) => JSON.stringify([
  group.startingEquipment || [], group.optionalEquipment || [], group.customEquipment || [],
  group.craftedEquipment || {}, group.equipmentAliasSelections || {}, group.cost,
]);

function groupRecruitEquipment(post, group) {
  const fromStash = [];
  const missing = [];
  let value = 0;
  for (const field of ["optionalEquipment", "customEquipment"]) {
    for (const [index, entry] of (group[field] || []).entries()) {
      if (group.baseCustomEquipmentIds?.includes(entry?.id)) continue;
      const name = entry?.name || entry;
      const metadata = group.campaignEquipment?.find((item) => R.normal(item.name) === R.normal(name));
      const catalogId = entry?.catalogId || metadata?.catalogId;
      const item = R.catalog.find((candidate) => candidate.id === catalogId) || findCatalog(name);
      const crafting = group.craftedEquipment?.[item?.name] || group.craftedEquipment?.[name];
      if (!item?.availability && !crafting) continue;
      const requiredCrafting = JSON.stringify(crafting || null);
      const stored = (post.inventory || []).find((candidate) =>
        (item && candidate.catalogId
          ? candidate.catalogId === item.id
          : R.normal(candidate.name) === R.normal(item?.name || name)) &&
        JSON.stringify(candidate.crafting || null) === requiredCrafting &&
        candidate.quantity > fromStash.filter((taken) => taken.id === candidate.id).length,
      );
      if (stored) {
        fromStash.push({ ...stored, quantity: 1, equippedAs: name });
        value += R.carriedBasePrice(group, field, index);
      } else {
        missing.push(name);
      }
    }
  }
  return { fromStash, missing, value };
}

export function groupRecruitQuote(post, group, profile) {
  const exp = Number(group.exp) || 0;
  const role = R.joiningRole(group);
  const groupLimit = R.groupLimit(group);
  const gear = groupRecruitEquipment(post, group);
  const taxKey = `join-tax:${group.uniqueId}`;
  const taxRolls = post.rollDrafts?.[taxKey] || {};
  const taxes = recruitTaxes(post, group).filter((item) => !gear.fromStash.some((stored) => stored.equippedAs === item.name));
  const taxReady = taxes.every((t) => R.validDice(taxRolls[t.key], t.dice));
  const tax = taxReady ? taxes.reduce((n, t) => n + R.sum(taxRolls[t.key]), 0) : 0;
  const subtotal = Math.max(0, (Number(group.cost) || 0) - gear.value) + exp * 2 + (role && role !== "full" ? R.COMMAND_COST : 0);
  const cost = subtotal + tax;
  const budget = post.recruitBudget || 0;
  const roleProblem = role && role !== "full" ? commandRoleProblem(post, profile, role) : null;
  let problem = null;
  if (role === "full") problem = "Grupa chorążego i sygnalisty jest pełna.";
  else if (livingCount(group) >= groupLimit) problem = `Grupa ma już maksymalną liczbę modeli (${groupLimit}).`;
  else if (roleProblem) problem = roleProblem;
  else if (!post.recruitBudgetLocked) problem = "Najpierw rzuć i zatwierdź pulę PD rekrutów.";
  else if (exp > budget) problem = `Grupa ma ${exp} PD, a w puli zostało ${budget} PD.`;
  else if (gear.missing.length) problem = `Brak kompletu rzadkiego ekwipunku w skarbcu: ${gear.missing.join(", ")}.`;
  else if (!taxReady) problem = "Rzuć na podatek za ekwipunek rekruta.";
  else if (cost > post.treasury) problem = `Brakuje ${cost - post.treasury} zk (w skarbcu ${post.treasury} zk).`;
  return { exp, role, taxKey, taxRolls, taxes, taxReady, tax, cost, problem, fromStash: gear.fromStash };
}

export function recruit(
  post,
  army,
  name,
  {
    mercenary = false,
    availability,
    tokenId,
    sourceReason = "",
    companyFree = false,
    commandRole = "",
    displayName = "",
    groupId = "",
  } = {},
) {
  const problem = recruitmentProblem(post, army, name, mercenary);
  if (problem) throw Error(problem);
  if (
    companyFree &&
    (!mercenary ||
      !companyLevel(post, "Kompania najemników") ||
      post.companyMercRecruited)
  )
    throw Error("Bezpłatna rekrutacja niedostępna lub już wykorzystana.");
  const imported = companyFree ? 0 : recruitAvailability(army, name, mercenary);
  if (imported === null && !sourceReason.trim())
    throw Error("Uzasadnij dostępność brakującą w profilu.");
  const target = imported ?? availability;
  if (!Number.isInteger(target) || target < 0)
    throw Error("Nieprawidłowa dostępność.");
  const u = createUnit(mercenary ? mercenariesList : army.heroes, name);
  const group = groupId && !mercenary && recruitGroups(post, name, u).find((candidate) => candidate.uniqueId === groupId);
  if (groupId && !group) throw Error("Wybierz istniejącą grupę tego rodzaju stronników.");
  const join = group ? groupRecruitQuote(post, group, u) : null;
  if (join?.problem) throw Error(join.problem);
  if (commandRole) {
    const problem = commandRoleProblem(post, u, commandRole);
    if (problem) throw Error(problem);
  }
  const cost = join?.cost ?? ((companyFree ? 0 : u.cost * R.modelCount(u)) + (commandRole ? R.COMMAND_COST : 0));
  if (post.treasury < cost) throw Error("Za mało złota na pełną rekrutację.");
  let token;
  if (target > 0) {
    token = R.usableAvailability(post, target).find((t) => t.id === tokenId);
    if (!token)
      throw Error("Brak odpowiedniego wyniku dostępności.");
  }
  if (token) {
    token.used = true;
    token.usedFor = name;
  }
  post.treasury -= cost;
  if (join) {
    const role = R.addGroupModel(group);
    const id = R.uid();
    const groupName = R.label(group);
    const wasNewRecruit = !!group.campaignNewRecruit;
    group.campaignNewRecruit = true;
    post.recruitBudget = (post.recruitBudget || 0) - join.exp;
    const fromStash = join.fromStash.map(({ equippedAs, ...stored }) => stored);
    if (fromStash.length) {
      fromStash.forEach((stored) => { post.inventory.find((item) => item.id === stored.id).quantity -= 1; });
      post.inventory = post.inventory.filter((item) => item.quantity > 0);
    }
    post.experiencedJoins = [
      ...(post.experiencedJoins || []),
      {
        id, unitId: group.uniqueId, name: groupName, cost, exp: join.exp, role,
        count: R.modelCount(group), wasNewRecruit, fromStash, equipment: equipmentSignature(group),
        ...(token ? { tokenId: token.id } : {}),
      },
    ];
    if (token) token.recruitJoinId = id;
    if (post.rollDrafts) delete post.rollDrafts[join.taxKey];
    R.log(post, "recruitment",
      `Doświadczony ${groupName}${role ? ` (dołącza jako ${role.toLowerCase()})` : ""}: ${cost} zk${join.tax ? ` (w tym podatek ${join.tax} zk: ${join.taxes.map((t) => `${t.name} ${join.taxRolls[t.key].join("+")}`).join(", ")})` : ""}, ${join.exp} PD puli · dostępność ${target || "powszechna"}. ${sourceReason}`,
      { joinId: id },
    );
    return group;
  }
  u.campaignNewRecruit = true;
  if (mercenary) {
    u.pay = mercenariesList[name].pay;
    u.prestige = mercenariesList[name].prestige;
  }
  if (companyFree) {
    post.companyMercRecruited = true;
    u.campaignContract = { companyFree: true, recruitmentWaived: true };
  }
  if (displayName.trim()) u.unitDisplayName = displayName.trim();
  if (commandRole) {
    // A banner bearer or musician forms his own group (s. 62).
    u.optionalEquipment = [...(u.optionalEquipment || []), commandRole];
    u.number = 2;
    u.totalCost = R.groupTotalCost(u);
  }
  post.units.push(u);
  applyCompanyRules(post);
  R.log(
    post,
    "recruitment",
    `${displayName.trim() ? `${displayName.trim()} (${name})` : name}${commandRole ? ` (${commandRole.toLowerCase()})` : ""}: ${cost} zk · dostępność ${target || "powszechna"}. ${sourceReason}`,
  );
  return u;
}

// CHORĄŻOWIE & SYGNALIŚCI (s. 62, rozdz. 9): a henchman recruited with this
// rule may be promoted for 20 zk; the company has one banner bearer and one
// musician at most.
export const canCommand = (u) => (u?.rules || []).some((r) => /^chorążowie & sygnaliści/i.test(String(r)));
export function commandRoleProblem(post, u, role) {
  if (!["Chorąży", "Sygnalista"].includes(role)) return "Nieznana rola.";
  if (!canCommand(u)) return "Ten model nie może zostać chorążym ani sygnalistą.";
  if (R.modelCount(u) !== 1) return "Awansować można jeden model.";
  const taken = post.units.some(
    (x) => livingCount(x) > 0 && R.commandRoles(x).includes(role),
  );
  if (taken) return `Kompania ma już ${role === "Chorąży" ? "chorążego" : "sygnalistę"}.`;
  return null;
}

// Undoing a joined recruit gives back the gold and the PD pool; it works
// while the group still ends with that model (no split or merge since).
export function undoExperiencedJoin(p, recordId) {
  const rec = (p.experiencedJoins || []).find((r) => r.id === recordId);
  if (!rec) throw Error("Nie znaleziono tego rekruta.");
  const u = p.units.find((x) => x.uniqueId === rec.unitId);
  if (!u || R.modelCount(u) !== rec.count)
    throw Error("Grupa zmieniła się od dołączenia (podział, łączenie, nowy rekrut): cofnij najpierw późniejsze zmiany.");
  if (rec.equipment && equipmentSignature(u) !== rec.equipment)
    throw Error("Ekwipunek grupy zmienił się od dołączenia rekruta. Najpierw przywróć poprzedni ekwipunek.");
  if (rec.role) {
    const i = (u.optionalEquipment || []).lastIndexOf(rec.role);
    if (i >= 0) u.optionalEquipment = u.optionalEquipment.filter((_, j) => j !== i);
  }
  u.selectedNumber = rec.count - 1;
  u.campaignModelStatus = (u.campaignModelStatus || []).slice(0, rec.count - 1);
  if (Array.isArray(u.battleAbsentModels)) u.battleAbsentModels = u.battleAbsentModels.slice(0, rec.count - 1);
  if (Array.isArray(u.battleOutOfActionModels)) u.battleOutOfActionModels = u.battleOutOfActionModels.slice(0, rec.count - 1);
  u.totalCost = R.groupTotalCost(u);
  if (rec.wasNewRecruit === false) delete u.campaignNewRecruit;
  p.treasury += rec.cost;
  p.recruitBudget = (p.recruitBudget || 0) + rec.exp;
  for (const stored of rec.fromStash || []) {
    const existing = p.inventory.find((item) => item.id === stored.id);
    if (existing) existing.quantity += stored.quantity;
    else p.inventory.push({ ...stored });
  }
  const token = p.availability?.find((t) => t.id === rec.tokenId && t.recruitJoinId === rec.id);
  if (token) {
    token.used = false;
    delete token.usedFor;
    delete token.recruitJoinId;
  }
  p.experiencedJoins = p.experiencedJoins.filter((r) => r !== rec);
  R.log(p, "recruitment", `Cofnięto doświadczonego rekruta: ${rec.name}${rec.role ? ` (${rec.role.toLowerCase()})` : ""}, zwrot ${rec.cost} zk i ${rec.exp} PD puli.`);
}

// Recruits joined before joins were recorded: read back from the journal
// ("Doświadczony Zelota: 27 zk, 2 PD puli.").
const LEGACY = /^Doświadczony (.+?)(?: \(dołącza jako (\S+)\))?: (\d+) zk.*?, (\d+) PD puli\.$/;
export const legacyJoins = (p) =>
  (p.journal || [])
    .filter((e) => e.type === "recruitment" && !e.joinId && !e.undone && LEGACY.test(e.text || ""))
    .map((e) => {
      const [, name, role, cost, exp] = e.text.match(LEGACY);
      return {
        id: e.id,
        legacy: true,
        name,
        role: role ? role.charAt(0).toUpperCase() + role.slice(1) : null,
        cost: Number(cost),
        exp: Number(exp),
      };
    });
export function undoLegacyJoin(p, entryId) {
  const rec = legacyJoins(p).find((r) => r.id === entryId);
  if (!rec) throw Error("Nie znaleziono tego rekruta.");
  const u = p.units.find((x) => x.type === "Stronnik" && R.label(x) === rec.name && R.modelCount(x) > 1);
  if (!u) throw Error(`Grupa ${rec.name} ma już tylko jeden model: cofnij ręcznie w narzędziach.`);
  p.experiencedJoins = [
    ...(p.experiencedJoins || []),
    { id: rec.id, unitId: u.uniqueId, name: rec.name, cost: rec.cost, exp: rec.exp, role: rec.role, count: R.modelCount(u) },
  ];
  undoExperiencedJoin(p, rec.id);
  const entry = p.journal.find((e) => e.id === entryId);
  if (entry) entry.undone = true;
}
