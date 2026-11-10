// Equipment names as a player sees them: split alias names ("Topór bojowy/
// Nadziak") resolve to the chosen alias, custom entries to their names.
const shouldSplitEquipmentName = (name) =>
  typeof name === "string" &&
  name.includes("/") &&
  !name.includes("(") &&
  !name.includes(")");

const getEquipmentAliases = (name) => {
  if (!shouldSplitEquipmentName(name)) {
    return [name];
  }

  return name
    .split("/")
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
};

const getAliasSelectionQueue = (aliasSelections, canonicalName) => {
  const selected = aliasSelections?.[canonicalName];

  if (Array.isArray(selected)) {
    return [...selected];
  }

  if (typeof selected === "string" && selected.length > 0) {
    return [selected];
  }

  return [];
};

export const getDisplayEquipment = (unit, equipmentList) => {
  const aliasQueues = {};
  const startingCounts = (unit.startingEquipment || []).reduce(
    (acc, equipment) => {
      acc[equipment] = (acc[equipment] || 0) + 1;
      return acc;
    },
    {},
  );
  const seenCounts = {};

  return equipmentList.map((equipment) => {
    const aliases = getEquipmentAliases(equipment);

    if (aliases.length === 1) {
      return equipment;
    }

    const seenCount = seenCounts[equipment] || 0;
    seenCounts[equipment] = seenCount + 1;

    if (seenCount < (startingCounts[equipment] || 0)) {
      return aliases[0];
    }

    if (!aliasQueues[equipment]) {
      aliasQueues[equipment] = getAliasSelectionQueue(
        unit.equipmentAliasSelections,
        equipment,
      );
    }

    if (aliasQueues[equipment].length > 0) {
      return aliasQueues[equipment].shift();
    }

    return aliases[0];
  });
};

// 1 potyczka, 2–4 potyczki, 0 and 5+ potyczek.
export const formatCustomEquipmentEntry = (entry) => {
  if (entry && typeof entry === "object" && !Array.isArray(entry)) {
    const name = String(entry.name || "").trim();
    return name.length > 0 ? name : null;
  }

  if (typeof entry === "string" && entry.trim().length > 0) {
    return entry.trim();
  }

  return null;
};

const ARMOUR = ["Lekki", "Średni", "Ciężki"];

// One line per item, duplicates counted: "Sztylet, Pistolet ×2, Lekki pancerz".
export const getShortEquipment = (unit) => {
  const names = getDisplayEquipment(unit, [
    ...(unit.startingEquipment || []),
    ...(unit.optionalEquipment || []),
  ])
    .filter((name) => name !== "Chorąży" && name !== "Sygnalista")
    .map((name) => (ARMOUR.includes(name) ? `${name} pancerz` : name))
    .concat(
      (unit.customEquipment || [])
        .map(formatCustomEquipmentEntry)
        .filter((entry) => entry !== null),
    );
  const counts = new Map();
  names.forEach((name) => counts.set(name, (counts.get(name) || 0) + 1));
  return [...counts].map(([name, n]) => (n > 1 ? `${name} ×${n}` : name));
};
