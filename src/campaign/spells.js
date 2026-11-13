import { magic } from "../Data.js/Magic";
import { getMagicLore } from "../Functions/getMagicLore";

// Spells and prayers (rozdział 22 MAGIA, s. 550; rozdział 23 MODLITWY, s. 590).
// Lists are numbered by roll: a mage lore holds the common spells (1–6) and
// its own (7–12); a prayer list runs 1–9.

const COLLEGE_LORES = [
  "Tradycja Bestii", "Tradycja Cienia", "Tradycja Metalu", "Tradycja Niebios",
  "Tradycja Ognia", "Tradycja Śmierci", "Tradycja Światła", "Tradycja Życia",
];

const has = (unit, name) =>
  (unit.rules || []).some((r) => String(r).toLowerCase().startsWith(name.toLowerCase()));

export const isPriest = (unit) => has(unit, "Duchowny") || has(unit, "Kapłan");
// MAG, Magus, Magister, Wiedza tajemna; not "Magiczna ochrona" or the
// vampires' "Magia krwi" (uroki, not spells).
const MAGE_RULE = /^(mag(?![a-ząćęłńóśźż])|magus|magister|wiedza tajemna)/i;
export const isMage = (unit) => !isPriest(unit) && (unit.rules || []).some((r) => MAGE_RULE.test(String(r).trim()));
export const isCaster = (unit) => isMage(unit) || isPriest(unit);

const LORE_ALIASES = {
  "dziedzina nehekhary": "Domena Nehekhary",
  "dziedzina nehekary": "Domena Nehekhary",
  "dziedzina boga pajonka": "Dziedzina Boga-Pajonka",
};
const toLore = (name) => {
  const n = String(name).trim();
  return LORE_ALIASES[n.toLowerCase()] || Object.keys(magic).find((k) => k.toLowerCase() === n.toLowerCase()) || null;
};
// The lores a mage may practise, from "Mag (…)": the eight college lores,
// Yin or Yang for Dao, or a list joined with "albo".
export const loreChoices = (unit) => {
  if (!isMage(unit)) return [];
  const rule = (unit.rules || []).find((r) => /^mag\s*\(/i.test(r)) || (unit.rules || []).find((r) => /^wiedza tajemna\s*\(/i.test(r));
  const inside = rule?.match(/\((.+)\)/)?.[1] || "";
  if (/kolegia magii/i.test(inside)) return COLLEGE_LORES.filter((l) => magic[l]);
  if (/dao/i.test(inside)) return ["Tradycja Yin", "Tradycja Yang"].filter((l) => magic[l]);
  return [...new Set(inside.split(/\s+albo\s+/i).map(toLore).filter(Boolean))];
};
export const collegeLores = () => COLLEGE_LORES.filter((l) => magic[l]);

export const loreOf = (unit) => {
  if (unit.magicLore && magic[unit.magicLore]) return unit.magicLore;
  const choices = loreChoices(unit);
  if (choices.length > 1) {
    // Chosen in the builder: Dualizm (Yin / Yang) or a lore taken as an option.
    const selected = [...(unit.optionalEquipment || []), ...(unit.rules || [])].map(String);
    if (selected.includes("Dualizm (Yin)")) return choices.includes("Tradycja Yin") ? "Tradycja Yin" : null;
    if (selected.includes("Dualizm (Yang)")) return choices.includes("Tradycja Yang") ? "Tradycja Yang" : null;
    return choices.find((c) => selected.some((x) => toLore(x) === c)) || null;
  }
  if (choices.length === 1) return choices[0];
  if (isMage(unit) && !(unit.rules || []).some((r) => /\(/.test(r) && MAGE_RULE.test(r))) {
    const lore = getMagicLore([unit]);
    return lore && magic[lore] ? lore : null;
  }
  if (!isPriest(unit) && !isMage(unit)) return null;
  const lore = getMagicLore([unit]);
  return lore && magic[lore] ? lore : null;
};
// A mage with more than one possible lore picks one (s. 550).
export const needsLoreChoice = (unit) => isMage(unit) && !loreOf(unit) && loreChoices(unit).length > 1;

// "1-2 MAGICZNE ŻĄDŁO", "7 (1) GOREJĄCY MIECZ RHUIN" → { from, to, name }.
const parseHead = (head) => {
  const m = String(head).match(/^(\d+)(?:\s*-\s*(\d+))?\s*(?:\(\d+\)\s*)?(.*)$/);
  if (!m) return { from: 0, to: 0, name: head };
  return { from: Number(m[1]), to: Number(m[2] || m[1]), name: m[3].trim() };
};
// Book headings are in capitals: sentence case, keeping gods and names.
const PROPER = /\b(sigmar|morr|ulryk|myrmidi|ursun|ranald|manann|veren|rhuin|nehek|vanhel|aqshy|u’zhul|u'zhul|tzeentch|nurgl|slaanesh|khorn|hashut|gork|mork|asrai|isha|kurnous|khain|ghur|azyr|chamon|ulgu|hysh|shyish|ghyran)\p{L}*/giu;
const titleCase = (s) => {
  const t = s.toLowerCase().replace(PROPER, (w) => w.charAt(0).toUpperCase() + w.slice(1));
  return t.charAt(0).toUpperCase() + t.slice(1);
};

// Every spell of a lore: { key, from, to, name, cast, text }.
export const spellList = (lore) =>
  Object.values(magic[lore] || {}).map(([head, cast, text]) => {
    const p = parseHead(head);
    return { key: head, from: p.from, to: p.to, name: titleCase(p.name), cast: cast || "", text: text || "" };
  });

export const spellForRoll = (lore, total) =>
  spellList(lore).find((s) => total >= s.from && total <= s.to) || null;

// Known spells are stored by their list heading (unit.learnedSpells).
export const knownSpells = (unit) => {
  const lore = loreOf(unit);
  const list = lore ? spellList(lore) : [];
  return (unit.learnedSpells || []).map((key) => {
    const spell = list.find((s) => s.key === key || s.name.toLowerCase() === String(key).toLowerCase());
    return {
      ...(spell || { key, name: titleCase(parseHead(key).name), cast: "", text: "" }),
      mastery: Number(unit.spellMastery?.[key]) || 0,
    };
  });
};

// Mage level from the number of known spells (s. 550): I knows 1, II 2–3,
// III 4–6, IV 7 or more.
export const mageLevel = (unit) => {
  const n = (unit.learnedSpells || []).length;
  return n >= 7 ? 4 : n >= 4 ? 3 : n >= 2 ? 2 : 1;
};
export const LEVEL_NAMES = ["", "I", "II", "III", "IV"];
// TABELA MAKSYMALNEJ LICZBY KOSTEK MOCY PRZY RZUCANIU ZAKLĘCIA: level + 1.
export const maxPowerDice = (unit) => mageLevel(unit) + 1;

// The first spell (s. 550 / 590): a mage rolls K6 on the common spells and
// may take the lore's 7th spell instead; a priest rolls K6 and may take the
// first prayer instead.
export const firstSpellOptions = (unit, roll) => {
  const lore = loreOf(unit);
  if (!lore) return [];
  const rolled = spellForRoll(lore, roll);
  const swap = isPriest(unit) ? spellForRoll(lore, 1) : spellForRoll(lore, 7);
  return [rolled, swap].filter((s, i, a) => s && a.findIndex((x) => x.key === s.key) === i);
};

// Learning a new spell after "nowa umiejętność": a mage rolls 2K6, a priest 3K3.
export const learnDice = (unit) => (isPriest(unit) ? { count: 3, sides: 3, label: "3K3" } : { count: 2, sides: 6, label: "2K6" });
export const learnTotal = (unit, dice) =>
  isPriest(unit) ? dice.reduce((n, d) => n + Math.ceil(d / 2), 0) : dice.reduce((n, d) => n + d, 0);
// A repeated spell: the mage casts it at +1, the opponent dispels a prayer at −1.
export const masteryText = (unit) =>
  isPriest(unit)
    ? "przeciwnik ma −1 do rozpraszania tej modlitwy"
    : "+1 do rzutów na wymagany poziom mocy tego zaklęcia";

const dispelRuleLevel = (u) => {
  const r = (u.rules || []).find((x) => /^rozproszenie magii/i.test(String(x)));
  if (!r) return 0;
  const m = String(r).match(/\((\d)/);
  return m ? Number(m[1]) : 1;
};
const nameOf = (u) => u.unitDisplayName || u.unitName;
const inPlay = (u) =>
  !(u.battleAbsentModels || []).some(Boolean) &&
  !(u.battleOutOfActionModels || []).some(Boolean) &&
  !((u.campaignModelStatus || []).length && u.campaignModelStatus.every((st) => st?.dead));

// KOSTKI MOCY and KOSTKI ROZPROSZENIA (s. 550, 590). Each mage gets his own
// power dice (I: 1 … IV: 4); the company's pool holds one more die. Dispel
// dice: one, plus one per mage I–II or Rozproszenie magii (1), two per mage
// III–IV or Rozproszenie magii (2). A fleeing, stunned, knocked down or
// out-of-action model generates none: `isActive` tells which models count.
export const dicePools = (units = [], isActive = inPlay) => {
  const present = units.filter((u) => isActive(u));
  const mages = present.filter(isMage).map((u) => ({
    id: u.uniqueId,
    label: `${nameOf(u)} (mag ${LEVEL_NAMES[mageLevel(u)]})`,
    n: mageLevel(u),
    max: maxPowerDice(u),
  }));
  const dispel = [{ label: "Podstawa", n: 1 }];
  present.forEach((u) => {
    if (isMage(u)) dispel.push({ label: `${nameOf(u)} (mag ${LEVEL_NAMES[mageLevel(u)]})`, n: mageLevel(u) >= 3 ? 2 : 1 });
    else if (dispelRuleLevel(u))
      dispel.push({ label: `${nameOf(u)} (Rozproszenie magii ${dispelRuleLevel(u)})`, n: dispelRuleLevel(u) >= 2 ? 2 : 1 });
  });
  return {
    mages,
    pool: mages.length ? 1 : 0,
    dispel,
    dispelTotal: dispel.reduce((n, x) => n + x.n, 0),
    priests: present.filter(isPriest).map((u) => ({ id: u.uniqueId, label: nameOf(u) })),
  };
};
