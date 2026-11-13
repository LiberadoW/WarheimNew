import scenarios from "./data/scenarios.json";
import optionalRulesData from "./data/optionalRules.json";

export const AREAS = {
  inside: "Wewnątrz murów",
  outside: "Poza murami",
};
const OTHER = { inside: "outside", outside: "inside" };

export const allScenarios = [...scenarios.inside, ...scenarios.outside, ...scenarios.special];
export const SCENARIO_ROLL_RULE = scenarios.rollRule;

export const k66 = ([tens, units]) => tens * 10 + units;
export const validDie = (d) => Number.isInteger(d) && d >= 1 && d <= 6;

// Rulebook p. 336: K6 1–3 inside the walls, 4+ outside.
export const areaFromDie = (die) => (die <= 3 ? "inside" : "outside");

export const scenarioKey = (s) => `${s.special ? "special" : s.area}:${s.code}:${s.name}`;
export const findScenario = (key) => allScenarios.find((s) => scenarioKey(s) === key) || null;

// One K66 on an area's TABELA SCENARIUSZE – POTYCZKA.
//   11, 66 → the player with lower prestige chooses
//   12, 65 → roll on the other area's table
export const scenarioForRoll = (area, dice) => {
  const code = k66(dice);
  if (code === 11 || code === 66) return { type: "choose", area, code };
  if (code === 12 || code === 65) return { type: "reroll", area: OTHER[area], code };
  const scenario = scenarios[area].find((s) => s.code === code);
  return scenario ? { type: "scenario", area, code, scenario } : { type: "invalid", area, code };
};

// Resolves a full roll: { areaDie, first: [d,d], second?: [d,d] }.
export const resolveScenarioRoll = ({ areaDie, first, second }) => {
  if (!validDie(areaDie) || !first?.every(validDie)) return null;
  const firstResult = scenarioForRoll(areaFromDie(areaDie), first);
  if (firstResult.type !== "reroll") return { ...firstResult, steps: [firstResult] };
  if (!second?.every(validDie)) return { ...firstResult, needsSecond: true, steps: [firstResult] };
  const secondResult = scenarioForRoll(firstResult.area, second);
  // A second "roll on the other table" sends it back: treat it as a choice.
  const final =
    secondResult.type === "reroll" ? { ...secondResult, type: "choose" } : secondResult;
  return { ...final, steps: [firstResult, final] };
};

const d6 = (random) => 1 + Math.floor(random() * 6);
export const rollScenarioDice = (random = Math.random) => ({
  areaDie: d6(random),
  first: [d6(random), d6(random)],
  second: [d6(random), d6(random)],
});

// What gets stored on a game.
export const scenarioRecord = (scenario, source) => ({
  key: scenarioKey(scenario),
  name: scenario.name,
  code: scenario.code,
  area: scenario.area,
  special: !!scenario.special,
  page: scenario.page,
  source,
});
export const customScenarioRecord = (name, area) => ({
  key: null,
  name: name.trim(),
  code: null,
  area: area || null,
  special: false,
  page: null,
  source: "custom",
});

// --- Optional rules (chapter 12) -------------------------------------------
export const optionalRules = optionalRulesData.rules;
// Rules whose PD bonus applies to a whole company; the wording comes from the
// rulebook ("…otrzymują dodatkowe +1 PD").
export const OPTIONAL_RULE_PD = {
  "MGŁA WOJNY": { pd: 1, who: "heroes" },
  "OGRANICZONE POLE WIDZENIA": { pd: 1, who: "heroes" },
  "NAGŁA ŚMIERĆ": { pd: 1, who: "heroes", minRounds: 6 },
  "ZMIENNE WIATRY MAGII": { pd: 1, who: "mages" },
  "NIENATURALNA OBECNOŚĆ": { pd: 1, who: "mages" },
};
export const PD_WHO = { heroes: "bohaterowie", mages: "magowie" };
// Rules that add loot in the exploration phase, for each player's company.
export const OPTIONAL_RULE_LOOT = { "USZKODZENIE PANCERZA": 1 };
// What the app does with a rule; the rest is played at the table.
export const OPTIONAL_RULE_APP = {
  "MGŁA WOJNY": "+1 PD dla bohaterów dolicza się samo.",
  "OGRANICZONE POLE WIDZENIA": "+1 PD dla bohaterów dolicza się samo.",
  "NAGŁA ŚMIERĆ": "+1 PD dla bohaterów dolicza się samo, gdy licznik rund dojdzie do 6. Modyfikatory od 6. rundy stosujecie przy stole.",
  "ZMIENNE WIATRY MAGII": "+1 PD dla magów dolicza się samo.",
  "NIENATURALNA OBECNOŚĆ": "+1 PD dla magów dolicza się samo.",
  "USZKODZENIE PANCERZA": "+1 łup w eksploracji dolicza się sam. Uszkodzenia zaznaczacie przy modelu na ekranie gry (OP przelicza się od razu), a sekwencja po potyczce zmienia ekwipunek na stałe.",
  "ZDARZENIA LOSOWE": "Rzut K6 przed turą i tabela zdarzeń są na ekranie gry; +1 łup za każde zdarzenie dolicza się sam.",
};
export const findOptionalRule = (key) => optionalRules.find((r) => r.key === key) || null;
