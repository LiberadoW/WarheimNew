import { getModifiers } from "../Functions/getModifiers";
import { getShortEquipment } from "../Functions/displayEquipment";
import { lastingInjuries } from "../campaign/rules";
import { unitRuleText } from "../Functions/getRuleText";
import mutations from "../campaign/mutations.json";
import { knownSpells, loreOf } from "../campaign/spells";

export const STAT_LABELS = ["Sz", "WW", "US", "S", "Wt", "Żw", "I", "A", "CP"];
const TYPE_ORDER = ["Bohater", "Stronnik", "Machina", "Najemne Ostrze", "Postać Dramatu"];
export const TYPE_GROUPS = {
  Bohater: "Bohaterowie",
  Stronnik: "Stronnicy",
  Machina: "Machiny",
  "Najemne Ostrze": "Najemne Ostrza",
  "Postać Dramatu": "Postacie Dramatu",
};

export const modelCount = (unit) => {
  const n = Number(unit.selectedNumber);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : 1;
};

// Everything the roster tables show for one unit, from a saved unit object.
export const summarizeUnit = (unit) => {
  const stats = Array.isArray(unit.stats?.Aktualna)
    ? unit.stats.Aktualna
    : unit.stats?.Początkowa || [];
  const [armour] = getModifiers(
    [...(unit.startingEquipment || []), ...(unit.optionalEquipment || [])],
    unit,
  );
  return {
    id: unit.uniqueId,
    name: unit.unitDisplayName || unit.unitName,
    profile: unit.unitName,
    type: unit.type,
    models: modelCount(unit),
    cost: unit.totalCost,
    exp: Number(unit.exp) || 0,
    stats,
    armour: armour < 7 ? `${armour}+` : "-",
    equipment: getShortEquipment(unit),
    rules: unit.rules || [],
    // Rule texts as this unit has them (rolled stigmas, illnesses).
    ruleTexts: Object.fromEntries((unit.rules || []).map((r) => [r, unitRuleText(unit, r, mutations)])),
    lore: loreOf(unit),
    spells: knownSpells(unit),
    injuries: lastingInjuries(unit.injuries),
  };
};

export const groupRoster = (armyList = []) =>
  TYPE_ORDER.map((type) => ({
    type,
    title: TYPE_GROUPS[type],
    units: armyList.filter((u) => u?.type === type).map(summarizeUnit),
  })).filter((group) => group.units.length > 0);

export const countModels = (armyList = []) =>
  armyList.reduce((n, u) => n + modelCount(u), 0);

// Polish counted nouns: 1 gracz, 2–4 gracze (but 12–14 graczy), 5 graczy.
export const plural = (n, one, few, many) => {
  if (n === 1) return `${n} ${one}`;
  const last = n % 10;
  const lastTwo = n % 100;
  return `${n} ${last >= 2 && last <= 4 && (lastTwo < 12 || lastTwo > 14) ? few : many}`;
};
