import recipes from "./crafting.json";
import * as R from "./rules";
import { getEquipmentStats } from "../Data.js/EquipmentStats";
export { recipes };
export const craftsmen = (post) =>
  post.units.filter(
    (u) =>
      u.type === "Bohater" &&
      R.activeModel(u, 0) &&
      !u.battleOutOfActionModels?.[0] &&
      !u.campaignNewRecruit &&
      ["Kowal run", "Mistrz inżynier"].some((r) => R.hasRule(u, r)),
  );
export function reserveCraft(post, unitId, kind) {
  if (post.exploration?.locked || post.explorationApplied)
    throw Error(
      "Po rzucie na eksplorację nie można zmienić przydziału rzemieślnika.",
    );
  const u = craftsmen(post).find((u) => u.uniqueId === unitId);
  if (
    !u ||
    (kind && !R.hasRule(u, kind === "rune" ? "Kowal run" : "Mistrz inżynier"))
  )
    throw Error("Brak uprawnionego rzemieślnika.");
  post.craftReservations = {
    ...(post.craftReservations || {}),
    [unitId]: kind,
  };
}
export const itemCraftSlot = (category) =>
  /oręża/i.test(category)
    ? "weapon"
    : /inżynierskie/i.test(category)
      ? "machine"
      : /zbroi/i.test(category)
        ? "armour"
        : /talizmanu/i.test(category)
          ? "talisman"
          : /instrumentu/i.test(category)
            ? "instrument"
            : "banner";
export function craftTargets(post) {
  return post.units
    .filter((u) => !u.campaignModelStatus?.every((s) => s.dead))
    .flatMap((u) => [
      ...["startingEquipment", "optionalEquipment", "customEquipment"].flatMap(
        (field) =>
          (u[field] || []).map((e, i) => ({
            id: `${u.uniqueId}:${field}:${i}`,
            unitId: u.uniqueId,
            field,
            index: i,
            name: typeof e === "string" ? e : e.name,
          })),
      ),
      ...(R.hasRule(u, "Machina wojenna")
        ? [
            {
              id: `${u.uniqueId}:machine`,
              unitId: u.uniqueId,
              name: u.unitName,
              machine: true,
            },
          ]
        : []),
    ]);
}
export function craftProblem(post, recipe, target, crafterId) {
  if (!recipe || !target) return "Wybierz recepturę i przedmiot bazowy.";
  const crafter = craftsmen(post).find((u) => u.uniqueId === crafterId);
  if (!crafter || post.craftReservations?.[crafterId] !== recipe.kind)
    return "Rzemieślnik nie został przydzielony przed eksploracją.";
  const attempts = (post.craftAttempts || []).filter(
    (a) => a.crafterId === crafterId,
  );
  if (attempts.some((a) => a.stopped))
    return "Rzemieślnik musi zakończyć pracę po awarii.";
  if (
    attempts.some((a) => a.master) ||
    (recipe.master && attempts.length) ||
    attempts.length >= 3
  )
    return "Wykorzystano limit prób rzemieślnika (trzy mniejsze / mechanizmy albo jedna mistrzowska).";
  const u = post.units.find((u) => u.uniqueId === target.unitId),
    slot = itemCraftSlot(recipe.category),
    attachments = u.craftedEquipment?.[target.name] || [];
  const limitSlot = slot === "machine" && !target.machine ? "weapon" : slot;
  const magicalCategory = {
    weapon: "Magiczny oręż",
    armour: "Magiczna zbroja",
    talisman: "Magiczne talizmany",
    instrument: "Magiczne instrumenty",
    banner: "Magiczne sztandary",
  }[limitSlot];
  const magicOwners =
    target.machine || ["instrument", "banner"].includes(slot)
      ? post.units
      : [u];
  if (
    magicalCategory &&
    magicOwners.some((v) =>
      (v.campaignEquipment || []).some((e) => e.category === magicalCategory),
    )
  )
    return "Ten slot zajmuje już magiczny przedmiot.";
  const stats = getEquipmentStats(target.name),
    catalog = R.catalog.find((i) => R.normal(i.name) === R.normal(target.name));
  if (
    /spacz|kulomiot|miotacz spaczognia|moździerz trującego wichru/i.test(
      target.name,
    ) ||
    catalog?.category.startsWith("Magicz") ||
    catalog?.category === "Arkana"
  )
    return "Na tym przedmiocie nie wolno tworzyć run ani mechanizmów.";
  if (
    attachments.some((a) => a.kind !== recipe.kind) ||
    u.craftBlockedItems?.includes(target.name)
  )
    return "Przedmiot nie nadaje się do dalszego ulepszania.";
  if (
    slot === "machine" &&
    !target.machine &&
    (!stats || stats.armour || stats.range === "Walka wręcz")
  )
    return "Ta receptura dotyczy broni dystansowej lub machiny wojennej.";
  if (
    slot === "weapon" &&
    (!stats || stats.armour || stats.range !== "Walka wręcz")
  )
    return "Wymagana niemagiczna broń do walki wręcz.";
  if (
    slot === "armour" &&
    !stats?.armour &&
    !/pancerz|hełm|tarcza|puklerz|pawęż/i.test(target.name)
  )
    return "Wymagany pancerz, hełm albo tarcza.";
  if (slot === "talisman" && !/talizman|amulet/i.test(target.name))
    return "Wymagany niemagiczny talizman.";
  if (
    slot === "instrument" &&
    !/róg|bęben|instrument|lutnia|flet/i.test(target.name)
  )
    return "Wymagany niemagiczny instrument.";
  if (slot === "banner" && !/sztandar|chorągiew|proporzec/i.test(target.name))
    return "Wymagany niemagiczny sztandar.";
  if (
    !target.machine &&
    !["instrument", "banner"].includes(slot) &&
    (!R.isHero(u) || R.modelCount(u) !== 1)
  )
    return "Taki przedmiot może nosić jeden bohater.";
  if (recipe.kind === "mechanism" && attachments.length >= 3)
    return "Na przedmiocie są już trzy mechanizmy.";
  if (
    recipe.kind === "rune" &&
    (recipe.master
      ? attachments.filter((a) => !a.master).length !== 3 ||
        attachments.some((a) => a.master)
      : attachments.filter((a) => !a.master).length >= 3)
  )
    return "Przedmiot mieści trzy runy mniejsze; mistrzowska wymaga trzech mniejszych.";
  if (
    recipe.master &&
    post.units.some((v) =>
      Object.values(v.craftedEquipment || {})
        .flat()
        .some((a) => a.id === recipe.id),
    )
  )
    return "Ta runa mistrzowska jest już w kompanii.";
  // Runic / mechanical items share the magic item slot and company item limits.
  const owners =
    target.machine || ["instrument", "banner"].includes(slot)
      ? post.units
      : [u];
  if (
    owners.some((v) =>
      Object.entries(v.craftedEquipment || {}).some(
        ([name, items]) =>
          name !== target.name &&
          items.some(
            (a) =>
              (itemCraftSlot(a.category) === "machine" &&
              !R.hasRule(v, "Machina wojenna")
                ? "weapon"
                : itemCraftSlot(a.category)) === limitSlot,
          ),
      ),
    )
  )
    return "Osiągnięto limit przedmiotów tego rodzaju.";
  const combination = [...attachments.map((a) => a.id), recipe.id]
    .sort()
    .join("|");
  if (
    post.units.some((v) =>
      Object.entries(v.craftedEquipment || {}).some(
        ([name, items]) =>
          (v.uniqueId !== u.uniqueId || name !== target.name) &&
          items
            .map((a) => a.id)
            .sort()
            .join("|") === combination,
      ),
    )
  )
    return "Taka kombinacja ulepszeń istnieje już w kompanii.";
  return null;
}
export function prepareCraft(
  post,
  recipeId,
  targetId,
  crafterId,
  priceDice,
  tokenId,
) {
  if (post.craftQuote && !post.craftQuote.used)
    throw Error("Najpierw rozstrzygnij rozpoczętą próbę.");
  const recipe = recipes.find((r) => r.id === recipeId),
    target = craftTargets(post).find((t) => t.id === targetId),
    problem = craftProblem(post, recipe, target, crafterId);
  if (problem) throw Error(problem);
  const price = R.priceRoll(recipe.price, priceDice).price;
  const token = post.availability?.find((t) => t.id === tokenId);
  if (
    recipe.availability &&
    (!token?.locked || token.used || token.total < recipe.availability)
  )
    throw Error("Brak wyniku dostępności składników.");
  if (post.treasury < price) throw Error("Za mało złota na składniki.");
  post.craftQuote = {
    id: R.uid(),
    recipeId,
    targetId,
    crafterId,
    price,
    priceDice,
    tokenId,
    used: false,
  };
  R.log(
    post,
    "craft-price",
    `${recipe.name}: składniki ${price} zk, cel ${target.name}.`,
  );
}
export function resolveCraft(
  post,
  dice,
  failureDice,
  hitStrength,
  hitOutcome,
  injuryDice,
  injuryDetail,
) {
  const quote = post.craftQuote;
  if (!quote || quote.used) throw Error("Brak ustalonej próby.");
  const recipe = recipes.find((r) => r.id === quote.recipeId),
    target = craftTargets(post).find((t) => t.id === quote.targetId),
    problem = craftProblem(post, recipe, target, quote.crafterId);
  if (problem) throw Error(problem);
  if (!R.validDice(dice, 1)) throw Error("Wykonaj rzut tworzenia K6.");
  if (dice[0] <= 4 && !R.validDice(failureDice, 1))
    throw Error("Wykonaj rzut na tabelę awarii.");
  const failed = dice[0] <= 4,
    accident = failed && failureDice[0] === 1;
  if (
    accident &&
    (!R.validDice(hitStrength, 1) || !["safe", "out"].includes(hitOutcome))
  )
    throw Error("Rozstrzygnij trafienie o Sile K6 zgodnie z tabelą awarii.");
  const u = post.units.find((u) => u.uniqueId === target.unitId);
  const attachments = u.craftedEquipment?.[target.name] || [];
  if (!failed) {
    const token = post.availability?.find((t) => t.id === quote.tokenId);
    if (
      post.treasury < quote.price ||
      (recipe.availability && (!token?.locked || token.used))
    )
      throw Error("Składniki nie są już dostępne.");
    post.treasury -= quote.price;
    if (token) token.used = true;
  }
  const result = { ...recipe, active: !failed };
  if (!accident)
    u.craftedEquipment = {
      ...(u.craftedEquipment || {}),
      [target.name]: [...attachments, result],
    };
  else {
    if (target.machine)
      u.campaignModelStatus = Array.from({ length: R.modelCount(u) }, () => ({
        dead: true,
      }));
    else u[target.field].splice(target.index, 1);
    if (u.craftedEquipment) delete u.craftedEquipment[target.name];
  }
  if (failed && recipe.kind === "mechanism" && failureDice[0] <= 3)
    u.craftBlockedItems = [...(u.craftBlockedItems || []), target.name];
  if (accident && hitOutcome === "out") {
    const crafter = post.units.find((u) => u.uniqueId === quote.crafterId),
      result = R.injuryResult(crafter, injuryDice);
    R.applyInjury(
      post,
      { unitId: crafter.uniqueId, index: 0, key: `craft:${quote.id}` },
      result,
      injuryDetail || {},
    );
  }
  post.craftAttempts = [
    ...(post.craftAttempts || []),
    {
      ...quote,
      dice,
      failureDice,
      hitStrength,
      hitOutcome,
      master: recipe.master,
      stopped: failed && failureDice[0] <= 3,
      success: !failed,
    },
  ];
  quote.used = true;
  R.log(
    post,
    "craft",
    `${R.label(u)} / ${target.name}: ${recipe.name} — ${failed ? "niepowodzenie" : "powodzenie"}${failed ? `, awaria ${failureDice[0]}` : ` (${quote.price} zk)`}.`,
  );
}
