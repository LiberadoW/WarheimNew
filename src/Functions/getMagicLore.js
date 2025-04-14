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
  "Magia Małego Łooomotu!",
  "Magia Dużego Łooomotu!",
  "Dziedzina Boga-Pajonka",
  "Magia Pradawnych",
  "Duchowny (modlitwy do Sigmara)",
];

export const getMagicLore = (unitList) => {
  let magicPath = null;

  unitList.forEach((unit) => {
    PATHS_OF_MAGIC.forEach((path) => {
      unit.rules.forEach((rule) => {
        if (rule.includes(path)) {
          magicPath = path;
        }
      });
    });
  });

  return magicPath;
};
