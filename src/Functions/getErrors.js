import { armyChoices } from "../Data.js/ArmyChoices";
import isGeneral from "./isGeneral";
import { getValueOfOptionalEquipment } from "./getValueOfOptionalEquipment";
import { getAllEquipment } from "./getAllEquipment";
import { getUnitNumbers } from "./getUnitNumbers";

const ONE_OF_ITEMS = ["Harpun", "Ołowiomiotacz"];

const unitWord = (count) =>
  count === 1 ? "jednostkę" : count > 4 ? "jednostek" : "jednostki";

// Every roster problem as { message, uniqueId? }. uniqueId points at the unit
// to open when the message is selected. The count shown in the header is the
// length of this list, so messages and count can never disagree.
export const getErrorMessages = (army, totalCost, modelAmount, unitList, limit) => {
  const messages = [];

  unitList.forEach((item) => {
    const startingWeaponsOptions = Object.entries(item.equipmentList || {}).filter(
      ([, value]) => value[2] === "Startowy",
    );

    if (startingWeaponsOptions.length > 0) {
      const intersection = item.optionalEquipment.filter((element) =>
        startingWeaponsOptions.flat().includes(element),
      );

      if (intersection.length < 1) {
        messages.push({
          uniqueId: item.uniqueId,
          message: `${item.unitName} musi posiadać przynajmniej 1 wybór z listy startowych broni: ${startingWeaponsOptions
            .map(([name]) => name)
            .join(", ")}.`,
        });
      }
    }
  });

  const unitNumbers = getUnitNumbers(
    unitList.filter((unit) => unit.type !== "Najemne Ostrze"),
  );
  const firstUnitNamed = (name) =>
    unitList.find((unit) => unit.unitName === name)?.uniqueId;

  Object.keys(unitNumbers).forEach((unit) => {
    const max = army?.heroes?.[unit]?.number;
    if (unitNumbers[unit] > max) {
      messages.push({
        uniqueId: firstUnitNamed(unit),
        message: `Banda może posiadać maksymalnie ${max} ${unitWord(max)} ${unit}.`,
      });
    }
  });

  (armyChoices[army.name] || []).forEach((group) => {
    const chosen = group.filter((name) => (unitNumbers[name] || 0) > 0);
    if (chosen.length > 1) {
      messages.push({
        uniqueId: firstUnitNamed(chosen[chosen.length - 1]),
        message: `Banda może posiadać tylko jedną z jednostek: ${group.join(" albo ")}.`,
      });
    }
  });

  (army.unitRatios || []).forEach(({ unit, required, ratio }) => {
    if ((unitNumbers[unit] || 0) > (unitNumbers[required] || 0) * ratio) {
      messages.push({
        uniqueId: firstUnitNamed(unit),
        message: `Na każdy model ${required} może przypadać maksymalnie ${ratio} × ${unit}.`,
      });
    }
  });

  unitList.forEach((unit) => {
    const profile = army.heroes[unit.unitName];
    if (profile?.retired) {
      messages.push({
        uniqueId: unit.uniqueId,
        message: profile.retiredReason
          ? `${unit.unitName}: ${profile.retiredReason}`
          : `${unit.unitName} nie jest już dostępny w tej bandzie.`,
      });
    }
    (profile?.requiredEquipmentGroups || []).forEach((group) => {
      const options = Object.keys(profile.equipmentList).filter(
        (name) => profile.equipmentList[name][2] === group,
      );
      const chosen = options.filter(
        (name) => unit.optionalEquipment.includes(name) || unit.rules.includes(name),
      );
      if (chosen.length !== 1) {
        messages.push({
          uniqueId: unit.uniqueId,
          message: `${unit.unitName} musi mieć wybraną dokładnie jedną opcję: ${options.join(", ")}.`,
        });
      }
    });
  });

  const equipmentList = getAllEquipment(unitList);

  ONE_OF_ITEMS.forEach((item) => {
    if (equipmentList.filter((x) => x === item).length > 1) {
      messages.push({ message: `Banda może posiadać maksymalnie 1 ${item}.` });
    }
  });

  if (totalCost > limit) {
    messages.push({ message: "Przekroczono liczbę złotych koron." });
  }
  if (!isGeneral(unitList)) {
    messages.push({ message: "Banda musi posiadać dowódcę." });
  }
  if (modelAmount < army.minModels) {
    messages.push({
      message: `Banda musi składać się z przynajmniej ${army.minModels} modeli.`,
    });
  }
  if (modelAmount > army.maxModels) {
    messages.push({
      message: `Banda musi składać się z maksymalnie ${army.maxModels} modeli.`,
    });
  }
  if (army.armyRules.includes("Zamożność") && totalCost > 500) {
    const valueOfOptionalEquipment = getValueOfOptionalEquipment(unitList);

    if (valueOfOptionalEquipment < totalCost - 500) {
      messages.push({
        message:
          'Dodatkowe zk z zasady "Zamożność" muszą być przeznaczone na zakup ekwipunku.',
      });
    }
  }

  return messages;
};

const getErrors = (army, totalCost, modelAmount, unitList, limit) =>
  getErrorMessages(army, totalCost, modelAmount, unitList, limit).length;

export default getErrors;
