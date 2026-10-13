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
  "Dziedzina Nehekary",
  "Tradycja Yin",
  "Tradycja Yang",
  "Spaczmagia",
  "Tradycja Skrytości",
  "Tradycja Spaczmagii",
  "Tradycja Zarazy",
  "Magia Małego Łooomotu!",
  "Magia Dużego Łooomotu!",
  "Dziedzina Boga-Pajonka",
  "Magia Pradawnych",
  "Duchowny (modlitwy do Sigmara)",
  "Duchowny (modlitwy do Morra)",
  "Duchowny (modlitwy do Myrmidii)",
  "Duchowny (modlitwy do Ulryka)",
  "Duchowny (modlitwy do Ursuna)",
  "Duchowny (modlitwy do Ranalda)",
  "Duchowny (modlitwy do Mananna)",
];

export const getMagicLore = (unitList) => {
  let magicPath = null;

  unitList.forEach((unit) => {
    const selected = [...(unit.optionalEquipment || []), ...unit.rules].map((rule) =>
      rule === "Domena Nehekhary" ? "Dziedzina Nehekary" : rule);
    if (unit.rules.includes("Mag (Dziedzina Dao)")) {
      if (selected.includes("Dualizm (Yin)")) magicPath = "Tradycja Yin";
      if (selected.includes("Dualizm (Yang)")) magicPath = "Tradycja Yang";
      return;
    }
    const explicit = selected.filter((rule) => PATHS_OF_MAGIC.includes(rule));
    if (explicit.length) { magicPath = explicit[explicit.length - 1]; return; }
    PATHS_OF_MAGIC.forEach((path) => {
      unit.rules.forEach((rule) => {
        if (rule.replace(/Domena Nehekhary|Dziedzina Nehekhary/g, "Dziedzina Nehekary").includes(path)) {
          magicPath = path;
        }
      });
    });
  });

  return magicPath;
};
