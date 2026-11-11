import entries from "./company-advances.json";
import * as R from "./rules";
export { entries as companyAdvances };
export const COMPANY_THRESHOLDS = {
  determinacja: [5, 10, 15, 20, 29, 40],
  gniew: [3, 7, 11, 19, 29, 40],
  odpornosc: [6, 13, 20, 29, 40],
};
export function companyLevel(post, name) {
  const found = (post.companyAdvancements || []).filter(
    (e) => R.normal(e.name) === R.normal(name),
  );
  let level = 0;
  for (const e of found) {
    const thresholds =
      name === "Kontakty handlowe" ||
      name === "Eksploratorzy" ||
      name === "Zachłanność"
        ? [5, 15, 29]
        : name === "Alchemicy" || name === "Truciciele"
          ? [3, 11, 29]
          : name === "Horda"
            ? [6, 20, 40]
            : name === "Nieśmiertelni"
              ? [6, 20, 40]
              : name === "Weteran"
                ? [10, 20]
                : name === "Chciwość" ||
                    name === "Poszukiwacze" ||
                    name === "Samowystarczalni"
                  ? [13, 29]
                  : name === "Zbrojny po zemby"
                    ? [7, 40]
                    : name === "Stratedzy"
                      ? [20, 40]
                      : name === "Żądza krwi"
                        ? [7, 19]
                        : [e.threshold];
    level = Math.max(level, thresholds.indexOf(e.threshold) + 1);
  }
  for (const rule of post.armyRules || [])
    if (R.baseName(rule) === R.baseName(name))
      level = Math.max(level, Number(rule.match(/\((\d+)\)/)?.[1] || 1));
  return level;
}
export function companyChoices(post, notes) {
  if (!post.campaignPointsApplied) return [];
  return Object.entries(COMPANY_THRESHOLDS).flatMap(([track, thresholds]) =>
    thresholds
      .filter(
        (t) =>
          t > (Number(notes[track]) || 0) &&
          t <= (Number(post.campaignPoints?.[track]) || 0),
      )
      .map((threshold) => ({
        track,
        threshold,
        options: entries.filter(
          (e) => e.track === track && e.threshold === threshold,
        ),
        selected: (post.companyAdvancements || []).find(
          (e) => e.track === track && e.threshold === threshold,
        ),
      })),
  );
}
export const TRACK_NAMES = {
  determinacja: "Determinacja",
  gniew: "Gniew",
  odpornosc: "Odporność",
};
export function selectCompanyAdvance(post, notes, id) {
  const entry = entries.find((e) => e.id === id);
  if (!entry) throw Error("Nieznane rozwinięcie kompanii.");
  const choice = companyChoices(post, notes).find(
    (c) => c.track === entry.track && c.threshold === entry.threshold,
  );
  if (!choice || choice.selected)
    throw Error("Ten próg został rozliczony albo nie został osiągnięty.");
  post.companyAdvancements = [...(post.companyAdvancements || []), entry];
  applyCompanyRules(post);
  R.log(
    post,
    "company-advance",
    `${TRACK_NAMES[entry.track] || entry.track} ${entry.threshold}: ${entry.name}`,
    { entryId: id },
  );
}
export function applyCompanyRules(post) {
  const armed = companyLevel(post, "Zbrojny po zemby");
  post.companyRules = {
    ...(post.companyRules || {}),
    armed,
    immortal: companyLevel(post, "Nieśmiertelni"),
    horde: companyLevel(post, "Horda"),
  };
  for (const u of post.units)
    if (armed && (R.isHero(u) || armed >= 2)) R.addRule(u, "Zbrojny po zemby");
}
export const campaignModelLimit = (army, post) =>
  companyLevel(post, "Horda")
    ? Math.min(20, (army.maxModels || 20) + companyLevel(post, "Horda"))
    : army.maxModels || 20;

export const ordinaryHenchman = (unit) =>
  unit.type === "Stronnik" &&
  ![
    "Demon",
    "Istota eteryczna",
    "Leśny duch",
    "Machina wojenna",
    "Nieumarły",
    "Opętany",
    "Potwór",
    "Wielkolud",
    "Zwierzę",
  ].some((r) => R.hasRule(unit, r));
export const companyInjuryModifier = (post, unit) =>
  companyLevel(post, "Konsyliarze") && ordinaryHenchman(unit) ? 1 : 0;
export function explorationRules(battle, post) {
  const heroes = post.units.filter(
    (u) =>
      u.type === "Bohater" &&
      !u.campaignModelStatus?.[0]?.dead &&
      !u.campaignNewRecruit &&
      !post.craftReservations?.[u.uniqueId] &&
      // Anoreksja and Żarłoczność (s. 412-413): no exploration or trade.
      !R.hasRule(u, "Anoreksja") &&
      !R.hasRule(u, "Żarłoczność") &&
      (companyLevel(post, "Pazerność") ||
        (R.activeModel(u, 0) && !u.battleOutOfActionModels?.[0])),
  );
  const future = (post.activeFutureEffects || []).filter(
    (e) => e.key === "extraExplorationDropLowest",
  );
  const extra = future.reduce((n, e) => n + (e.extraDice || 0), 0),
    discard = future.reduce((n, e) => n + (e.discardLowest || 0), 0);
  return {
    heroes,
    count:
      Math.min(6, heroes.length + (battle.result === "win" ? 1 : 0)) + extra,
    discardLowest: discard,
    totalModifier: companyLevel(post, "Chciwość"),
    rerolls: companyLevel(post, "Odkrywcy")
      ? 6
      : Number(
          post.persistentEffects?.[
            battle.area === "inside"
              ? "insideExplorationReroll"
              : "outsideExplorationReroll"
          ] || 0,
        ),
  };
}
export function immortalTasks(post) {
  const level = companyLevel(post, "Nieśmiertelni");
  if (!level) return [];
  return post.units
    .filter((u) =>
      u.type === "Bohater"
        ? level >= 3
        : u.type === "Stronnik" && (level >= 2 || ordinaryHenchman(u)),
    )
    .flatMap((u) =>
      Array.from({ length: R.modelCount(u) }, (_, i) => ({
        unit: u,
        index: i,
        key: `${u.uniqueId}:${i}`,
      })),
    )
    .filter((t) => {
      const result = post.injuries[t.key];
      return (
        result?.status.dead &&
        result.code >= 11 &&
        result.code <= 15 &&
        !post.immortalRecruits?.[t.key]
      );
    });
}
