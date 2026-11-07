import * as R from "./rules";

// Special rules of the company's own models that change exploration and the
// loot sale (rulebook, chapter 6 special rules). They apply automatically;
// the player only rolls the dice the rule asks for.

const indices = (u) => Array.from({ length: R.modelCount(u) }, (_, i) => i);
const alive = (u) => indices(u).filter((i) => !u.campaignModelStatus?.[i]?.dead);
// "brał udział w rozgrywce, a w trakcie sekwencji nie wykonywał rzutu na
// TABELĘ POWAŻNYCH RAN"
const fit = (u) =>
  alive(u).filter(
    (i) => !u.battleAbsentModels?.[i] && !u.battleOutOfActionModels?.[i],
  );
const heroLike = (u) =>
  R.isHero(u) || u.type === "Najemne Ostrze" || u.type === "Postać Dramatu";
const k3 = (die) => Math.ceil((Number(die) || 0) / 2);
const has = (u, rule) => R.hasRule(u, rule);

export function explorationAuto(battle, post) {
  const units = post.units;
  const rerolls = [];
  for (const u of units) {
    const hunters = has(u, "Łowca skarbów") ? alive(u).length : 0;
    if (hunters) rerolls.push({ source: `Łowca skarbów: ${R.label(u)}`, count: hunters });
    const burghers =
      battle.area === "inside" && has(u, "Mieszczanin") ? fit(u).length : 0;
    if (burghers)
      rerolls.push({ source: `Mieszczanin: ${R.label(u)}`, count: burghers });
  }
  const bonuses = [];
  const henchWorldly = [];
  for (const u of units) {
    if (has(u, "Światowiec")) {
      if (heroLike(u))
        alive(u).forEach((i) =>
          bonuses.push({
            key: `swiatowiec:${u.uniqueId}:${i}`,
            label: `Światowiec: ${R.label(u)}${R.modelCount(u) > 1 ? ` #${i + 1}` : ""}`,
            dice: 1,
            sign: 1,
          }),
        );
      else alive(u).forEach(() => henchWorldly.push(R.label(u)));
    }
    if (has(u, "Odkrywca"))
      alive(u).forEach((i) =>
        bonuses.push({
          key: `odkrywca:${u.uniqueId}:${i}`,
          label: `Odkrywca: ${R.label(u)}${R.modelCount(u) > 1 ? ` #${i + 1}` : ""}`,
          dice: 1,
          signed: true,
        }),
      );
  }
  if (henchWorldly.length)
    bonuses.push({
      key: "swiatowiec:stronnicy",
      label: `Światowiec (stronnicy, najwyższa z ${henchWorldly.length} K3)`,
      dice: henchWorldly.length,
      best: true,
      sign: 1,
    });
  const thieves = units
    .filter((u) => has(u, "Złodziej") && alive(u).length)
    .map((u) => ({ unitId: u.uniqueId, label: R.label(u), kills: Number(u.battleKills) || 0 }));
  const robbers = units
    .filter((u) => has(u, "Rabuś") && alive(u).length)
    .map((u) => ({ key: `rabus:${u.uniqueId}`, label: `Rabuś: ${R.label(u)}` }));
  const tables = units
    .flatMap((u) =>
      [
        has(u, "Mapa skarbów") && fit(u).length ? `Mapa skarbów: ${R.label(u)}` : null,
        has(u, "Hiena cmentarna") && alive(u).length ? `Hiena cmentarna: ${R.label(u)}` : null,
      ].filter(Boolean),
    );
  return { rerolls, bonuses, thieves, robbers, tables };
}

// Total from the rolled dice; null while any required die is missing.
export function explorationAutoTotals(auto, rolls = {}, signs = {}, thieves = {}) {
  let sum = 0;
  for (const b of auto.bonuses) {
    const dice = rolls[b.key];
    if (!R.validDice(dice, b.dice)) return null;
    const value = b.best ? Math.max(...dice.map(k3)) : k3(dice[0]);
    const sign = b.signed ? (signs[b.key] === -1 ? -1 : signs[b.key] === 1 ? 1 : 0) : 1;
    if (b.signed && !sign) return null;
    sum += sign * value;
  }
  let loot = 0;
  for (const t of auto.thieves)
    if (thieves[t.unitId] ?? t.kills > 0) loot += 1;
  for (const r of auto.robbers) {
    const dice = rolls[r.key];
    if (!R.validDice(dice, 1)) return null;
    if (dice[0] === 1) loot -= 1;
  }
  return { sum, loot };
}

export function lootSaleAuto(post) {
  const leader = post.units.find(
    (u) => has(u, "Dowódca") && alive(u).length && !u.campaignModelStatus?.[0]?.dead,
  );
  let gluttons = 0,
    economists = 0,
    revelators = [];
  for (const u of post.units) {
    if (["Najemne Ostrze", "Postać Dramatu"].includes(u.type)) continue;
    if (has(u, "Przepastne trzewia")) gluttons += alive(u).length;
  }
  for (const u of post.units) {
    if (has(u, "Ekonom")) economists += alive(u).length;
    if (has(u, "Rewelator")) revelators.push(...fit(u).map(() => R.label(u)));
  }
  const wagon = post.units.some((u) => has(u, "Wóz przemytniczy") && alive(u).length);
  const spendthrift = (post.armyRules || []).some(
    (r) => R.baseName(r) === "rozrzutność",
  );
  return {
    gluttons,
    economists,
    revelators,
    wagon,
    extraLoot: revelators.length + (wagon ? 1 : 0),
    spendthrift,
    leader,
    leaderCp: leader ? Number(R.currentStats(leader)[8]) || 0 : 0,
  };
}
