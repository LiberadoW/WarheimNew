// ZNAK CHAOSU (s. 58): a company with an unspecified mark chooses its Dark
// Power when it is recruited. The choice sets the spell lore of marked
// casters (Khorne: DEMONOLOG instead of spells) and which demons may serve.

export const CHAOS_MARKS = [
  {
    key: "niewolnicy",
    name: "Niewolnicy Ciemności",
    god: "Chaos Niepodzielony",
    lore: "Dziedzina Chaosu",
    demon: "Furia Chaosu",
    hatred: "",
  },
  {
    key: "khorne",
    name: "Wojownicy Khorna",
    god: "Khorne",
    lore: null,
    demon: "Piekielny ogar",
    hatred:
      "Nienawiść wobec naznaczonych Piętnem Slaanesha oraz Duchownych i Magów. Mag staje się Demonologiem i nie rzuca zaklęć.",
  },
  {
    key: "nurgle",
    name: "Potworny Lud Nurgla",
    god: "Nurgle",
    lore: "Dziedzina Nurgla",
    demon: "Nurgling",
    hatred: "Nienawiść wobec naznaczonych Piętnem Tzeentcha.",
  },
  {
    key: "slaanesh",
    name: "Wyznawcy Slaanesha",
    god: "Slaanesh",
    lore: "Dziedzina Slaanesha",
    demon: "Bólożądna pieszczota",
    hatred: "Nienawiść wobec naznaczonych Piętnem Khorna.",
  },
  {
    key: "tzeentch",
    name: "Uczniowie Tzeentcha",
    god: "Tzeentch",
    lore: "Dziedzina Tzeentcha",
    demon: "Różowy strachulec",
    hatred: "Nienawiść wobec naznaczonych Piętnem Nurgla.",
  },
];
const DEMONS = CHAOS_MARKS.map((m) => m.demon);

export const needsChaosMark = (army) =>
  (army?.armyRules || []).some((r) => r.trim() === "Znak Chaosu");
export const chaosMark = (key) => CHAOS_MARKS.find((m) => m.key === key);

// "Mag (Dziedzina Chaosu)" / "Mag (Dziedzina Chaosu albo Dziedzina Dziczy)"
export const markRules = (rules = [], mark) => {
  if (!mark) return rules;
  return rules.flatMap((rule) => {
    if (!/^Mag \(.*Dziedzina Chaosu/.test(rule)) return [rule];
    if (!mark.lore) return ["Demonolog"];
    return [rule.replace("Dziedzina Chaosu", mark.lore)];
  });
};

// Army data as seen by a company of the chosen Dark Power.
export const withChaosMark = (army, key) => {
  if (!army || !needsChaosMark(army)) return army;
  const mark = chaosMark(key);
  const heroes = Object.fromEntries(
    Object.entries(army.heroes || {}).map(([name, unit]) => {
      const wrongDemon = DEMONS.includes(name) && (!mark || mark.demon !== name);
      return [
        name,
        {
          ...unit,
          rules: markRules(unit.rules, mark),
          ...(wrongDemon
            ? { retired: true, retiredReason: mark ? `Tylko ${CHAOS_MARKS.find((m) => m.demon === name)?.name}.` : "Najpierw wybierz Mroczną Potęgę." }
            : {}),
        },
      ];
    }),
  );
  return {
    ...army,
    heroes,
    chaosMark: mark?.key || null,
    armyRules: (army.armyRules || []).map((r) =>
      r.trim() === "Znak Chaosu" && mark ? `Znak Chaosu (${mark.name})` : r,
    ),
  };
};

// Recruited units keep their own copy of the rules; re-mark them on a change.
export const remarkUnits = (unitList, army, key) => {
  const marked = withChaosMark(army, key);
  return unitList.map((unit) => {
    const base = army?.heroes?.[unit.unitName];
    if (!base) return unit;
    const target = marked.heroes[unit.unitName].rules || [];
    const previous = new Set(
      CHAOS_MARKS.flatMap((m) => markRules(base.rules, m)).concat(base.rules || []),
    );
    const own = (unit.rules || []).filter((r) => !previous.has(r));
    const baseRules = (unit.baseRules || unit.rules || []).filter(
      (r) => !previous.has(r),
    );
    return {
      ...unit,
      rules: [...new Set([...target, ...own])],
      ...(unit.baseRules ? { baseRules: [...new Set([...target, ...baseRules])] } : {}),
    };
  });
};
