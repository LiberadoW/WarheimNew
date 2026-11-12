import { getRuleText, getWeaponRuleNames } from "./getRuleText";
import { getEquipmentStats } from "../Data.js/EquipmentStats";
import { getDisplayEquipment, formatCustomEquipmentEntry } from "./displayEquipment";
import { catalog } from "../campaign/rules";

// What a unit carries, as shown to the player ("Średni pancerz", crafted
// and custom items included).
export const unitEquipmentItems = (unit) => {
  const standard = getDisplayEquipment(unit, [
    ...(unit.startingEquipment || []),
    ...(unit.optionalEquipment || []),
  ]).map((item) => (["Lekki", "Średni", "Ciężki"].includes(item) ? `${item} pancerz` : item));
  const custom = (unit.customEquipment || [])
    .map((entry) => formatCustomEquipmentEntry(entry))
    .filter((entry) => entry !== null);
  return standard.concat(custom);
};

// The dialog content for one item: its profile and the rules it grants.
export const describeEquipment = (unit, item) => {
  const name = item.replace(/ pancerz$/, "");
  const stats = getEquipmentStats(name);
  const custom = (unit.customEquipment || []).find((e) => e.name === item);
  const crafted = (unit.craftedEquipment?.[name] || []).map((r) => ({
    name: r.name + (r.active ? "" : " (nieaktywne)"),
    text: r.text,
  }));
  const definition = catalog.find((eq) => eq.name.toLowerCase() === item.toLowerCase());
  return {
    title: item,
    sections: [
      {
        title: "Profil",
        entries: [
          {
            name: item,
            text: stats
              ? `${stats.armour ? `Ochrona: ${stats.armour}` : `Zasięg: ${stats.range}; Siła: ${stats.strength}`}. Zasady: ${stats.rules || "brak"}`
              : custom?.text || definition?.text || "Brak profilu w katalogu.",
          },
        ],
      },
      {
        title: "Zasady broni",
        entries: [...new Set([...getWeaponRuleNames(stats?.rules), ...(unit.weaponEnhancements?.[name] || [])])]
          .map((rule) => ({ name: rule, text: getRuleText(rule) }))
          .concat(crafted),
      },
    ],
  };
};

// The dialog content for one of the unit's special rules.
export const describeRule = (unit, rule) => ({
  title: rule,
  sections: [
    {
      title: "Zasada jednostki",
      entries: [{ name: rule, text: unit.campaignRuleTexts?.[rule] || unit.dramaProfileText || getRuleText(rule) }],
    },
  ],
});

// A short profile line for an item chip: "S+1 · drzewcowa", "OP 5+".
export const equipmentHint = (item) => {
  const stats = getEquipmentStats(item.replace(/ pancerz$/, ""));
  if (!stats) return "";
  if (stats.armour) return `Ochrona ${stats.armour}`;
  return [stats.range !== "Walka wręcz" && stats.range, stats.strength && `S ${stats.strength}`].filter(Boolean).join(" · ");
};
