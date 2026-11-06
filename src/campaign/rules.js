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
export const canEarnExperience = (unit) => !hasRule(unit, "Nieświadomy");
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
    text: `K6: ${n}. ${dead ? "Ekwipunek trafia do skarbca." : skip ? "Model opuszcza jedną potyczkę." : "Model powraca do zdrowia."}`,
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
      (isHero(unit) || !(unit.campaignAdvancements || []).includes(0))
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
      (isHero(unit) || !(unit.campaignAdvancements || []).includes(i)),
  );
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
  players: 2,
  totalSold: 0,
  notes: "",
  post: null,
  startedAt: new Date().toISOString(),
  rosterIds: units.map((u) => u.uniqueId),
});
export const beginPostBattle = (battle, units, notes, army = {}) => ({
  ...battle,
  stage: 1,
  post: {
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
    sanityBefore: Object.fromEntries(
      units.map((u) => [u.uniqueId, Number(u.obled) || 0]),
    ),
    armyRules: [...(army.armyRules || []), ...(notes.specialRules || [])],
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
  );
}
export const applyInjury = (post, task, result, detail = {}) => {
  if (post.injuries[task.key])
    throw Error("Obrażenia tego modelu już rozstrzygnięto.");
  const unit = post.units.find((u) => u.uniqueId === task.unitId);
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
      if (d.children?.length !== count)
        throw Error("Rozstrzygnij wszystkie dodatkowe rany.");
      d.children.forEach((child) => {
        if (!validDice(child?.dice, 2))
          throw Error("Wpisz K66 każdej dodatkowej rany.");
        apply(multipleInjury(child.dice), child);
      });
    }
    if (code === 24) {
      if (!validDice(d.mental, 2))
        throw Error("Wykonaj rzut K66 na chorobę psychiczną.");
      const illness = mental.find((x) => x.code === k66(d.mental));
      addRule(unit, illness.name);
      unit.mentalIllnesses = [
        ...(unit.mentalIllnesses || []),
        {
          code: illness.code,
          name: illness.name,
          text: illness.text,
          acquiredAt: post.battleId || null,
        },
      ];
      unit.campaignRuleTexts = {
        ...(unit.campaignRuleTexts || {}),
        [illness.name]: illness.text,
      };
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
      addRule(unit, `Nienawiść (${target})`);
    }
    if (code === 65) {
      if (!["win", "loss"].includes(d.arena))
        throw Error("Wpisz wynik walki na arenie.");
      if (d.arena === "win") {
        post.treasury += 50;
        if (post.expApplied) grantExperience(post, unit, 2, "Walki na arenie");
        else unit.battleExp = (Number(unit.battleExp) || 0) + 2;
      } else {
        if (!validDice(d.secondary, 1))
          throw Error("Rzuć na następstwa porażki na arenie.");
        if (d.secondary[0] <= 2) {
          const child = d.children?.[0];
          if (!validDice(child?.dice, 2))
            throw Error("Wpisz K66 dodatkowej rany z areny.");
          apply(multipleInjury(child.dice), child);
        } else {
          unit.startingEquipment = [];
          unit.optionalEquipment = [];
          unit.customEquipment = [];
        }
      }
    }
    unit.injuries = [...(unit.injuries || []), r.name];
    if (r.code === 11 || r.min === 11) status.dead = true;
    if (r.simple) status.skip = Math.max(status.skip, r.skip);
    if (code === 22) {
      const n = (unit.injuries || []).filter((s) => s === r.name).length;
      if (n >= 2) status.dead = true;
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
      if (code === 31 && unit.injuries.filter((s) => s === r.name).length >= 2)
        status.dead = true;
    }
    if ([23, 25].includes(code)) {
      if (!validDice(d.secondary, 1)) throw Error("Wykonaj dodatkowy rzut K6.");
      if (d.secondary[0] === 1) {
        if (code === 23 && hasRule(unit, "Amputowane ramię"))
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
      else unit.battleExp = (Number(unit.battleExp) || 0) + 1;
    }
    if (code === 36) {
      unit.startingEquipment = [];
      unit.optionalEquipment = [];
      unit.customEquipment = [];
    }
  };
  apply(result);
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
export const applyExperience = (post) => {
  if (post.expApplied) throw Error("Doświadczenie już naliczono.");
  if (injuryTasks(post).some((t) => !post.injuries[t.key]))
    throw Error("Najpierw rozstrzygnij obrażenia.");
  post.units.forEach((u) => {
    const survived = Array.from(
      { length: modelCount(u) },
      (_, i) => !u.campaignModelStatus?.[i]?.dead,
    ).some(Boolean);
    const participated = Array.from(
      { length: modelCount(u) },
      (_, i) => !u.battleAbsentModels?.[i],
    ).some(Boolean);
    if (survived && participated)
      u.obled = Math.min(
        89,
        (Number(u.obled) || 0) + (Number(u.battleObled) || 0),
      );
    if (!survived || !participated || !canEarnExperience(u)) return;
    const gained =
      1 +
      (Number(u.battleExp) || 0) +
      (u.type === "Bohater" ? Number(u.battleKills) || 0 : 0);
    const old = Number(u.exp) || 0;
    u.exp = Math.min(isHero(u) ? 90 : 14, old + gained);
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
export const finalizePostBattle = (battle, notes) => {
  const p = clone(battle.post);
  if (
    injuryTasks(p).some((t) => !p.injuries[t.key]) ||
    !p.expApplied ||
    p.advances.some((a) => !a.resolved)
  )
    throw Error("Rozstrzygnij obrażenia, doświadczenie i awanse.");
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
    u.battleExp = 0;
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
    finishedAt: new Date().toISOString(),
    journal: p.journal,
    treasury: p.treasury,
    loot: p.loot,
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

export const availabilityValue = (token, item) =>
  token.total +
  (/\(trucizna\)/i.test(item.name)
    ? token.poisonBonus || 0
    : /\((mikstura|\s*narkotyk\s*)\)/i.test(item.name)
      ? token.alchemyBonus || 0
      : 0);

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
  if (
    !Number.isFinite(quote.price) ||
    quote.price < 1 ||
    post.treasury < quote.price * quantity
  )
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
  }
  post.treasury -= quote.price * quantity;
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
    `${item.name} ×${quantity}: ${quote.price * quantity} zk → ${toInventory ? "skarbiec" : label(unit)}`,
    {
      catalogId: item.id,
      price: quote.price,
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
