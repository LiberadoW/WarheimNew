import * as R from "./rules";
import entries from "./recruitment.json";
import profiles from "./mercenary-profiles.json";
import { mercenariesList } from "../Data.js/Mercenaries";
import { createUnit } from "../Functions/createUnit";
import { getUnitAvailability } from "../Functions/getUnitAvailability";
import { applyCompanyRules, companyLevel, campaignModelLimit } from "./company";
import { livingCount } from "./effects";
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
  const cost = companyFree ? 0 : u.cost * R.modelCount(u);
  if (post.treasury < cost) throw Error("Za mało złota na pełną rekrutację.");
  let token;
  if (target > 0) {
    token = post.availability?.find((t) => t.id === tokenId);
    if (!token?.locked || token.used || token.total < target)
      throw Error("Brak odpowiedniego wyniku dostępności.");
  }
  if (token) {
    token.used = true;
    token.usedFor = name;
  }
  post.treasury -= cost;
  u.campaignNewRecruit = true;
  if (mercenary) {
    u.pay = mercenariesList[name].pay;
    u.prestige = mercenariesList[name].prestige;
  }
  if (companyFree) {
    post.companyMercRecruited = true;
    u.campaignContract = { companyFree: true, recruitmentWaived: true };
  }
  post.units.push(u);
  applyCompanyRules(post);
  R.log(
    post,
    "recruitment",
    `${name}: ${cost} zk · dostępność ${target || "powszechna"}. ${sourceReason}`,
  );
  return u;
}
