export const getAllRules = (unitList) => {
  const rulesArray = [];

  unitList.forEach((unit) => rulesArray.push(...unit.rules));

  const uniqueRulesArray = [...new Set(rulesArray)]

  uniqueRulesArray.sort()

  return uniqueRulesArray;
};
