const isGeneral = (unitList) => {
  return unitList.some((unit) => unit.rules.includes("Dowódca"));
};

export default isGeneral;
