const getNumberOfCheckedStartingWeapons = (index) => {
  const startingWeapons = Array.from(
    document.querySelectorAll(
      `div.unit[id='${String(index)}'] [data='Startowy']`
    )
  ).concat(
    Array.from(
      document.querySelectorAll(
        `div.unit[id='${String(index)}'] [data='Startowy1']`
      )
    )
  );

  let howManyChecked = null;

  if (startingWeapons.length !== 0) {
    howManyChecked = startingWeapons.filter((x) => x.checked === true).length;
  }

  return howManyChecked;
};

export default getNumberOfCheckedStartingWeapons;
