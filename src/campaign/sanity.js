import mental from "./mental-injuries.json";
import mutations from "./mutations.json";
import * as R from "./rules";
export { mental, mutations };
export const SANITY_THRESHOLDS = [
  8, 15, 22, 28, 34, 40, 45, 50, 55, 59, 63, 67, 71, 74, 77, 80, 83, 85, 87, 89,
];
export function sanityTasks(post) {
  return post.units
    .filter((u) => R.isHero(u) && !u.campaignModelStatus?.[0]?.dead)
    .flatMap((u) =>
      SANITY_THRESHOLDS.filter(
        (t) =>
          t > (post.sanityBefore?.[u.uniqueId] ?? (Number(u.obled) || 0)) &&
          t <= Number(u.obled),
      ).map((threshold) => ({
        unitId: u.uniqueId,
        threshold,
        key: `${u.uniqueId}:${threshold}`,
      })),
    )
    .filter((t) => !post.sanityResolved?.[t.key]);
}
export function addIllness(post, unit, dice, note = "") {
  if (!R.validDice(dice, 2))
    throw Error("Wpisz wynik K66 choroby psychicznej.");
  const entry = mental.find((e) => e.code === R.k66(dice));
  if (entry.code === 15 && !note.trim())
    throw Error(
      "Rozstrzygnij utratę umiejętności z opisu amnezji i zapisz wynik w notatce.",
    );
  R.addRule(unit, entry.name);
  unit.mentalIllnesses = [
    ...(unit.mentalIllnesses || []),
    { ...entry, acquiredAt: post.battleId, age: 0, note },
  ];
  unit.campaignRuleTexts = {
    ...(unit.campaignRuleTexts || {}),
    [entry.name]: entry.text,
  };
  const ruleNames = {
    14: ["Alkoholizm"],
    16: ["Animozja"],
    22: ["Berserk"],
    32: ["Furia"],
    33: ["Głód krwi"],
    34: ["Głupota"],
    52: ["Animozja", "Nienawiść"],
    66: ["Przepastne trzewia"],
  };
  // The named illness remains the authoritative description for conditional effects.
  (ruleNames[entry.code] || []).forEach((name) => R.addRule(unit, name));
  R.log(post, "mental", `${R.label(unit)}: ${entry.name}. ${note}`);
  return entry;
}
export function resolveSanity(post, task, dice, note) {
  if (!sanityTasks(post).some((t) => t.key === task.key))
    throw Error(
      "Ten próg Obłędu jest już rozliczony lub nie został osiągnięty.",
    );
  const u = post.units.find((u) => u.uniqueId === task.unitId),
    entry = addIllness(post, u, dice, note);
  post.sanityResolved = {
    ...(post.sanityResolved || {}),
    [task.key]: { code: entry.code, dice, note },
  };
}
export function setExceptionalStat(unit, index, value) {
  const stats = [...R.currentStats(unit)];
  stats[index] = Math.min(10, Math.max(0, value));
  unit.stats.Aktualna = stats;
  unit.statsModifiers = (unit.stats.Początkowa || []).map((n, i) =>
    typeof n === "number" && typeof stats[i] === "number" ? stats[i] - n : 0,
  );
}
export function mutationResult(god, dice) {
  if (!R.validDice(dice, 2)) return null;
  return mutations.find(
    (m) => m.god === god && R.k66(dice) >= m.min && R.k66(dice) <= m.max,
  );
}
export function applyMutation(
  post,
  unitId,
  god,
  dice,
  {
    testDice = [],
    secondary = [],
    mentalDice = [],
    note = "",
    reason = "",
  } = {},
) {
  const u = post.units.find((u) => u.uniqueId === unitId),
    entry = mutationResult(god, dice);
  if (!u || !entry || !reason.trim())
    throw Error("Wybierz model, wynik K66, znak i źródło mutacji.");
  if (
    (u.mutations || []).some((m) => R.normal(m.name) === R.normal(entry.name))
  )
    throw Error("Model ma już ten stygmat. Powtórz rzut.");
  const limit = u.mutationLimit ?? R.currentStats(u)[4],
    next = (u.mutations || []).length + 1;
  if (next > limit && !R.validDice(testDice, 1))
    throw Error("Wykonaj test WT na przekroczenie limitu mutacji.");
  if (entry.name === "Szaleństwo" && !R.validDice(mentalDice, 2))
    throw Error("Wykonaj K66 choroby psychicznej.");
  if (entry.name === "Atrofia" && !R.validDice(secondary, 1))
    throw Error("Wykonaj K6 na efekt atrofii.");
  const originalStats = [...R.currentStats(u)];
  u.mutationLimit = limit;
  u.mutations = [...(u.mutations || []), { ...entry, dice, reason }];
  R.addRule(u, `Stygmat Chaosu (${entry.name})`);
  u.campaignRuleTexts = {
    ...(u.campaignRuleTexts || {}),
    [`Stygmat Chaosu (${entry.name})`]: entry.text,
  };
  const statChanges = {
    "Bycza skóra": [[4, 1]],
    "Wywrócony na wierzch": [[4, -1]],
    "Myśląca narośl": [
      [4, -1],
      [5, 1],
    ],
    Satyr: [[0, 1]],
    "Przerośnięte ramiona": [[3, 1]],
    Robaczywy: [[4, -1]],
    Kopyta: [[0, 1]],
    Albinos: [[4, -1]],
    Eteryczny: [[4, -1]],
  };
  for (const [i, delta] of statChanges[entry.name] || [])
    setExceptionalStat(u, i, R.currentStats(u)[i] + delta);
  if (entry.name === "Jednooki")
    setExceptionalStat(u, 2, Math.floor(R.currentStats(u)[2] / 2));
  if (entry.name === "Kryształowe ciało") {
    setExceptionalStat(u, 4, 10);
    setExceptionalStat(u, 5, 1);
    u.stats.Maksymalna[4] = 10;
    u.stats.Maksymalna[5] = 1;
  }
  const rules = {
    Przyssawki: ["Murołaz"],
    Ogon: ["Akrobata"],
    "Plucie kwasem": ["Żrąca plwocina"],
    Prymityw: ["Ograniczony"],
    Bezrozumny: ["Głupota", "Niezłomny", "Stan niższy", "Tempy"],
    Macka: ["Oplątanie"],
    Niegodziwiec: ["Niezłomny"],
    Pazury: ["Broń naturalna", "Wspinaczka"],
    "Chwytny ogon": ["Chwytny ogon"],
    Przerażający: ["Groza"],
    "Głód krwi": ["Głód krwi"],
    "Ognista czaszka": ["Płonący atak"],
    Satyr: ["Ranger"],
    "Żywy szkielet": ["Nieumarły"],
    Furia: ["Furia"],
    Skoczek: ["Akrobata"],
    Czaszka: ["Strach"],
    "Rój much": ["Szósty zmysł"],
    Kopyta: ["Ranger"],
    "Cuchnący dotyk": ["Zatruty atak"],
    Ponętny: ["Uwodzenie"],
    "Kłujący jęzor": ["Przymiot (dzierzba)"],
    Bezduszny: ["Zimnokrwisty"],
    Szczypce: ["Broń naturalna", "Zabójczy cios"],
    Marionetka: ["Przepastne trzewia"],
    Podżegacz: ["Podżeganie"],
    "Ogniste ciało": ["Ognista korona"],
    Wielogłowy: ["Szósty zmysł"],
  };
  (rules[entry.name] || []).forEach((r) => R.addRule(u, r));
  if (entry.name === "Szaleństwo") addIllness(post, u, mentalDice, note);
  if (entry.name === "Atrofia") {
    if (secondary[0] <= 2) {
      R.addRule(u, "Stygmat Chaosu (Gwoździogłowy)");
      u.campaignRuleTexts["Stygmat Chaosu (Gwoździogłowy)"] = mutations.find(
        (m) => m.name === "Gwoździogłowy",
      ).text;
    } else {
      const wound = R.injuries.find(
        (i) => i.min === (secondary[0] <= 4 ? 23 : 22),
      );
      for (let index = 0; index < R.modelCount(u); index++)
        R.applyInjury(
          post,
          {
            unitId,
            index,
            key: `mutation:${post.battleId}:${unitId}:${(u.mutations || []).length}:${index}`,
          },
          wound,
          secondary[0] <= 4 ? { secondary: [1] } : {},
        );
    }
  }
  const failed =
    next > limit &&
    (testDice[0] === 6 ||
      (testDice[0] !== 1 && testDice[0] > R.currentStats(u)[4]));
  const zeroSpawn = [3, 4, 8].some(
      (i) => originalStats[i] > 0 && R.currentStats(u)[i] === 0,
    ),
    zeroDeath = [0, 1, 2, 5, 6, 7].some(
      (i) => originalStats[i] > 0 && R.currentStats(u)[i] === 0,
    );
  if (failed || zeroSpawn) {
    u.unitName = "Pomiot Chaosu";
    u.type = "Stronnik";
    u.rules = [
      "Broń naturalna",
      "Przebicie pancerza",
      "Druzgoczący",
      "Duży cel",
      "Nieświadomy",
      "Niezłomny",
      "No to hooop!",
      "Piętno Chaosu",
      "Przepastne trzewia",
      "Regeneracja",
      "Strach",
      "Trafienie z uderzenia",
      "Wielkolud",
      "Zbrojne kończyny",
      "Żywiołak Chaosu",
    ];
    u.baseRules = [...u.rules];
    u.newRules = [];
    u.skills = [];
    u.exp = 0;
    u.stats = {
      Początkowa: ["2K6", 3, "-", 4, 5, 3, 2, "K6+1", 10],
      Maksymalna: ["2K6", 3, "-", 4, 5, 3, 2, "K6+1", 10],
    };
    delete u.stats.Aktualna;
    u.statsModifiers = Array(9).fill(0);
    for (const eq of u.campaignEquipment || [])
      if (eq.category?.startsWith("Magicz") || u.craftedEquipment?.[eq.name])
        R.storeItem(post, eq.name, R.modelCount(u), {
          catalogId: eq.catalogId,
          basePrice: eq.basePrice,
          crafting: u.craftedEquipment?.[eq.name],
        });
    u.startingEquipment = [];
    u.optionalEquipment = [];
    u.craftedEquipment = {};
    for (const a of post.advances.filter(
      (a) => a.unitId === unitId && !a.resolved,
    )) {
      a.resolved = true;
      a.description = "Przemiana w Pomiot Chaosu — utrata rozwoju";
    }
    u.customEquipment = (u.customEquipment || []).filter((e) =>
      u.campaignEquipment?.some(
        (c) => c.name === e.name && c.category?.startsWith("Magicz"),
      ),
    );
    R.log(post, "spawn", `${R.label(u)} przemienia się w Pomiot Chaosu.`);
  } else if (zeroDeath)
    for (let index = 0; index < R.modelCount(u); index++)
      R.applyInjury(
        post,
        {
          unitId,
          index,
          key: `mutation-death:${post.battleId}:${unitId}:${index}`,
        },
        R.injuries.find((i) => i.min === 11),
      );
  R.log(
    post,
    "mutation",
    `${R.label(u)}: ${god} / ${entry.name}. ${reason}. ${note}`,
  );
}
export function darkPact(units, unitId, dice = []) {
  const unit = units.find((u) => u.uniqueId === unitId),
    count = units.reduce((n, u) => n + (u.battlePacts || 0), 0);
  if (!unit || !R.isHero(unit) || count >= 3)
    throw Error("W potyczce można zawrzeć najwyżej trzy Mroczne Pakty.");
  if (count > 0 && !R.validDice(dice, 1))
    throw Error("Wykonaj rzut kosztu Punktów Obłędu.");
  const gained =
    count === 0 ? 1 : count === 1 ? Math.ceil(dice[0] / 2) : dice[0];
  unit.battlePacts = (unit.battlePacts || 0) + 1;
  unit.battleObled = (unit.battleObled || 0) + gained;
  return gained;
}
