const PATHS_OF_MAGIC = [
  "Tradycja Bestii",
  "Tradycja Cienia",
  "Tradycja Metalu",
  "Tradycja Niebios",
  "Tradycja Ognia",
  "Tradycja Śmierci",
  "Tradycja Światła",
  "Tradycja Życia",
  "Tradycja Lodu",
  "Magia Żywiołów",
  "Magia Asrai",
  "Wysoka Magia",
  "Mroczna Magia",
  "Magia Ognistej Paszczy",
  "Magia Demonów",
  "Magia Chaosu",
  "Dziedzina Chaosu Niepodzielonego",
  "Dziedzina Nurgla",
  "Dziedzina Slaanesha",
  "Dziedzina Tzeentcha",
  "Dziedzina Hashuta",
  "Dziedzina Dziczy",
  "Dziedzina Nekromancji",
  "Domena Nehekary",
  "Spaczmagia",
  "Tradycja Skrytości",
  "Tradycja Spaczmagii",
  "Tradycja Zarazy",
  "Magia Łooomotu!",
  "Dziedzina Boga-Pajonka",
  "Magia Pradawnych",
];

export const getMagicLore = (unitList) => {
  const mage = unitList.filter((item) =>
    item.rules.some((el) => PATHS_OF_MAGIC.includes(el))
  );

  console.log(mage)

  unitList.forEach((item) =>
    item.rules.forEach((el) => {
        console.log("ass")
    })
  );

  let pathOfMagic = null;

  if (mage.length > 0) {
    PATHS_OF_MAGIC.forEach((el) => {
      if (mage[0].rules.join().indexOf(el) != -1) {
        pathOfMagic = el;
      }
    });
  }

  return pathOfMagic;
};
