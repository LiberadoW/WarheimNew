// Works out which equipment a unit has taken and what it may still take,
// straight from the unit data. Category indexes follow the army equipment
// lists: [cost, category, group tag].

export const EQUIPMENT_CATEGORIES = [
  "Broń do walki wręcz",
  "Broń dystansowa",
  "Pancerz",
  "Specjalne",
  "Kolegia Magii",
];

const MELEE = 0;
const RANGED = 1;

// Taking one item of these groups blocks the rest of the group.
const EXCLUSIVE_GROUPS = ["Zbroja", "Tarcza", "Choice", "Tradycja", "Dualizm"];

export const DOUBLE_PICK_BLOCKLIST = [
  "Harpun",
  "Ołowiomiotacz",
  "Kulomiot",
  "Miotacz spaczognia",
  "Moździerz trującego wichru",
  "Spaczrusznica",
];

const shouldSplitEquipmentName = (name) =>
  name.includes("/") && !name.includes("(") && !name.includes(")");

export const getEquipmentAliases = (name) => {
  if (!shouldSplitEquipmentName(name)) {
    return [name];
  }

  return name
    .split("/")
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
};

export const getSelectedAliases = (unit, canonicalName) => {
  const aliases = getEquipmentAliases(canonicalName);
  const rawSelection = unit.equipmentAliasSelections?.[canonicalName];

  if (aliases.length === 1) {
    return aliases;
  }

  if (Array.isArray(rawSelection)) {
    return rawSelection.filter((alias) => aliases.includes(alias));
  }

  if (typeof rawSelection === "string" && aliases.includes(rawSelection)) {
    return [rawSelection];
  }

  return [];
};

export const getDefaultAlias = (canonicalName) =>
  getEquipmentAliases(canonicalName)[0];

export const countOccurrences = (arr, value) =>
  arr.filter((item) => item === value).length;

export const getWeaponLimit = (unit) =>
  unit.rules.includes("Zbrojny po zemby") ? 3 : 2;

// One option per selectable name (split names such as
// "Topór bojowy/Nadziak" give one option per alias). Each option has up to
// two slots: the first copy and, for weapons, a second copy.
const buildOptions = (unit) => {
  const options = [];

  Object.entries(unit.equipmentList).forEach(([canonicalName, value]) => {
    const category = value[1];
    if (!EQUIPMENT_CATEGORIES[category]) {
      return;
    }

    const aliases = getEquipmentAliases(canonicalName);
    const isSplitOption = aliases.length > 1;
    const selectedAliases = getSelectedAliases(unit, canonicalName);
    const defaultAlias = getDefaultAlias(canonicalName);
    const hasStartingCanonical = unit.startingEquipment.includes(canonicalName);
    const isCanonicalSelected =
      unit.optionalEquipment.includes(canonicalName) ||
      hasStartingCanonical ||
      unit.rules.includes(canonicalName);
    const canonicalCount = unit.optionalEquipment
      .concat(unit.startingEquipment)
      .filter((x) => x === canonicalName).length;
    const startingCount = countOccurrences(
      unit.startingEquipment,
      canonicalName,
    );

    aliases.forEach((displayName, aliasIndex) => {
      const startingAliasCount =
        hasStartingCanonical && displayName === defaultAlias
          ? startingCount
          : 0;
      const totalAliasCount =
        startingAliasCount + countOccurrences(selectedAliases, displayName);
      const canDoublePick =
        category <= RANGED && !DOUBLE_PICK_BLOCKLIST.includes(canonicalName);

      options.push({
        key: `${canonicalName}::${aliasIndex}`,
        canonicalName,
        displayName,
        alias: isSplitOption ? displayName : undefined,
        cost: value[0],
        category,
        group: value[2],
        isSplitOption,
        canDoublePick,
        firstChecked: isSplitOption
          ? selectedAliases.includes(displayName) ||
            (hasStartingCanonical && displayName === defaultAlias)
          : isCanonicalSelected,
        firstLocked: isSplitOption ? false : hasStartingCanonical,
        secondChecked:
          canDoublePick &&
          (isSplitOption ? totalAliasCount >= 2 : canonicalCount === 2),
        secondLocked: isSplitOption ? totalAliasCount < 1 : startingCount === 2,
        isStarting: isSplitOption
          ? startingAliasCount > 0
          : hasStartingCanonical,
      });
    });
  });

  return options;
};

// Every taken slot, the way the old checkbox list counted them.
const getCheckedSlots = (options) =>
  options.flatMap((option) => [
    ...(option.firstChecked ? [option] : []),
    ...(option.secondChecked ? [option] : []),
  ]);

const getBlockReason = (option, checkedSlots, weaponLimit) => {
  if (option.category === MELEE || option.category === RANGED) {
    const takenWeapons = checkedSlots.filter(
      (slot) =>
        slot.category === option.category &&
        !(option.category === MELEE && slot.canonicalName === "Sztylet"),
    ).length;
    if (takenWeapons >= weaponLimit) {
      return "limit broni";
    }
  }

  if (EXCLUSIVE_GROUPS.includes(option.group)) {
    const takenInGroup = checkedSlots.find(
      (slot) => slot.group === option.group,
    );
    if (takenInGroup) {
      return `wybrano: ${takenInGroup.displayName}`;
    }
  }

  return null;
};

// Returns the options with how many copies are taken, whether another copy
// can be added (and why not), and whether one can be removed.
export const getEquipmentOptions = (unit) => {
  const options = buildOptions(unit);
  const checkedSlots = getCheckedSlots(options);
  const weaponLimit = getWeaponLimit(unit);

  return options.map((option) => {
    const copies = (option.firstChecked ? 1 : 0) + (option.secondChecked ? 1 : 0);
    let nextSlot = null;
    let blockReason = null;

    if (!option.firstChecked) {
      nextSlot = option.firstLocked ? null : "first";
    } else if (option.canDoublePick && !option.secondChecked) {
      nextSlot = option.secondLocked ? null : "second";
    }

    if (nextSlot) {
      blockReason = getBlockReason(option, checkedSlots, weaponLimit);
    } else if (copies > 0) {
      blockReason = "wybrano";
    }

    let removeSlot = null;
    if (option.secondChecked && !option.secondLocked) {
      removeSlot = "second";
    } else if (option.firstChecked && !option.firstLocked) {
      removeSlot = "first";
    }

    return {
      ...option,
      copies,
      addSlot: nextSlot && !blockReason ? nextSlot : null,
      blockReason,
      removeSlot,
    };
  });
};

// How many of the unit's starting-weapon choices are taken.
export const countStartingChoices = (unit) =>
  getCheckedSlots(buildOptions(unit)).filter(
    (slot) => slot.group === "Startowy",
  ).length;
