export const getModifiers = (arr,unit) => {
  let armour = 7;
  let speedModifier = 0;
  let initativeModifier = 0;

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
    arr.includes("Ciężki") || arr.includes("Pancerz z Gromrilu")
  ) {
    speedModifier = 1;
    initativeModifier = 1;
  }

  if (arr.includes("Ciężki") && arr.includes("Tarcza") || arr.includes("Pancerz z Gromrilu") && arr.includes("Tarcza"))  {
    speedModifier = 1;
    initativeModifier = 2;
  }

  if (unit.rules.includes("Krzepki")) {
    speedModifier = 0;
    initativeModifier = 0;
  }

  return [armour, speedModifier, initativeModifier];
};
