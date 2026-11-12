import catalog from "./catalog.json";
import { getEquipmentStats } from "../Data.js/EquipmentStats";
import injuries from "./injuries.json";
import exploration from "./exploration.json";
import mental from "./mental-injuries.json";

export { catalog, injuries, exploration };
export const RULEBOOK = "AD2026.04.15";
export const STATS = ["Sz", "WW", "US", "S", "Wt", "Żw", "I", "A", "CP"];
export const SKILL_LISTS = [
  "Walki wręcz",
  "Strzeleckie",
  "Akademickie",
  "Siłowe",
  "Szybkościowe",
  "Specjalne",
];
export const SKILLS = [
  [
    "Błyskawiczny blok",
    "Celny cios",
    "Fechmistrz",
    "Mistrz walki",
    "Morderczy cios",
    "Oburęczność",
    "Pewny cios",
    "Rezun",
    "Szermierz",
    "Unik",
  ],
  [
    "Artylerzysta",
    "Błyskawiczne przeładowanie",
    "Bystry wzrok",
    "Celny strzał",
    "Mistrz skrytobójstwa",
    "Nożownik",
    "Pewny strzał",
    "Rajtar",
    "Strzał penetrujący",
    "Strzelec",
  ],
  [
    "Ekonom",
    "Felczer",
    "Kwatermistrz",
    "Język bitewny",
    "Łowca skarbów",
    "Strateg",
    "Światowiec",
    "Ulicznik",
    "Warzenie trucizn",
    "Żyłka handlowa",
  ],
  [
    "Gladiator",
    "Mocne nogi",
    "Oprych",
    "Reketer",
    "Silny cios",
    "Siłacz",
    "Strach",
    "Taran",
    "Twardy jak ściana",
    "Twardziel",
  ],
  [
    "Akrobata",
    "Cichociemny",
    "Hop-siup",
    "Rączy",
    "Sprint",
    "Szybki refleks",
    "Śmigły",
    "Uskok",
    "Wańka-wstańka",
    "Wspinaczka",
  ],
];
export const HERO_THRESHOLDS = [
  2, 4, 6, 8, 11, 14, 17, 20, 24, 28, 32, 36, 41, 46, 51, 57, 63, 69, 76, 83,
  90,
];
export const HENCH_THRESHOLDS = [2, 5, 9, 14];
export const clone = (value) => JSON.parse(JSON.stringify(value));
export const normal = (s) =>
  String(s || "")
    .toLocaleLowerCase("pl")
    .replace(/\s+/g, " ")
    .trim();
export const baseName = (s) =>
  normal(s)
    .replace(/\s*\(.*\)/g, "")
    .trim();
export const hasRule = (unit, rule) =>
  (unit.rules || []).some((s) => baseName(s) === baseName(rule));
export const isHero = (unit) =>
  unit.type === "Bohater" || unit.type === "Postać Dramatu";
export const heroDevelopment = (unit) =>
  isHero(unit) || unit.type === "Najemne Ostrze";
export const modelCount = (unit) =>
  Math.max(1, Math.floor(Number(unit.selectedNumber) || 1));
export const label = (unit) => unit.unitDisplayName || unit.unitName;
export const uid = () =>
  window.crypto?.randomUUID?.() ||
  `campaign-${Date.now()}-${Math.random().toString(36).slice(2)}`;
export const d6 = () => {
  // Rejection sampling avoids modulo bias and uses the browser's random source.
  if (window.crypto?.getRandomValues) {
    const a = new Uint32Array(1);
    do {
      window.crypto.getRandomValues(a);
    } while (a[0] >= 4294967292);
    return (a[0] % 6) + 1;
  }
  return Math.floor(Math.random() * 6) + 1;
};
export const roll = (count = 1) => Array.from({ length: count }, d6);
export const validDice = (dice, count) =>
  Array.isArray(dice) &&
  dice.length === count &&
  dice.every((d) => Number.isInteger(d) && d >= 1 && d <= 6);
export const sum = (dice) => dice.reduce((a, b) => a + b, 0);
export const k66 = (dice) => {
  if (!validDice(dice, 2)) throw Error("K66 wymaga dwóch kości K6.");
  return dice[0] * 10 + dice[1];
};
export const crossed = (before, after, unit) =>
  (isHero(unit) ? HERO_THRESHOLDS : HENCH_THRESHOLDS).filter(
    (x) => x > before && x <= after,
  );
export const canEarnExperience = (unit) =>
  !hasRule(unit, "Nieświadomy") && !hasRule(unit, "Zwierzę");
export const currentStats = (unit) =>
  unit.stats?.Aktualna || unit.stats?.Początkowa || [];
export const addRule = (unit, name) => {
  if (!unit.baseRules) unit.baseRules = [...(unit.rules || [])];
  if (!hasRule(unit, name)) {
    unit.rules = [...(unit.rules || []), name];
    unit.newRules = [...(unit.newRules || []), name];
  }
};
export const changeStat = (unit, index, delta) => {
  const stats = [...currentStats(unit)];
  const max = unit.stats?.Maksymalna?.[index];
  if (typeof stats[index] !== "number")
    throw Error("Ten współczynnik nie jest liczbowy.");
  const next = stats[index] + delta;
  if (next < 1 || (typeof max === "number" && next > max))
    throw Error("Wartość poza zakresem charakterystyki.");
  stats[index] = next;
  unit.stats.Aktualna = stats;
  unit.statsModifiers = (unit.stats.Początkowa || []).map((v, i) =>
    typeof v === "number" && typeof stats[i] === "number" ? stats[i] - v : 0,
  );
};
export const injuryKind = (unit) => {
  if (["Demon", "Istota eteryczna", "Leśny duch"].some((r) => hasRule(unit, r)))
    return "spirit";
  if (hasRule(unit, "Chowaniec & cherubin")) return "familiar";
  if (
    ["Nieumarły", "Opętany", "Wierzchowiec", "Zwierzę"].some((r) =>
      hasRule(unit, r),
    )
  )
    return "undead";
  if (
    !isHero(unit) &&
    ["Potwór", "Machina wojenna", "Wielkolud"].some((r) => hasRule(unit, r))
  )
    return "monster";
  return isHero(unit) ? "hero" : "henchman";
};
export const INJURY_TABLES = {
  henchman: "Stronnik / Najemne Ostrze, K6: 1–2 martwy, 3+ powrót do zdrowia.",
  spirit:
    "Demon / istota eteryczna / leśny duch, K6: 1–2 martwy, 3 opuszcza następną potyczkę, 4+ powrót do zdrowia.",
  undead:
    "Nieumarły / opętany / wierzchowiec / zwierzę, K6: 1 martwy, 2 opuszcza następną potyczkę, 3+ powrót do zdrowia.",
  familiar: "Chowaniec / cherubin, K6: 1 martwy, 2+ powrót do zdrowia.",
  monster:
    "Potwór / machina wojenna / wielkolud, K6: 1 martwy, 2–3 opuszcza następną potyczkę, 4+ powrót do zdrowia.",
};
export const injuryResult = (unit, dice, modifier = 0) => {
  const kind = injuryKind(unit);
  if (!validDice(dice, kind === "hero" ? 2 : 1))
    throw Error("Nieprawidłowe kości obrażeń.");
  if (kind === "hero")
    return {
      ...injuries.find((r) => k66(dice) >= r.min && k66(dice) <= r.max),
      code: k66(dice),
    };
  const n = Math.min(6, dice[0] + modifier);
  const dead = n <= (["spirit", "henchman"].includes(kind) ? 2 : 1);
  const skip =
    !dead &&
    (kind === "spirit"
      ? n === 3
      : kind === "undead"
        ? n === 2
        : kind === "monster"
          ? n <= 3
          : false);
  return {
    code: dead ? 11 : skip ? 35 : 41,
    name: dead
      ? "Martwy"
      : skip
        ? "Opuszcza następną potyczkę"
        : "Powrót do zdrowia",
    text: dead
      ? ["Najemne Ostrze", "Postać Dramatu"].includes(unit.type)
        ? "Model ginie, a jego dobytek przepada."
        : "Model ginie, a jego ekwipunek trafia do skarbca."
      : skip
        ? "Model opuszcza następną potyczkę."
        : "Model powraca do zdrowia.",
    roll: n,
    simple: true,
    skip: skip ? 1 : 0,
  };
};
export const MULTIPLE_INJURIES = [
  [11, 14, 22],
  [15, 22, 23],
  [23, 24, 24],
  [25, 31, 25],
  [32, 34, 26],
  [35, 36, 31],
  [41, 43, 32],
  [44, 46, 33],
  [51, 54, 34],
  [55, 56, 35],
  [61, 62, 56],
  [63, 64, 62],
  [65, 66, 64],
];
export const multipleInjury = (dice) =>
  injuries.find(
    (r) =>
      r.min ===
      MULTIPLE_INJURIES.find(([a, b]) => k66(dice) >= a && k66(dice) <= b)[2],
  );
export const repeats = (dice) => {
  const counts = {};
  dice.forEach((d) => {
    counts[d] = (counts[d] || 0) + 1;
  });
  return Object.entries(counts)
    .filter(([, n]) => n >= 2)
    .map(([face, n]) => ({
      face: Number(face),
      count: n,
      key: String(face).repeat(n),
    }))
    .sort((a, b) => b.count - a.count || b.face - a.face);
};
export const explorationResult = (dice, area, modifier = 0) => {
  const total = sum(dice) + modifier;
  const matches = repeats(dice);
  const best = matches[0];
  return {
    matches,
    best: best
      ? exploration.find((x) => x.area === area && x.key === best.key)
      : null,
    total,
    loot: !dice.length
      ? 0
      : total < 6
        ? 1
        : total < 12
          ? 2
          : total < 18
            ? 3
            : total < 25
              ? 4
              : total < 31
                ? 5
                : total < 36
                  ? 6
                  : 7,
  };
};
export const INCOME = [
  [50, 65, 80, 95, 110, 120, 130, 140, 145, 150],
  [45, 60, 75, 90, 105, 110, 120, 130, 135, 140],
  [40, 55, 70, 85, 100, 105, 110, 120, 125, 130],
  [35, 45, 65, 75, 90, 95, 100, 110, 115, 120],
  [30, 40, 55, 65, 75, 80, 85, 90, 95, 100],
  [25, 30, 45, 55, 60, 65, 70, 75, 80, 85],
];
export const income = (loot, models, players, totalSold, modifier = 0) => {
  if (!Number.isInteger(loot) || loot < 0)
    throw Error("Nieprawidłowa liczba łupów.");
  if (!loot) return 0;
  const level = Math.min(5, Math.max(0, Math.ceil(models / 3) - 1));
  const supply = totalSold - players * 5;
  return INCOME[Math.max(0, Math.min(5, level + supply + modifier))][
    Math.min(10, loot) - 1
  ];
};
export const priceRoll = (expression, dice = []) => {
  const expr = expression
    .toUpperCase()
    .replace(/[ ×*]/g, "")
    .replace(/X/g, "x");
  if (/^\d+$/.test(expr)) return { price: Number(expr), count: 0 };
  const m = expr.match(/^(?:(\d+)\+)?(\d*)K(\d+)(?:x(\d+))?$/);
  if (!m) throw Error("Cena wymaga wyboru wariantu przedmiotu.");
  const count = Number(m[2] || 1),
    sides = Number(m[3]);
  if (!validDice(dice, count)) throw Error(`Wpisz ${count} wyników K6.`);
  const results = dice.map((x) =>
    sides === 6 ? x : Math.ceil((x * sides) / 6),
  );
  return { price: Number(m[1] || 0) + sum(results) * Number(m[4] || 1), count };
};
export const priceDiceCount = (expression) => {
  const m = expression.match(/(\d*)K\d/i);
  return m ? Number(m[1] || 1) : 0;
};
// Rozwój stronników (s. 414): grupa nie może dwa razy otrzymać tego samego
// rozwinięcia charakterystyki. Sekwencja po potyczce i ręczna edycja zapisują
// rozwinięcia w campaignAdvancements; rozpiski sprzed tego zapisu traktują jako
// rozwinięte współczynniki wyższe od początkowych.
export const takenAdvances = (unit) =>
  Array.isArray(unit.campaignAdvancements)
    ? unit.campaignAdvancements
    : (unit.stats?.Początkowa || []).flatMap((base, i) =>
        typeof base === "number" &&
        typeof currentStats(unit)[i] === "number" &&
        currentStats(unit)[i] > base
          ? [i]
          : [],
      );
export const allAdvancementStatsMaxed = (unit) =>
  (heroDevelopment(unit) ? [1, 2, 3, 4, 5, 6, 7, 8] : [1, 2, 3, 6, 7, 8]).every(
    (i) =>
      typeof currentStats(unit)[i] !== "number" ||
      (typeof unit.stats.Maksymalna?.[i] === "number" &&
        currentStats(unit)[i] >= unit.stats.Maksymalna[i]),
  );
export const availableStats = (unit, result) => {
  if (allAdvancementStatsMaxed(unit))
    return typeof unit.stats.Maksymalna?.[0] === "number" &&
      currentStats(unit)[0] < unit.stats.Maksymalna[0] &&
      (isHero(unit) || !takenAdvances(unit).includes(0))
      ? [0]
      : [];
  const options = heroDevelopment(unit)
    ? result <= 5 || result >= 10
      ? []
      : result === 6
        ? [3, 4]
        : result === 7
          ? [1, 2]
          : result === 8
            ? [6, 8]
            : [7, 5]
    : result <= 5
      ? [6, 8]
      : result <= 7
        ? [1, 2]
        : result <= 9
          ? [3, 7]
          : [];
  return options.filter(
    (i) =>
      typeof currentStats(unit)[i] === "number" &&
      (typeof unit.stats.Maksymalna?.[i] !== "number" ||
        currentStats(unit)[i] < unit.stats.Maksymalna[i]) &&
      (isHero(unit) || !takenAdvances(unit).includes(i)),
  );
};
// Short name of a development roll, shown before the player picks a result.
export const advanceLabel = (unit, n) => {
  if (!n) return "";
  if (heroDevelopment(unit) && (n <= 5 || n >= 10)) return "Nowa umiejętność";
  if (!heroDevelopment(unit) && n >= 10) return "Chłopak ma talent!";
  const options = heroDevelopment(unit)
    ? n === 6
      ? [3, 4]
      : n === 7
        ? [1, 2]
        : n === 8
          ? [6, 8]
          : [7, 5]
    : n <= 5
      ? [6, 8]
      : n <= 7
        ? [1, 2]
        : [3, 7];
  return `${options.map((i) => STATS[i]).join(" lub ")} +1`;
};
export const needsSkill = (unit, n) =>
  heroDevelopment(unit) && (n <= 5 || n >= 10);
export const skillChoices = (unit) =>
  [...new Set([...(unit.skills || []), ...(unit.campaignSkillAccess || [])])]
    .filter((i) => i < 5)
    .flatMap((i) => SKILLS[i].map((name) => ({ name, list: SKILL_LISTS[i] })))
    .filter(
      (s) =>
        !hasRule(unit, s.name) &&
        (!["Ekonom", "Język bitewny", "Strateg"].includes(s.name) ||
          hasRule(unit, "Dowódca")),
    );

const aliases = (name) =>
  baseName(name)
    .split("/")
    .map((x) => x.trim());
const armourNames = {
  "pancerz skórzany /": "lekki",
  "pancerz kolczy /": "średni",
  "zbroja płytowa": "ciężki",
};
export const itemBaseNames = (item) => {
  let name = item.name;
  const qualifier = name.match(/\(([^)]+)\)/)?.[1];
  if (item.category === "Magiczny oręż" || item.category === "Magiczna zbroja")
    name = qualifier || name;
  if (/^lekki pancerz/i.test(name)) name = "Lekki";
  if (/^średni pancerz/i.test(name)) name = "Średni";
  if (/^ciężki pancerz/i.test(name)) name = "Ciężki";
  for (const [key, value] of Object.entries(armourNames))
    if (baseName(name).startsWith(key)) name = value;
  if (baseName(name) === "młoty/topory") return ["broń miotana"];
  return aliases(name);
};
export const equipmentPermission = (unit, item, armyName) => {
  if (!unit) return "Wybierz postać.";
  if (unit.type === "Najemne Ostrze")
    return "Najemne Ostrza używają własnego ekwipunku.";
  const text = normal(item.text);
  const army = normal(armyName);
  if (/dla wielkoluda/.test(normal(item.name)) && !hasRule(unit, "Wielkolud"))
    return "Pancerz dla wielkoluda.";
  const only = text.match(
    /(?:dostępn\w*|używan\w*)\s+(?:jest\s+)?(?:wyłącznie|jedynie)\s+dla\s+kompanii\s+([^.;]+)/,
  );
  if (only && !only[1].includes(army))
    return "Przedmiot przeznaczony dla innej kompanii.";
  if (/tylko dowódca/.test(normal(item.name)) && !hasRule(unit, "Dowódca"))
    return "Tylko dowódca.";
  if (
    item.category === "Arkana" &&
    !hasRule(unit, "Mag") &&
    !hasRule(unit, "Duchowny")
  )
    return "Arkana: tylko mag lub duchowny.";
  if (item.category === "Chowańce i cherubiny") {
    if (/tylko mag/.test(normal(item.name)) && !hasRule(unit, "Mag"))
      return "Tylko mag.";
    if (/tylko duchowny/.test(normal(item.name)) && !hasRule(unit, "Duchowny"))
      return "Tylko duchowny.";
  }
  if (
    (item.category.startsWith("Magicz") || item.category === "Arkana") &&
    !isHero(unit)
  )
    return "Przedmioty magiczne są dostępne tylko dla bohaterów.";
  const profile =
    getEquipmentStats(item.name) ||
    itemBaseNames(item)
      .map(
        (name) =>
          Object.entries(unit.equipmentList || {}).find(([key]) =>
            aliases(key).includes(name),
          )?.[0],
      )
      .filter(Boolean)
      .map(getEquipmentStats)
      .find(Boolean);
  if (
    hasRule(unit, "Amputowane ramię") &&
    /wymaga obu rąk/i.test(profile?.rules || item.text)
  )
    return "Amputowane ramię: nie można używać broni wymagającej obu rąk.";
  const weapon =
    item.category.startsWith("Oręż") ||
    item.category === "Tarcza i pancerz" ||
    ["Magiczny oręż", "Magiczna zbroja"].includes(item.category);
  if (!weapon)
    return isHero(unit)
      ? null
      : "Ekwipunek specjalny jest dostępny dla bohaterów.";
  const allowed = Object.entries(unit.equipmentList || {})
    .filter(([, v]) => v[1] < 3)
    .flatMap(([key]) => aliases(key));
  if (itemBaseNames(item).some((name) => allowed.includes(name))) return null;
  if (
    item.category === "Oręż — walka wręcz" &&
    hasRule(unit, "Fechmistrz") &&
    !/spacz/.test(normal(item.name))
  )
    return null;
  if (
    (item.category === "Oręż — dystansowy" ||
      item.category === "Oręż — prochowy") &&
    hasRule(unit, "Strzelec") &&
    !/spacz|kulomiot|miotacz spaczognia|moździerz trującego wichru/.test(
      normal(item.name),
    )
  )
    return null;
  return "Poza listą ekwipunku tej postaci.";
};
export const campaignDefaults = () => ({
  version: 1,
  rulebook: RULEBOOK,
  settings: { obled: false, choroby: false, mutacje: false },
  history: [],
  inventory: [],
  activeBattle: null,
});
export const newBattle = (units) => ({
  id: uid(),
  stage: 0,
  gameName: "",
  date: new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Warsaw" }).format(
    new Date(),
  ),
  opponent: "",
  scenario: "",
  area: "inside",
  result: "loss",
  round: 10,
  opponentModels: 0,
  opponentOut: 0,
  ownPrestige: 0,
  opponentPrestige: 0,
  players: 2,
  totalSold: 0,
  notes: "",
  post: null,
  startedAt: new Date().toISOString(),
  rosterIds: units.map((u) => u.uniqueId),
});
// Żółtodzioby (rozdział 13, s. 414): słabsza kompania dostaje zasady, PD i zk
// zależnie od różnicy prestiżu ustalonej przed rozgrywką.
export const UNDERDOG = [
  { min: 51, rules: ["Pazerność"], exp: 1, gold: 20, dice: 2 },
  { min: 76, rules: ["Kompania najemników", "Pazerność"], exp: 2, gold: 40, dice: 2 },
  { min: 101, rules: ["Kompania najemników", "Pazerność"], exp: 3, gold: 55, dice: 3 },
  {
    min: 151,
    rules: ["Kompania najemników", "Pazerność", "Samowystarczalni"],
    exp: 4,
    gold: 65,
    dice: 4,
  },
  {
    min: 301,
    rules: ["Kompania najemników", "Pazerność", "Odkrywcy", "Samowystarczalni"],
    exp: 5,
    gold: 70,
    dice: 5,
  },
];
export const underdogBonus = (own, opponent) => {
  const diff = (Number(opponent) || 0) - (Number(own) || 0);
  const row = [...UNDERDOG].reverse().find((r) => diff >= r.min);
  return row ? { diff, ...row } : null;
};
export const beginPostBattle = (battle, units, notes, army = {}) => ({
  ...battle,
  stage: 1,
  post: {
    underdog: underdogBonus(battle.ownPrestige, battle.opponentPrestige),
    units: clone(units).map((u) => ({
      ...u,
      campaignModelStatus: Array.from({ length: modelCount(u) }, (_, i) => ({
        ...u.campaignModelStatus?.[i],
        skip: Math.max(
          0,
          (u.campaignModelStatus?.[i]?.skip || 0) -
            (u.battleAbsentModels?.[i] ? 1 : 0),
        ),
      })),
    })),
    battleId: battle.id,
    obledSetting: !!notes.campaign?.settings?.obled,
    sanityBefore: Object.fromEntries(
      units.map((u) => [u.uniqueId, Number(u.obled) || 0]),
    ),
    armyRules: [
      ...(army.armyRules || []),
      ...(notes.specialRules || []),
      ...(underdogBonus(battle.ownPrestige, battle.opponentPrestige)?.rules ||
        []),
    ],
    companyAdvancements: clone(notes.campaign?.companyAdvancements || []),
    persistentEffects: clone(notes.campaign?.persistentEffects || {}),
    futureEffects: clone(
      (notes.campaign?.futureEffects || []).filter(
        (e) => e.area && e.area !== battle.area,
      ),
    ),
    activeFutureEffects: clone(
      (notes.campaign?.futureEffects || []).filter(
        (e) => !e.area || e.area === battle.area,
      ),
    ),
    effects: {},
    deadDrama: clone(notes.campaign?.deadDrama || []),
    mercenaryBans: Object.fromEntries(
      Object.entries(notes.campaign?.mercenaryBans || {}).map(([name, n]) => [
        name,
        Math.max(0, n - 1),
      ]),
    ),
    treasury: Math.max(0, Number(notes.skarbiec) || 0),
    loot: Math.max(0, Number(notes.kosztownosci) || 0),
    inventory: clone(notes.campaign?.inventory || []),
    injuries: {},
    expApplied: false,
    advances: [],
    campaignPointsApplied: false,
    exploration: null,
    explorationApplied: false,
    lootSold: false,
    availability: null,
    quotes: {},
    journal: [],
    checklist: {},
  },
});
export const log = (post, type, text, data = {}) =>
  post.journal.push({
    id: uid(),
    at: new Date().toISOString(),
    type,
    text,
    ...data,
  });
export const activeModel = (unit, i) =>
  !unit.battleAbsentModels?.[i] &&
  !(unit.campaignModelStatus?.[i]?.skip > 0) &&
  !unit.campaignModelStatus?.[i]?.captured;
export const eligibleHeroes = (units) =>
  units.filter(
    (u) =>
      u.type === "Bohater" &&
      activeModel(u, 0) &&
      !u.battleOutOfActionModels?.[0],
  );
export const injuryTasks = (post) =>
  post.units.flatMap((u) =>
    Array.from({ length: modelCount(u) }, (_, i) => ({
      unitId: u.uniqueId,
      index: i,
      key: `${u.uniqueId}:${i}`,
      unit: u,
      outOfAction: true,
    })).filter(
      (t) =>
        !u.battleAbsentModels?.[t.index] &&
        u.battleOutOfActionModels?.[t.index],
    ),
  );
export const storeItem = (post, name, quantity = 1, extra = {}) => {
  const existing = post.inventory.find(
    (i) =>
      normal(i.name) === normal(name) &&
      i.catalogId === extra.catalogId &&
      JSON.stringify(i.crafting || null) ===
        JSON.stringify(extra.crafting || null),
  );
  if (existing) existing.quantity += quantity;
  else post.inventory.push({ id: uid(), name, quantity, ...extra });
};
export function grantExperience(post, unit, amount, reason) {
  if (!canEarnExperience(unit)) return;
  const old = Number(unit.exp) || 0;
  unit.exp = Math.min(isHero(unit) ? 90 : 14, Math.max(0, old + amount));
  crossed(old, unit.exp, unit).forEach((threshold) =>
    post.advances.push({
      id: uid(),
      unitId: unit.uniqueId,
      threshold,
      resolved: false,
      rolls: [],
      reason,
    }),
  );
  log(
    post,
    "experience",
    `${label(unit)}: ${old} → ${unit.exp} PD · ${reason}`,
    { unitId: unit.uniqueId, gained: unit.exp - old },
  );
}
// Tabela poważnych ran (s. 410): tylko trwałe skutki zostają na karcie
// postaci. Śmierć, pauza, niewola, ograbienie i premie PD są jednorazowe;
// trwałą część Rany ręki i Strzaskanej nogi zapisuje osobna zasada.
export const LASTING_INJURY_CODES = [22, 24, 26, 31, 32, 33, 34, 56, 62, 64];
export const TEMPORARY_INJURY_NAMES = [
  "Martwy",
  "Opuszcza następną potyczkę",
  "Powrót do zdrowia",
  "Wielokrotnie zraniony",
  "Rana ręki",
  "Strzaskana noga",
  "Głębokie rany",
  "Ograbiony",
  "Pojmany",
  "Zwerbowany na arenę",
  "Wbrew wszystkiemu",
];
export const lastingInjuries = (list) =>
  (list || []).filter((name) => !TEMPORARY_INJURY_NAMES.includes(name));
// Rozdział 13, Obłęd (s. 411): bohater otrzymuje +K3 PO za każde WzA, chyba
// że podlega zasadzie NIEZŁOMNY.
export const wzaSanityRequired = (post, task) =>
  !!post.obledSetting &&
  !!task.outOfAction &&
  isHero(task.unit || post.units.find((u) => u.uniqueId === task.unitId)) &&
  !hasRule(
    task.unit || post.units.find((u) => u.uniqueId === task.unitId),
    "Niezłomny",
  );
// Tabela chorób psychicznych (s. 412-413): jedna procedura dla progów Obłędu
// i wyniku SZALEŃSTWO z tabeli poważnych ran.
const ILLNESS_RULES = {
  14: ["Alkoholizm"],
  16: ["Animozja"],
  22: ["Berserk"],
  23: ["Zimnokrwisty"],
  32: ["Furia"],
  33: ["Głód krwi"],
  34: ["Głupota"],
  52: ["Animozja", "Nienawiść"],
  66: ["Przepastne trzewia"],
};
export function applyIllness(post, unit, dice, note = "") {
  if (!validDice(dice, 2))
    throw Error("Wpisz wynik K66 choroby psychicznej.");
  const entry = mental.find((e) => e.code === k66(dice));
  const text = String(note || "");
  if (entry.code === 15 && !text.trim())
    throw Error(
      "Rozstrzygnij utratę umiejętności z opisu amnezji i zapisz wynik w notatce.",
    );
  addRule(unit, entry.name);
  unit.mentalIllnesses = [
    ...(unit.mentalIllnesses || []),
    { ...entry, acquiredAt: post.battleId || null, age: 0, note: text },
  ];
  unit.campaignRuleTexts = {
    ...(unit.campaignRuleTexts || {}),
    [entry.name]: entry.text,
  };
  // The named illness remains the authoritative description for conditional effects.
  (ILLNESS_RULES[entry.code] || []).forEach((name) => addRule(unit, name));
  log(post, "mental", `${label(unit)}: ${entry.name}. ${text}`);
  return entry;
}
// Ograbiony / porażka na arenie: model traci cały ekwipunek, a koszt wraca do
// kosztu profilu (ekwipunek startowy jest wliczony w cenę profilu).
export const stripEquipment = (unit) => {
  const baseIds = Array.isArray(unit.baseCustomEquipmentIds)
    ? unit.baseCustomEquipmentIds
    : null;
  const optional = (unit.optionalEquipment || [])
    .filter((n) => n !== "Sygnalista" && n !== "Chorąży")
    .reduce((n, name) => n + (Number(unit.equipmentList?.[name]?.[0]) || 0), 0);
  const custom = (unit.customEquipment || [])
    .filter((e) => e && typeof e === "object" && !baseIds?.includes(e.id))
    .reduce((n, e) => n + Math.max(0, Number(e.price) || 0), 0);
  unit.cost = Math.max(0, (Number(unit.cost) || 0) - optional - custom);
  unit.totalCost = unit.cost * modelCount(unit);
  unit.startingEquipment = [];
  unit.optionalEquipment = [];
  unit.customEquipment = [];
  unit.campaignEquipment = [];
  unit.craftedEquipment = {};
  unit.weaponEnhancements = {};
  unit.equipmentAliasSelections = {};
  if (baseIds) unit.baseCustomEquipmentIds = [];
};
export const applyInjury = (post, task, result, detail = {}) => {
  if (post.injuries[task.key])
    throw Error("Obrażenia tego modelu już rozstrzygnięto.");
  const unit = post.units.find((u) => u.uniqueId === task.unitId);
  const sanityDie = wzaSanityRequired(post, { ...task, unit });
  if (sanityDie && !validDice(detail.obled, 1))
    throw Error("Rzuć K3 Punktów Obłędu za Wyłączenie z akcji!.");
  // Wspólna lista ran grupy nie wskazuje jednego modelu, więc powtórzenia
  // (druga noga, oko, ramię) liczą się tylko dla pojedynczych postaci.
  const single = modelCount(unit) === 1;
  const status = {
    ...(unit.campaignModelStatus?.[task.index] || {}),
    dead: false,
    skip: unit.campaignModelStatus?.[task.index]?.skip || 0,
    captured: !!unit.campaignModelStatus?.[task.index]?.captured,
  };
  const apply = (r, d = detail) => {
    const code = r.min || r.code;
    if (code === 16) {
      if (!validDice(d.secondary, 1))
        throw Error("Rzuć na liczbę dodatkowych ran K3.");
      const count = Math.ceil(d.secondary[0] / 2);
      // A corrected K3 must not leave stale extra wounds behind.
      const children = (d.children || []).slice(0, count);
      if (children.length !== count)
        throw Error("Rozstrzygnij wszystkie dodatkowe rany.");
      children.forEach((child) => {
        if (!validDice(child?.dice, 2))
          throw Error("Wpisz K66 każdej dodatkowej rany.");
        apply(multipleInjury(child.dice), child);
      });
    }
    if (code === 24) {
      if (!validDice(d.mental, 2))
        throw Error("Wykonaj rzut K66 na chorobę psychiczną.");
      applyIllness(post, unit, d.mental, d.note);
    }
    if (code === 56) {
      if (!validDice(d.secondary, 1))
        throw Error("Wykonaj rzut na cel nienawiści.");
      const target =
        d.secondary[0] <= 3
          ? "sprawca WzA"
          : d.secondary[0] === 4
            ? "dowódca przeciwnika"
            : d.secondary[0] === 5
              ? "kompania przeciwnika"
              : "kompania przeciwnika i wszystkie tego typu";
      // Owner's decision: an existing NIENAWIŚĆ is kept; the roll is logged.
      if (hasRule(unit, "Nienawiść"))
        log(
          post,
          "injury",
          `${label(unit)}: Zawzięty wróg (${target}) — nienawiści nie dodano, bohater już podlega zasadzie Nienawiść.`,
          { unitId: unit.uniqueId },
        );
      else addRule(unit, `Nienawiść (${target})`);
    }
    if (code === 65) {
      if (!["win", "loss"].includes(d.arena))
        throw Error("Wpisz wynik walki na arenie.");
      if (d.arena === "win") {
        post.treasury += 50;
        if (post.expApplied) grantExperience(post, unit, 2, "Walki na arenie");
        else addBattleExp(unit, 2, "Walki na arenie");
      } else {
        if (!validDice(d.secondary, 1))
          throw Error("Rzuć na następstwa porażki na arenie.");
        if (d.secondary[0] <= 2) {
          const child = d.children?.[0];
          if (!validDice(child?.dice, 2))
            throw Error("Wpisz K66 dodatkowej rany z areny.");
          apply(multipleInjury(child.dice), child);
        } else stripEquipment(unit);
      }
    }
    if (!r.simple && LASTING_INJURY_CODES.includes(code))
      unit.injuries = [...(unit.injuries || []), r.name];
    if (r.code === 11 || r.min === 11) status.dead = true;
    if (r.simple) status.skip = Math.max(status.skip, r.skip);
    if (code === 22) {
      const n = (unit.injuries || []).filter((s) => s === r.name).length;
      if (single && n >= 2) status.dead = true;
      else
        changeStat(
          unit,
          0,
          Math.max(1, Math.floor(currentStats(unit)[0] / 2)) -
            currentStats(unit)[0],
        );
    }
    if ([26, 31, 33, 34].includes(code)) {
      const index = { 26: 4, 31: 2, 33: 6, 34: 1 }[code];
      if (currentStats(unit)[index] > 1) changeStat(unit, index, -1);
      if (
        single &&
        code === 31 &&
        unit.injuries.filter((s) => s === r.name).length >= 2
      )
        status.dead = true;
    }
    if ([23, 25].includes(code)) {
      if (!validDice(d.secondary, 1)) throw Error("Wykonaj dodatkowy rzut K6.");
      if (d.secondary[0] === 1) {
        if (single && code === 23 && hasRule(unit, "Amputowane ramię"))
          status.dead = true;
        addRule(
          unit,
          code === 23 ? "Amputowane ramię" : "Trwale uszkodzona noga",
        );
      } else status.skip = Math.max(status.skip, 1);
    }
    if (code === 35 && !r.simple) {
      if (!validDice(d.secondary, 1)) throw Error("Wykonaj rzut K3 (kość K6).");
      status.skip = Math.max(status.skip, Math.ceil(d.secondary[0] / 2));
    }
    if (code === 61) status.captured = true;
    if (code === 62) addRule(unit, "Odporny na strach (groza jako strach)");
    if (code === 64) addRule(unit, "Strach");
    if (code === 66) {
      if (post.expApplied)
        grantExperience(post, unit, 1, "Przeżył wbrew przeciwnościom");
      else addBattleExp(unit, 1, "Przeżył wbrew przeciwnościom");
    }
    if (code === 36) stripEquipment(unit);
  };
  apply(result);
  if (sanityDie) {
    const gained = Math.ceil(detail.obled[0] / 2);
    unit.battleObled = (Number(unit.battleObled) || 0) + gained;
    log(
      post,
      "sanity",
      `${label(unit)}: +${gained} PO za Wyłączenie z akcji! (K3).`,
      { unitId: unit.uniqueId, gained },
    );
  }
  if (detail.note)
    unit.campaignNotes = [...(unit.campaignNotes || []), detail.note];
  unit.campaignModelStatus = Array.from({ length: modelCount(unit) }, (_, i) =>
    i === task.index ? status : { ...(unit.campaignModelStatus?.[i] || {}) },
  );
  if (status.dead && unit.type === "Postać Dramatu")
    post.deadDrama = [
      ...new Set([...(post.deadDrama || []), unit.dramaId || unit.unitName]),
    ];
  post.injuries[task.key] = {
    result: result.name,
    code: result.code,
    detail,
    status,
    unitId: unit.uniqueId,
    index: task.index,
    label:
      modelCount(unit) > 1 ? `${label(unit)} #${task.index + 1}` : label(unit),
    outOfAction: !!task.outOfAction,
  };
  if (
    status.dead &&
    !["Najemne Ostrze", "Postać Dramatu"].includes(unit.type)
  ) {
    [
      ...(unit.startingEquipment || []),
      ...(unit.optionalEquipment || []),
      ...(unit.customEquipment || []),
    ].forEach((entry) => {
      const name = typeof entry === "string" ? entry : entry.name;
      const metadata = (unit.campaignEquipment || []).find(
        (item) => normal(item.name) === normal(name),
      );
      storeItem(post, name, 1, {
        ...(metadata?.catalogId ? { catalogId: metadata.catalogId } : {}),
        basePrice: metadata?.basePrice || unit.equipmentList?.[name]?.[0] || 0,
        ...(unit.craftedEquipment?.[name]
          ? { crafting: clone(unit.craftedEquipment[name]) }
          : {}),
      });
    });
  }
  log(post, "injury", `${label(unit)} #${task.index + 1}: ${result.name}`, {
    unitId: unit.uniqueId,
  });
};
// Krok 9 (s. 408): grupy stronników można dzielić i łączyć; modele w grupie
// muszą mieć ten sam oręż i pancerz (a tu także to samo doświadczenie i profil).
const gear = (u) =>
  JSON.stringify(
    [
      ...(u.startingEquipment || []),
      ...(u.optionalEquipment || []),
      ...(u.customEquipment || []).map((e) => e?.name || e),
    ]
      .map(String)
      .sort(),
  );
const living = (u) =>
  Array.from({ length: modelCount(u) }, (_, i) => i).filter(
    (i) => !u.campaignModelStatus?.[i]?.dead,
  );
export const isGroup = (u) => u.type === "Stronnik";
export const groupSize = (u) => living(u).length;
export const groupLimit = (u) => Math.min(5, Number(u.number) || 5);
export const mergeProblem = (a, b) => {
  if (a === b) return "To ta sama grupa.";
  if (!isGroup(a) || !isGroup(b)) return "Łączyć można tylko grupy stronników.";
  if (a.unitName !== b.unitName) return "To różne rodzaje stronników.";
  if ((Number(a.exp) || 0) !== (Number(b.exp) || 0))
    return "Grupy mają różne doświadczenie.";
  if (gear(a) !== gear(b)) return "Grupy mają różny oręż i pancerz.";
  if (
    JSON.stringify(currentStats(a)) !== JSON.stringify(currentStats(b)) ||
    JSON.stringify([...(a.rules || [])].sort()) !==
      JSON.stringify([...(b.rules || [])].sort())
  )
    return "Grupy mają różne rozwinięcia.";
  if (groupSize(a) + groupSize(b) > groupLimit(a))
    return `Grupa może liczyć najwyżej ${groupLimit(a)} modeli.`;
  return null;
};
const keepModels = (u, indices) => {
  const pick = (arr) => indices.map((i) => arr?.[i]);
  u.campaignModelStatus = pick(u.campaignModelStatus || []).map((s) => s || {});
  // Injuries are resolved before step 9 and keyed by model index; clearing the
  // markers keeps renumbered models from asking for injuries again.
  u.battleOutOfActionModels = indices.map(() => false);
  u.battleAbsentModels = pick(u.battleAbsentModels).map(Boolean);
  u.selectedNumber = indices.length;
  u.totalCost = (Number(u.cost) || 0) * indices.length;
};
const injuriesSettled = (post) => {
  if (injuryTasks(post).some((t) => !post.injuries?.[t.key]))
    throw Error("Najpierw rozstrzygnij poważne rany.");
};
export const splitGroup = (post, unitId, moved) => {
  injuriesSettled(post);
  const u = post.units.find((x) => x.uniqueId === unitId);
  if (!u || !isGroup(u)) throw Error("Wybierz grupę stronników.");
  const alive = living(u);
  const indices = [...new Set(moved)].filter((i) => alive.includes(i));
  if (!indices.length) throw Error("Zaznacz modele do nowej grupy.");
  if (indices.length >= alive.length)
    throw Error("W dotychczasowej grupie musi zostać co najmniej jeden model.");
  const fresh = clone(u);
  fresh.uniqueId = uid();
  fresh.unitDisplayName = `${u.unitName} (grupa ${
    post.units.filter((x) => x.unitName === u.unitName).length + 1
  })`;
  keepModels(fresh, indices);
  keepModels(
    u,
    Array.from({ length: modelCount(u) }, (_, i) => i).filter(
      (i) => !indices.includes(i),
    ),
  );
  post.units.splice(post.units.indexOf(u) + 1, 0, fresh);
  log(
    post,
    "group",
    `${label(u)}: wydzielono nową grupę (${indices.length} modeli).`,
  );
  return fresh.uniqueId;
};
export const mergeGroups = (post, targetId, sourceId) => {
  injuriesSettled(post);
  const a = post.units.find((x) => x.uniqueId === targetId),
    b = post.units.find((x) => x.uniqueId === sourceId);
  if (!a || !b) throw Error("Nie znaleziono grupy.");
  const problem = mergeProblem(a, b);
  if (problem) throw Error(problem);
  const join = (x, n) =>
    Array.from({ length: modelCount(x) }, (_, i) => i).filter(
      (i) => !x.campaignModelStatus?.[i]?.dead,
    ).map((i) => ({
      s: x.campaignModelStatus?.[i] || {},
      ab: !!x.battleAbsentModels?.[i],
    }));
  const all = [...join(a), ...join(b)];
  a.campaignModelStatus = all.map((m) => m.s);
  a.battleOutOfActionModels = all.map(() => false);
  a.battleAbsentModels = all.map((m) => m.ab);
  a.selectedNumber = all.length;
  a.totalCost = (Number(a.cost) || 0) * all.length;
  post.units = post.units.filter((x) => x !== b);
  log(post, "group", `${label(b)} dołącza do ${label(a)} (${all.length} modeli).`);
};
// Punkty Kampanii (s. 418). Odporność liczy się względem modeli, które wzięły
// udział w potyczce. Wojownicy Khorna dostają Gniew także za własne WzA:
// odsetek liczony jest wtedy od wszystkich modeli obu kompanii.
export const isKhorne = (post) =>
  !!post.khorne ||
  (post.armyRules || []).some((r) => /znak chaosu.*khorn/i.test(r));
const gniewFor = (ratio) =>
  ratio > 0.75 ? 3 : ratio > 0.5 ? 2 : ratio > 0.25 ? 1 : 0;
export const suggestCampaignPoints = (battle, post) => {
  const playing = (u, i) => !u.battleAbsentModels?.[i];
  let out = 0,
    count = 0;
  for (const u of post.units)
    for (let i = 0; i < modelCount(u); i++)
      if (playing(u, i)) {
        count++;
        if (u.battleOutOfActionModels?.[i]) out++;
      }
  const khorne = isKhorne(post);
  const enemy = Number(battle.opponentModels) || 0,
    enemyOut = Number(battle.opponentOut) || 0;
  const gniewRatio = khorne
    ? enemy + count
      ? (enemyOut + out) / (enemy + count)
      : 0
    : enemy
      ? enemyOut / enemy
      : 0;
  return {
    out,
    count,
    khorne,
    suggested: {
      determinacja:
        1 +
        (battle.result === "win"
          ? battle.round <= 4
            ? 2
            : battle.round <= 9
              ? 1
              : 0
          : 0),
      gniew: gniewFor(gniewRatio),
      odpornosc: !count
        ? 0
        : out / count < 0.25
          ? 3
          : out / count < 0.5
            ? 2
            : out / count < 0.75
              ? 1
              : 0,
    },
  };
};
// Śmierć dowódcy (s. 409): dowództwo przejmuje bohater z najwyższym CP, potem
// z większą liczbą PD; przy pełnym remisie decyduje rzut kością.
export const leaderSuccession = (post) => {
  const leader = post.units.find(
    (u) =>
      isHero(u) &&
      modelCount(u) === 1 &&
      hasRule(u, "Dowódca") &&
      u.campaignModelStatus?.[0]?.dead,
  );
  if (!leader) return null;
  const score = (u) => [Number(currentStats(u)[8]) || 0, Number(u.exp) || 0];
  const candidates = post.units
    .filter(
      (u) =>
        u !== leader &&
        u.type === "Bohater" &&
        !u.campaignModelStatus?.[0]?.dead &&
        // Owner's decision: a captured hero cannot take command.
        !u.campaignModelStatus?.[0]?.captured,
    )
    .sort((a, b) => score(b)[0] - score(a)[0] || score(b)[1] - score(a)[1]);
  const best = candidates[0];
  const tied = best
    ? candidates.filter(
        (u) => score(u)[0] === score(best)[0] && score(u)[1] === score(best)[1],
      )
    : [];
  const undead = hasRule(leader, "Nieumarły");
  if (undead) {
    // Nieumarli (s. 409): dowództwo przejmuje Nekromanta, Licz lub Profeta;
    // bez nich czar się rozprasza, a kompania rozpada.
    const casters = candidates.filter((u) =>
      /^(nekromanta|licz|profeta)$/.test(normal(u.unitName)),
    );
    return {
      leader,
      candidates: casters,
      tied: casters,
      undead,
      dissolves: !casters.length,
    };
  }
  return { leader, candidates, tied, undead };
};
export const dissolveCompany = (post) => {
  const s = leaderSuccession(post);
  if (!s?.dissolves) throw Error("Kompania ma następcę dowódcy.");
  post.dissolved = true;
  post.units.forEach((u) => {
    u.campaignModelStatus = Array.from({ length: modelCount(u) }, (_, i) => ({
      ...(u.campaignModelStatus?.[i] || {}),
      dead: true,
    }));
  });
  post.inventory = [];
  log(
    post,
    "dissolved",
    `${label(s.leader)} poległ bez Nekromanty, Licza ani Profety: czar się rozprasza, kompania rozpada się.`,
  );
};
export const assignLeader = (post, unitId) => {
  const s = leaderSuccession(post);
  if (!s) throw Error("Dowódca żyje.");
  const unit = post.units.find((u) => u.uniqueId === unitId);
  if (!unit || !s.candidates.includes(unit))
    throw Error("Ten bohater nie może objąć dowództwa.");
  if (!s.undead && !s.tied.includes(unit))
    throw Error("Dowództwo obejmuje bohater z najwyższym CP, potem PD.");
  addRule(unit, "Dowódca");
  post.succession = unitId;
  log(post, "leader", `${label(unit)} obejmuje dowództwo po ${label(s.leader)}.`);
};
// PD a model earns in this skirmish with a named source, kept so the
// experience step can show where each point comes from.
export const addBattleExp = (unit, pd, label) => {
  unit.battleExp = (Number(unit.battleExp) || 0) + pd;
  unit.battleExpParts = [...(unit.battleExpParts || []), { label, pd }];
};
// What a model gains in the experience step, source by source (s. 414).
// Empty when it did not take part or did not survive.
export const experienceBreakdown = (post, u) => {
  const survived = Array.from(
    { length: modelCount(u) },
    (_, i) => !u.battleAbsentModels?.[i] && !u.campaignModelStatus?.[i]?.dead,
  ).some(Boolean);
  if (!survived || !canEarnExperience(u)) return [];
  const parts = [{ label: "Przeżycie", pd: 1 }];
  const underdog = u.type === "Najemne Ostrze" ? 0 : Number(post.underdog?.exp) || 0;
  if (underdog) parts.push({ label: "Żółtodzioby", pd: underdog });
  const kills = u.type === "Bohater" ? Number(u.battleKills) || 0 : 0;
  if (kills) parts.push({ label: "Wrogowie WzA", pd: kills });
  const named = (u.battleExpParts || []).filter((x) => Number(x.pd));
  named.forEach((x) => parts.push({ label: x.label, pd: Number(x.pd) }));
  const rest = (Number(u.battleExp) || 0) - named.reduce((n, x) => n + Number(x.pd), 0);
  if (rest) parts.push({ label: rest > 0 ? "Scenariusz, zdarzenia" : "Korekta", pd: rest });
  return parts;
};
// The part of battleExp the player typed (scenario, events): total minus
// the points that came with a named source.
export const typedBattleExp = (u) =>
  (Number(u.battleExp) || 0) -
  (u.battleExpParts || []).reduce((n, x) => n + (Number(x.pd) || 0), 0);
export const applyExperience = (post) => {
  if (post.expApplied) throw Error("Doświadczenie już naliczono.");
  if (injuryTasks(post).some((t) => !post.injuries[t.key]))
    throw Error("Najpierw rozstrzygnij obrażenia.");
  post.units.forEach((u) => {
    // +1 PD (s. 414) needs a model that both took part and survived.
    const survivedBattle = Array.from(
      { length: modelCount(u) },
      (_, i) =>
        !u.battleAbsentModels?.[i] && !u.campaignModelStatus?.[i]?.dead,
    ).some(Boolean);
    if (survivedBattle) {
      const before = Number(u.obled) || 0;
      u.obled = Math.min(89, before + (Number(u.battleObled) || 0));
      if (u.obled !== before)
        post.obledGained = {
          ...(post.obledGained || {}),
          [u.uniqueId]: u.obled - before,
        };
    }
    if (!survivedBattle || !canEarnExperience(u)) return;
    // Żółtodzioby (s. 414): bohaterowie i grupy stronników, bez najmitów.
    const parts = experienceBreakdown(post, u);
    const gained = parts.reduce((n, x) => n + x.pd, 0);
    const old = Number(u.exp) || 0;
    u.exp = Math.min(isHero(u) ? 90 : 14, old + gained);
    post.expBreakdown = {
      ...(post.expBreakdown || {}),
      [u.uniqueId]: { from: old, to: u.exp, parts },
    };
    crossed(old, u.exp, u).forEach((threshold) =>
      post.advances.push({
        id: uid(),
        unitId: u.uniqueId,
        threshold,
        resolved: false,
        rolls: [],
      }),
    );
    log(post, "experience", `${label(u)}: ${old} → ${u.exp} PD`, {
      unitId: u.uniqueId,
      gained: u.exp - old,
    });
  });
  post.expApplied = true;
};
// Result of one battle for the saved-list history ("Moje rozpiski").
export const battleSummary = (post) => {
  const expBy = {};
  let totalExpGained = 0;
  for (const j of post.journal || [])
    if (j.type === "experience" && Number(j.gained)) {
      totalExpGained += Number(j.gained);
      if (j.unitId) expBy[j.unitId] = (expBy[j.unitId] || 0) + Number(j.gained);
    }
  const obled = post.obledGained || {};
  const injuries = Object.values(post.injuries || {}).filter(
    (i) => i.outOfAction || i.unitId === undefined,
  );
  const injuryOf = (u, i) =>
    Object.values(post.injuries || {}).find(
      (x) => x.outOfAction && x.unitId === u.uniqueId && x.index === i,
    );
  return {
    totalExpGained,
    totalObledGained: Object.values(obled).reduce(
      (n, v) => n + (Number(v) || 0),
      0,
    ),
    outOfActionModels: injuries.map(
      (i) => `${i.label || "Model"}: ${i.result}`,
    ),
    unitResults: post.units.map((u) => {
      const count = modelCount(u);
      return {
        unitId: u.uniqueId,
        unitLabel: label(u),
        gainedExp: expBy[u.uniqueId] || 0,
        gainedObled: Number(obled[u.uniqueId]) || 0,
        modelResults: Array.from({ length: count }, (_, i) => {
          const s = u.campaignModelStatus?.[i] || {};
          const injury = injuryOf(u, i);
          return {
            modelLabel: count > 1 ? `${label(u)} #${i + 1}` : label(u),
            isOutOfAction: !!(injury || u.battleOutOfActionModels?.[i]),
            status: s.dead
              ? "poległ"
              : s.captured
                ? "pojmany"
                : u.battleAbsentModels?.[i]
                  ? "nieobecny"
                  : injury
                    ? `WzA: ${injury.result}`
                    : u.battleOutOfActionModels?.[i]
                      ? "WzA"
                      : "aktywny",
          };
        }),
      };
    }),
  };
};
// Firestore cannot store an array directly inside another array. Older
// journal entries (e.g. per-item tax rolls) did, so the finished battle is
// flattened before it is saved: an inner array becomes "a+b" text.
export const firestoreSafe = (value, nested = false) => {
  if (Array.isArray(value)) {
    if (nested)
      return value.every((x) => x === null || typeof x !== "object")
        ? value.join("+")
        : JSON.stringify(value);
    return value.map((x) => firestoreSafe(x, true));
  }
  if (value && typeof value === "object" && Object.getPrototypeOf(value) === Object.prototype)
    return Object.fromEntries(
      Object.entries(value).map(([k, x]) => [k, firestoreSafe(x)]),
    );
  return value;
};
export const finalizePostBattle = (battle, notes) => firestoreSafe(finalizeBattle(battle, notes));
const finalizeBattle = (battle, notes) => {
  const p = clone(battle.post);
  if (
    !p.dissolved &&
    (injuryTasks(p).some((t) => !p.injuries[t.key]) ||
      !p.expApplied ||
      p.advances.some((a) => !a.resolved))
  )
    throw Error("Rozstrzygnij obrażenia, doświadczenie i awanse.");
  const summary = battleSummary(p);
  const units = p.units.flatMap((u) => {
    const statuses = Array.from({ length: modelCount(u) }, (_, i) => ({
      i,
      ...(u.campaignModelStatus?.[i] || {}),
    })).filter((s) => !s.dead);
    if (!statuses.length) return [];
    u.selectedNumber = statuses.length;
    u.totalCost = Number(u.cost) * statuses.length;
    u.campaignModelStatus = statuses.map(({ i, ...s }) => ({
      ...s,
      skip: Math.max(0, s.skip || 0),
    }));
    delete u.campaignNewRecruit;
    // Older rosters stored one-off results (Martwy, pauza…) as wounds.
    if (Array.isArray(u.injuries)) u.injuries = lastingInjuries(u.injuries);
    u.battleExp = 0;
    delete u.battleExpParts;
    u.battleTreasure = 0;
    u.battleKills = 0;
    u.battleObled = 0;
    u.battlePacts = 0;
    u.battleOutOfActionModels = statuses.map(() => false);
    u.battleAbsentModels = statuses.map(() => false);
    return [u];
  });
  const campaign = {
    ...campaignDefaults(),
    ...(notes.campaign || {}),
    inventory: p.inventory,
    companyAdvancements: p.companyAdvancements || [],
    persistentEffects: p.persistentEffects || {},
    futureEffects: p.futureEffects || [],
    deadDrama: p.deadDrama || [],
    mercenaryBans: p.mercenaryBans || {},
    activeBattle: null,
  };
  if (campaign.history.some((h) => h.id === battle.id))
    throw Error("Ta potyczka została już zapisana.");
  const entry = {
    id: battle.id,
    gameName: battle.gameName,
    date: battle.date,
    opponent: battle.opponent,
    scenario: battle.scenario,
    result: battle.result,
    area: battle.area,
    notes: battle.notes,
    // Which shared-campaign game this settles, so it is not settled twice.
    campaignGame: battle.campaignGame || null,
    // The live log of a skirmish played in play mode.
    log: battle.log || [],
    finishedAt: new Date().toISOString(),
    journal: p.journal,
    treasury: p.treasury,
    loot: p.loot,
    summary,
  };
  campaign.history = [...campaign.history, entry];
  return {
    units,
    notes: {
      ...notes,
      ...(p.campaignPoints || {}),
      specialRules: [
        ...new Set([
          ...(notes.specialRules || []),
          ...(p.companyAdvancements || []).map((e) => e.name),
        ]),
      ],
      skarbiec: p.treasury,
      kosztownosci: p.loot,
      campaign,
    },
    entry,
  };
};

export const equipmentCapacity = (unit, item) => {
  const crafted = Object.values(unit.craftedEquipment || {}).flat();
  const craftSlot = {
    "Magiczny oręż": /oręża|inżynierskie/i,
    "Magiczna zbroja": /zbroi/i,
    "Magiczne talizmany": /talizmanu/i,
    "Magiczne instrumenty": /instrumentu/i,
    "Magiczne sztandary": /sztandaru/i,
  }[item.category];
  if (craftSlot && crafted.some((r) => craftSlot.test(r.category)))
    return "Ten magiczny slot zajmuje przedmiot runiczny lub mechaniczny.";
  const owned = unit.campaignEquipment || [];
  const magical =
    item.category.startsWith("Magicz") || item.category === "Arkana";
  if (magical && owned.some((o) => o.category === item.category))
    return "Ta kategoria magicznego ekwipunku jest już zajęta.";
  const special =
    !item.category.startsWith("Oręż") && item.category !== "Tarcza i pancerz";
  if (
    special &&
    owned.filter(
      (o) =>
        !o.category.startsWith("Oręż") && o.category !== "Tarcza i pancerz",
    ).length >= 5
  )
    return "Limit 5 przedmiotów ekwipunku specjalnego.";
  return null;
};
export const equipItem = (unit, item, quote) => {
  const name =
    Object.keys(unit.equipmentList || {}).find((name) =>
      itemBaseNames(item).some((base) => aliases(name).includes(base)),
    ) || item.name;
  const rawCategory =
    item.category === "Oręż — walka wręcz"
      ? 0
      : item.category.startsWith("Oręż")
        ? 1
        : item.category === "Tarcza i pancerz"
          ? 2
          : 3;
  if (rawCategory < 3) {
    const existing = [
      ...(unit.startingEquipment || []),
      ...(unit.optionalEquipment || []),
    ];
    const inCategory = existing.filter(
      (n) =>
        unit.equipmentList?.[n]?.[1] === rawCategory &&
        !(rawCategory === 0 && n === "Sztylet"),
    ).length;
    const max =
      rawCategory === 2 ? Infinity : hasRule(unit, "Zbrojny po zemby") ? 3 : 2;
    if (inCategory >= max) throw Error("Osiągnięto limit broni.");
    const group =
      rawCategory === 2
        ? /puklerz|tarcza/i.test(name)
          ? "Tarcza"
          : /hełm/i.test(name)
            ? "Hełm"
            : "Zbroja"
        : null;
    if (
      group &&
      existing.some((n) =>
        group === "Hełm"
          ? normal(n) === "hełm"
          : unit.equipmentList?.[n]?.[2] === group,
      )
    )
      throw Error("Model ma już przedmiot z tej grupy pancerza.");
    unit.equipmentList = {
      ...unit.equipmentList,
      [name]: [quote.basePrice, rawCategory, ...(group ? [group] : [])],
    };
    unit.optionalEquipment = [...(unit.optionalEquipment || []), name];
  } else
    unit.customEquipment = [
      ...(unit.customEquipment || []),
      {
        id: uid(),
        name: item.name,
        catalogId: item.id,
        price: quote.basePrice,
      },
    ];
  unit.campaignEquipment = [
    ...(unit.campaignEquipment || []),
    {
      name,
      catalogId: item.id,
      category: item.category,
      price: quote.price,
      basePrice: quote.basePrice,
    },
  ];
  unit.cost = (Number(unit.cost) || 0) + quote.basePrice;
  unit.totalCost = unit.cost * modelCount(unit);
};

// --- Pula Kości Dostępności (rozdział 14, s. 426) --------------------------
// Jedna 2K6 za każdego bohatera kompanii, który w tej sekwencji nie rzucał na
// TABELĘ POWAŻNYCH RAN, także nieobecnego w potyczce. Postacie Dramatu nie
// dają kości; Anoreksja i Żarłoczność wykluczają z handlu.
export const availabilityHeroes = (post) =>
  post.units.filter(
    (u) =>
      u.type === "Bohater" &&
      !u.campaignModelStatus?.[0]?.dead &&
      !u.campaignModelStatus?.[0]?.captured &&
      !post.injuries?.[`${u.uniqueId}:0`] &&
      !(u.battleOutOfActionModels?.[0] && !u.battleAbsentModels?.[0]) &&
      !hasRule(u, "Anoreksja") &&
      !hasRule(u, "Żarłoczność"),
  );

// BOGATY MOŻE WIĘCEJ: the bribed result is 3K6 without the lowest die.
export const keptAvailabilityDice = (token) =>
  token.bribe ? [...token.dice].sort((a, b) => b - a).slice(0, 2) : token.dice;

// A result is usable once its dice are in; SPOŁEM helpers have no result and
// give +1 each to the hero they help.
export const refreshAvailability = (pool) =>
  pool.forEach((token) => {
    token.helpers = pool.filter((h) => h.helping === token.id).length;
    token.locked = !token.helping && validDice(token.dice, token.bribe ? 3 : 2);
    token.total = token.locked
      ? sum(keptAvailabilityDice(token)) + (Number(token.modifier) || 0) + token.helpers
      : 0;
  });

export const createAvailabilityPool = (post) => {
  post.availability = availabilityHeroes(post).map((u) => ({
    id: uid(),
    unitId: u.uniqueId,
    name: label(u),
    dice: [],
    total: 0,
    modifier: hasRule(u, "Ulicznik") ? 3 : 0,
    reason: hasRule(u, "Ulicznik") ? "Ulicznik" : "",
    used: false,
    locked: false,
  }));
  log(post, "availability", `Pula dostępności: ${post.availability.length} bohaterów.`);
};

const openToken = (post, id) => {
  const token = post.availability?.find((t) => t.id === id);
  if (!token) throw Error("Nie ma takiego wyniku w puli.");
  if (token.used) throw Error("Ten wynik został już wykorzystany.");
  return token;
};

export const setAvailabilityDice = (post, id, dice, source) => {
  const token = openToken(post, id);
  if (token.helping) throw Error("Bohater działający SPOŁEM nie rzuca kośćmi dostępności.");
  token.dice = dice;
  token.source = source;
  refreshAvailability(post.availability);
  if (token.locked)
    log(
      post,
      "roll",
      `Dostępność ${token.name}: ${token.dice.join("+")}${token.bribe ? " (3K6, odrzucona najniższa)" : ""}${token.modifier ? ` ${token.modifier > 0 ? "+" : ""}${token.modifier}` : ""}${token.helpers ? ` +${token.helpers} społem` : ""} = ${token.total}.`,
    );
};

// SPOŁEM: the helper's result is given up for +1 on the seeker's.
export const setAvailabilityHelper = (post, helperId, seekerId) => {
  const helper = openToken(post, helperId);
  if (seekerId) {
    const seeker = openToken(post, seekerId);
    if (seeker.id === helper.id || seeker.helping)
      throw Error("Wybierz innego bohatera, który poszukuje towaru.");
    if (validDice(helper.dice, helper.bribe ? 3 : 2))
      throw Error("Bohater już rzucił; pomóc może tylko przed rzutem.");
    if (helper.bribe) throw Error("Ten wynik ma już opłaconą łapówkę.");
    if (post.availability.some((t) => t.helping === helper.id))
      throw Error("Temu bohaterowi już ktoś pomaga.");
  }
  helper.helping = seekerId || null;
  helper.dice = [];
  refreshAvailability(post.availability);
  log(
    post,
    "availability",
    seekerId
      ? `Społem: ${helper.name} pomaga ${post.availability.find((t) => t.id === seekerId).name} (+1).`
      : `Społem: ${helper.name} nie pomaga już w handlu.`,
  );
};

// BOGATY MOŻE WIĘCEJ: one result per sequence; the 2K6 zk bribe is paid
// whatever the roll.
export const bribeAvailability = (post, id, costDice) => {
  if (post.availability?.some((t) => t.bribe)) throw Error("Łapówkę można dać raz w sekwencji.");
  const token = openToken(post, id);
  if (token.helping || validDice(token.dice, 2))
    throw Error("Łapówkę daje się przed rzutem bohatera, który szuka towaru.");
  if (!validDice(costDice, 2)) throw Error("Rzuć 2K6 na wysokość łapówki.");
  const cost = sum(costDice);
  if (post.treasury < cost) throw Error(`Łapówka kosztuje ${cost} zk, a w skarbcu jest ${post.treasury} zk.`);
  post.treasury -= cost;
  token.bribe = { cost, dice: costDice };
  token.dice = [];
  refreshAvailability(post.availability);
  log(post, "availability", `Bogaty może więcej: łapówka ${cost} zk, ${token.name} rzuca 3K6.`);
};

// Results that reach `needed`, the lowest first, so a purchase uses the
// smallest result that is enough.
export const usableAvailability = (post, needed, value = (t) => t.total) =>
  (post.availability || [])
    .filter((t) => t.locked && !t.used && value(t) >= needed)
    .sort((a, b) => value(a) - value(b));

export const availabilityValue = (token, item) =>
  token.total +
  (/\(trucizna\)/i.test(item.name)
    ? token.poisonBonus || 0
    : /\((mikstura|\s*narkotyk\s*)\)/i.test(item.name)
      ? token.alchemyBonus || 0
      : 0);

// New quotes retain each item's actual price; old single-price quotes remain
// readable for purchases without per-item rolls.
export const purchaseTotal = (quote, quantity) => {
  const prices = quote?.unitPrices;
  if (prices !== undefined && (!Array.isArray(prices) || prices.length !== quantity))
    throw Error("Ustal cenę każdej kupowanej sztuki.");
  const values = prices === undefined ? Array(quantity).fill(quote?.price) : prices;
  if (values.some((price) => !Number.isFinite(price) || price < 1))
    throw Error("Nieprawidłowa cena przedmiotu.");
  return sum(values);
};

export const buyItem = (
  post,
  unitId,
  item,
  quote,
  armyName,
  toInventory = false,
) => {
  const unit = post.units.find((u) => u.uniqueId === unitId);
  if (post.tradeClosed)
    throw Error("Handel w tej sekwencji został zakończony.");
  const permission = equipmentPermission(unit, item, armyName);
  if (!toInventory && unit?.campaignNewRecruit && item.availability > 0)
    throw Error(
      "Nowy rekrut może otrzymać ten rzadki przedmiot dopiero po następnej potyczce albo ze skarbca.",
    );
  if (permission && !toInventory) throw Error(permission);
  if (!toInventory) {
    const limit = equipmentCapacity(unit, item);
    if (limit) throw Error(limit);
  }
  if (
    !toInventory &&
    ["Magiczne instrumenty", "Magiczne sztandary"].includes(item.category) &&
    post.units.some((u) =>
      (u.campaignEquipment || []).some((o) => o.category === item.category),
    )
  )
    throw Error("Kompania ma już przedmiot z tej kategorii.");
  if (!quote || quote.used || quote.itemId !== item.id)
    throw Error("Najpierw ustal cenę i dostępność.");
  const quantity = toInventory
    ? 1
    : modelCount(unit) -
      (unit.campaignModelStatus || []).filter((s) => s.dead).length;
  if (!toInventory && quantity > 1 && item.availability > 0)
    throw Error(
      "Rzadkie przedmioty dla grupy kup pojedynczo do skarbca, a następnie przydziel pełny komplet.",
    );
  if (quantity < 1) throw Error("Nie można kupować dla poległej postaci.");
  if (quantity > 1 && (post.armyRules || []).some((r) => baseName(r) === "podatek") && !quote.unitPrices)
    throw Error("Dla grupy wykonaj osobny rzut na podatek za każdą sztukę.");
  const total = purchaseTotal(quote, quantity);
  if (post.treasury < total)
    throw Error("Za mało złotych koron w skarbcu.");
  if (item.availability > 0) {
    const token = post.availability?.find((t) => t.id === quote.tokenId);
    if (
      !token ||
      !token.locked ||
      token.used ||
      availabilityValue(token, item) < item.availability
    )
      throw Error("Brak niewykorzystanego wyniku dostępności.");
    token.used = true;
    token.usedFor = item.name;
  }
  post.treasury -= total;
  quote.used = true;
  if (toInventory)
    storeItem(post, item.name, 1, {
      catalogId: item.id,
      basePrice: quote.basePrice,
    });
  else {
    equipItem(unit, item, quote);
  }
  log(
    post,
    "purchase",
    `${item.name} ×${quantity}: ${total} zk → ${toInventory ? "skarbiec" : label(unit)}`,
    {
      catalogId: item.id,
      price: quote.price,
      unitPrices: quote.unitPrices || null,
      // Firestore rejects nested arrays: one "3+4" string per item.
      taxRolls: quote.taxRolls?.length ? quote.taxRolls.map((r) => [].concat(r).join("+")) : null,
      total,
      quantity,
      tokenId: quote.tokenId || null,
    },
  );
};

export const equipStoredItem = (post, unitId, storedId, armyName) => {
  const unit = post.units.find((u) => u.uniqueId === unitId),
    stored = post.inventory.find((i) => i.id === storedId);
  if (!unit || !stored) throw Error("Brak postaci lub przedmiotu.");
  let item = catalog.find((i) => i.id === stored.catalogId);
  if (!item) {
    const name = Object.keys(unit.equipmentList || {}).find(
      (n) => baseName(n) === baseName(stored.name),
    );
    if (!name)
      throw Error(
        "Przedmiot nie znajduje się na liście ekwipunku tej postaci.",
      );
    const list = unit.equipmentList[name];
    item = {
      id: "",
      name,
      category:
        list[1] === 0
          ? "Oręż — walka wręcz"
          : list[1] === 1
            ? "Oręż — dystansowy"
            : list[1] === 2
              ? "Tarcza i pancerz"
              : "Narzędzia i osobliwości",
      price: String(list[0]),
      text: "",
    };
  }
  const craftCategory = stored.crafting?.[0]?.category;
  const magicalCraftCategory = craftCategory
    ? /oręża|inżynierskie/i.test(craftCategory)
      ? "Magiczny oręż"
      : /zbroi/i.test(craftCategory)
        ? "Magiczna zbroja"
        : /talizmanu/i.test(craftCategory)
          ? "Magiczne talizmany"
          : /instrumentu/i.test(craftCategory)
            ? "Magiczne instrumenty"
            : "Magiczne sztandary"
    : null;
  const permission =
    equipmentPermission(unit, item, armyName) ||
    equipmentCapacity(
      unit,
      magicalCraftCategory ? { ...item, category: magicalCraftCategory } : item,
    );
  if (permission) throw Error(permission);
  const amount =
    modelCount(unit) -
    (unit.campaignModelStatus || []).filter((s) => s.dead).length;
  if (stored.quantity < amount)
    throw Error("Potrzebny komplet dla całej grupy.");
  const base = stored.basePrice ?? Number(item.price.match(/^\d+/)?.[0] || 0);
  equipItem(unit, item, { basePrice: base, price: base });
  if (stored.crafting)
    unit.craftedEquipment = {
      ...(unit.craftedEquipment || {}),
      [item.name]: clone(stored.crafting),
    };
  stored.quantity -= amount;
  post.inventory = post.inventory.filter((i) => i.quantity > 0);
  log(post, "inventory", `${stored.name} ×${amount} → ${label(unit)}`);
};

// Sprzedaż (s. 426): half the market value of common equipment and half
// the base price of rare equipment. The book gives no rounding; the app
// rounds down. Rune and mechanism upgrades add nothing to the price.
export const saleValue = (stored) => {
  const definition =
    catalog.find((i) => i.id === stored.catalogId) ||
    catalog.find((i) => normal(i.name) === normal(stored.name));
  const base =
    stored.basePrice ??
    (definition ? Number(String(definition.price).match(/^\d+/)?.[0] || 0) : 0);
  return Math.floor((Number(base) || 0) / 2);
};
export const sellStoredItem = (post, storedId, quantity = 1) => {
  if (post.tradeClosed) throw Error("Handel w tej sekwencji został zamknięty.");
  const stored = post.inventory.find((i) => i.id === storedId);
  if (!stored || stored.quantity < quantity)
    throw Error("Brak tego przedmiotu w skarbcu.");
  const value = saleValue(stored) * quantity;
  stored.quantity -= quantity;
  post.inventory = post.inventory.filter((i) => i.quantity > 0);
  post.treasury += value;
  log(
    post,
    "sale",
    `Sprzedano: ${stored.name} ×${quantity} za ${value} zk (połowa ceny).`,
  );
  return value;
};
// Base price of what a model carries, as unequipItem stores it.
export const carriedBasePrice = (unit, field, index) => {
  const entry = unit?.[field]?.[index];
  if (!entry) return 0;
  const name = typeof entry === "string" ? entry : entry.name;
  const metadata = (unit.campaignEquipment || []).find(
    (i) => normal(i.name) === normal(name),
  );
  return Number(
    metadata?.basePrice ??
      (typeof entry === "object"
        ? Number(entry.price) || 0
        : unit.equipmentList?.[name]?.[0] || 0),
  ) || 0;
};
// Whether the player may sell this (s. 426, 484, 496): never a mercenary's
// own gear, nor what a Drama character starts with.
export const canSellCarried = (unit, field, index) => {
  const entry = unit?.[field]?.[index];
  return (
    !!entry &&
    unit.type !== "Najemne Ostrze" &&
    !(unit.type === "Postać Dramatu" && (field === "startingEquipment" || entry.personal))
  );
};
// Sells what a model (or every living model of a group) carries.
export const sellUnitItem = (post, unitId, field, index) => {
  const unit = post.units.find((u) => u.uniqueId === unitId);
  const entry = unit?.[field]?.[index];
  if (!entry) throw Error("Brak przedmiotu do sprzedaży.");
  const name = typeof entry === "string" ? entry : entry.name;
  const before = Object.fromEntries(post.inventory.map((i) => [i.id, i.quantity]));
  unequipItem(post, unitId, field, index);
  const stored = post.inventory.find(
    (i) => normal(i.name) === normal(name) && i.quantity > (before[i.id] || 0),
  );
  if (!stored) throw Error("Nie udało się sprzedać przedmiotu.");
  return sellStoredItem(post, stored.id, stored.quantity - (before[stored.id] || 0));
};
export const unequipItem = (post, unitId, field, index) => {
  const unit = post.units.find((u) => u.uniqueId === unitId),
    entry = unit?.[field]?.[index];
  if (!entry) throw Error("Brak przedmiotu do przeniesienia.");
  if (
    unit.type === "Najemne Ostrze" ||
    (unit.type === "Postać Dramatu" &&
      (field === "startingEquipment" || entry.personal))
  )
    throw Error("Ta postać nie oddaje własnego ekwipunku do skarbca.");
  const name = typeof entry === "string" ? entry : entry.name;
  const metadata = (unit.campaignEquipment || []).find(
    (i) => normal(i.name) === normal(name),
  );
  const base =
    metadata?.basePrice ??
    (typeof entry === "object"
      ? Number(entry.price) || 0
      : unit.equipmentList?.[name]?.[0] || 0);
  unit[field].splice(index, 1);
  if (metadata) {
    unit.campaignEquipment.splice(unit.campaignEquipment.indexOf(metadata), 1);
  }
  const amount =
    modelCount(unit) -
    (unit.campaignModelStatus || []).filter((s) => s.dead).length;
  const crafting = unit.craftedEquipment?.[name];
  if (crafting) delete unit.craftedEquipment[name];
  storeItem(post, name, amount, {
    ...(crafting ? { crafting } : {}),
    ...(metadata?.catalogId ? { catalogId: metadata.catalogId } : {}),
    basePrice: base,
  });
  unit.cost = Math.max(0, (Number(unit.cost) || 0) - base);
  unit.totalCost = unit.cost * modelCount(unit);
  log(post, "inventory", `${name} ×${amount}: ${label(unit)} → skarbiec`);
};
