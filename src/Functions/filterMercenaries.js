export const filterMercenaries = (mercenaries, army) => {
  const filteredMercenaries = army?.mercenaries?.reduce(
    (obj, key) => ({ ...obj, [key]: mercenaries[key] }),
    {}
  );
  return filteredMercenaries;
};
