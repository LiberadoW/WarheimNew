export const getModifiers = (arr) => {
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

  if (
    (arr.includes("Lekki") && arr.includes("Tarcza")) ||
    arr.includes("Średni")
  ) {
    initativeModifier = 1;
  }

  if (
    (arr.includes("Średni") && arr.includes("Tarcza")) ||
    arr.includes("Ciężki")
  ) {
    speedModifier = 1;
    initativeModifier = 1;
  }

  if (arr.includes("Ciężki") && arr.includes("Tarcza")) {
    speedModifier = 1;
    initativeModifier = 2;
  }

  return [armour, speedModifier, initativeModifier]
};
