import { pdfRules } from "../Data.js/PdfRules";
import { siteRules } from "../Data.js/SiteRules";
import { rulesObject } from "../Data.js/Rules";
import { getEquipmentStats } from "../Data.js/EquipmentStats";
import { getSelectedAliases } from "./equipmentSelection";

// "Odporność na magię (1)", "ROZPROSZENIE MAGII, (1-3):" and
// "Duchowny (modlitwy do Ranalda)" all share one rule text.
export const normalizeRuleName = (name) =>
  name
    .toLowerCase()
    .replace(/\(.*?(\)|$)/g, "")
    .replace(/[–—]/g, "-")
    .replace(/^[….\s]+/, "")
    .replace(/[\s:.,]+$/, "")
    .replace(/\s+/g, " ")
    .trim();

// "Stygmaty Nurgla (odór, rój much)" keeps its parameter: each unit's
// stigma combination has its own text.
const fullRuleName = (name) =>
  name
    .toLowerCase()
    .replace(/^[….\s]+/, "")
    .replace(/[\s:.,]+$/, "")
    .replace(/\s+/g, " ")
    .trim();

// Precedence: the rulebook PDF, then warheimer, then the older transcriptions.
const ruleIndex = {};
const exactPdfIndex = {};
const generalPdfRules = {};
Object.entries(pdfRules).forEach(([name, text]) => {
  if (name.includes("(")) {
    exactPdfIndex[fullRuleName(name)] = text;
  } else {
    generalPdfRules[name] = text;
  }
});

[rulesObject, siteRules, generalPdfRules].forEach((source) =>
  Object.entries(source).forEach(([name, text]) => {
    if (text) {
      ruleIndex[normalizeRuleName(name)] = text;
    }
  }),
);

export const getRuleText = (rule) =>
  exactPdfIndex[fullRuleName(rule)] ||
  ruleIndex[normalizeRuleName(rule)] ||
  "";

const capitalize = (text) => text.charAt(0).toUpperCase() + text.slice(1);

// Splits "drzewcowa, limitowany (3); styl defensywny: ogłuszający" into rule
// names, keeping only the ones with a known rule text.
export const getWeaponRuleNames = (rulesText = "") =>
  rulesText
    .split(/[,;](?![^(]*\))/)
    .map((part) => part.replace(/^[^:(]*:\s*/, "").trim())
    .filter((part) => part && getRuleText(part))
    .map(capitalize);

const getUnitEquipmentNames = (unit) =>
  unit.startingEquipment
    .concat(unit.optionalEquipment || [])
    .flatMap((name) =>
      getEquipmentStats(name) ? [name] : getSelectedAliases(unit, name),
    );

// { ruleName: [equipment names that grant it] }
export const getEquipmentRules = (unit) => {
  const rules = {};

  getUnitEquipmentNames(unit).forEach((name) => {
    const stats = getEquipmentStats(name);
    if (!stats) {
      return;
    }
    getWeaponRuleNames(stats.rules).forEach((rule) => {
      rules[rule] = rules[rule] || [];
      if (!rules[rule].includes(name)) {
        rules[rule].push(name);
      }
    });
  });

  return rules;
};

const sortPolish = (a, b) => a.localeCompare(b, "pl");

// Everything the printed roster needs for its rules appendix.
export const getArmyRulesSummary = (unitList) => {
  const unitRules = new Set();
  const equipmentRules = {};
  const equipment = new Set();

  unitList.forEach((unit) => {
    unit.rules.forEach((rule) => unitRules.add(rule));
    getUnitEquipmentNames(unit).forEach((name) => {
      if (getEquipmentStats(name)) {
        equipment.add(name);
      }
    });
    Object.entries(getEquipmentRules(unit)).forEach(([rule, items]) => {
      equipmentRules[rule] = [
        ...new Set([...(equipmentRules[rule] || []), ...items]),
      ];
    });
  });

  return {
    unitRules: [...unitRules].sort(sortPolish),
    equipmentRules: Object.keys(equipmentRules)
      .sort(sortPolish)
      .map((rule) => ({ rule, items: equipmentRules[rule].sort(sortPolish) })),
    equipment: [...equipment].sort(sortPolish),
  };
};

// The text of a rule as this unit has it: a rolled stigma, illness or other
// campaign rule keeps its own text (stored on the unit); "Stygmat Chaosu
// (Przerażający)" must not fall back to the general STYGMAT CHAOSU rule.
export const unitRuleText = (unit, rule, mutationTable = []) => {
  if (unit?.campaignRuleTexts?.[rule]) return unit.campaignRuleTexts[rule];
  const stigma = String(rule).match(/^Stygmat Chaosu \((.+)\)$/i);
  if (stigma) {
    const name = stigma[1].trim().toLowerCase();
    const own = (unit?.mutations || []).find((m) => String(m.name).toLowerCase() === name);
    if (own?.text) return own.text;
    const any = mutationTable.find((m) => String(m.name).toLowerCase() === name);
    if (any?.text) return any.text;
  }
  return unit?.dramaProfileText && !getRuleText(rule) ? unit.dramaProfileText : getRuleText(rule);
};
