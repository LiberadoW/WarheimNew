import { mountList } from "./getPrestige";

export const getModifiers = (arr, unit) => {
  let armour = 7;
  let speedModifier = 0;
  let initativeModifier = 0;

  if (
    unit.startingEquipment
      .concat(unit.optionalEquipment)
      .some((item) => Object.keys(mountList).includes(item))
  ) {
    armour -= 1;
  }

  if (
    ["Dzik", "Obmierzły pajonk", "Zimnokrwisty"].some((element) =>
      unit.startingEquipment.concat(unit.optionalEquipment).includes(element)
    )
  ) {
    armour -= 1;
  }

  if (unit.rules.includes("Żelazoskóry")) {
    armour -= 1;
  }

  const scalySkin = unit.rules.find((x) => x.includes("Łuskowata skóra"));

  if (scalySkin) {
    const scalySkinValue = scalySkin.match(/\d+/g);
    armour -= 7 - scalySkinValue;
  }

  if (unit.rules.includes("Czołg parowy")) {
    armour -= 6;
  }

  if (arr.includes("Lekki")) {
    armour -= 1;
  }
  if (arr.includes("Średni")) {
    armour -= 2;
  }
  if (arr.includes("Ciężki")) {
    armour -= 3;
  }
  if (arr.includes("Tarcza")) {
    armour -= 1;
  }
  if (arr.includes("Pancerz z Ithilmaru")) {
    armour -= 3;
  }
  if (arr.includes("Zbroja Chaosu")) {
    armour -= 4;
  }

  if (arr.includes("Pancerz z Gromrilu")) {
    armour -= 4;
  }

  if (
    (arr.includes("Lekki") && arr.includes("Tarcza")) ||
    arr.includes("Średni")
  ) {
    initativeModifier = 1;
  }

  if (
    (arr.includes("Średni") && arr.includes("Tarcza")) ||
    arr.includes("Ciężki") ||
    arr.includes("Pancerz z Gromrilu")
  ) {
    speedModifier = 1;
    initativeModifier = 1;
  }

  if (
    (arr.includes("Ciężki") && arr.includes("Tarcza")) ||
    (arr.includes("Pancerz z Gromrilu") && arr.includes("Tarcza"))
  ) {
    speedModifier = 1;
    initativeModifier = 2;
  }

  if (unit.rules.includes("Krzepki")) {
    speedModifier = 0;
    initativeModifier = 0;
  }

  return [armour, speedModifier, initativeModifier];
};
