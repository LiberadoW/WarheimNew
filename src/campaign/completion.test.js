import * as R from "./rules";
import { getPrestige } from "../Functions/getPrestige";
import {
  companyChoices,
  selectCompanyAdvance,
  companyLevel,
  explorationRules,
  companyInjuryModifier,
  immortalTasks,
} from "./company";
import { recruit, recruitAvailability } from "./recruiting";
import {
  profiles,
  searchDrama,
  hireDrama,
  dramaWagePlan,
  settleDrama,
} from "./drama-rules";
import { quotePrice, settleStrigos } from "./trading";
import {
  reserveCraft,
  prepareCraft,
  resolveCraft,
  recipes,
} from "./crafting-rules";
import {
  sanityTasks,
  resolveSanity,
  applyMutation,
  mutations,
  darkPact,
} from "./sanity";
import { army as dummy } from "../Data.js/Armies/BractwoRycerskie";
import { applyEffects } from "./effects";
const hero = (extra = {}) => ({
  uniqueId: "h",
  unitName: "Rycerz",
  type: "Bohater",
  selectedNumber: 1,
  number: 1,
  cost: 50,
  totalCost: 50,
  exp: 20,
  rules: ["Dowódca"],
  skills: [0, 1, 2, 3, 4],
  equipmentList: { Miecz: [10, 0], Sztylet: [2, 0] },
  startingEquipment: ["Miecz"],
  optionalEquipment: [],
  customEquipment: [],
  stats: {
    Początkowa: [4, 4, 4, 3, 3, 2, 4, 1, 8],
    Maksymalna: [5, 6, 6, 5, 5, 3, 6, 4, 9],
  },
  battleAbsentModels: [false],
  battleOutOfActionModels: [false],
  ...extra,
});
const army = {
  name: "Gang przemytników",
  heroes: { Rycerz: hero() },
  maxModels: 15,
};
const setup = (units = [hero()]) =>
  R.beginPostBattle(
    { ...R.newBattle(units), gameName: "Test" },
    units,
    { skarbiec: 10000 },
    army,
  ).post;
test("mercenaries use henchman experience thresholds and cap but hero development table without repeated stat advances", () => {
  const p = setup([
    hero({
      type: "Najemne Ostrze",
      exp: 4,
      campaignAdvancements: [3],
      battleKills: 8,
      battleExp: 30,
    }),
  ]);
  R.applyExperience(p);
  expect(p.units[0].exp).toBe(14);
  expect(p.advances.map((a) => a.threshold)).toEqual([5, 9, 14]);
  expect(R.availableStats(p.units[0], 6)).toEqual([4]);
  expect(R.needsSkill(p.units[0], 10)).toBe(true);
});
test("dead mercenaries lose their equipment, and Drama never generates exploration dice", () => {
  const u = hero({ type: "Najemne Ostrze", battleOutOfActionModels: [true] }),
    p = setup([u]);
  R.applyInjury(p, R.injuryTasks(p)[0], R.injuryResult(u, [1]));
  expect(p.inventory).toEqual([]);
  expect(
    R.eligibleHeroes([
      hero({ type: "Postać Dramatu" }),
      hero({ uniqueId: "ordinary" }),
    ]).map((u) => u.uniqueId),
  ).toEqual(["ordinary"]);
});
test("company threshold rewards are selected once and retain their actual level", () => {
  const p = setup();
  p.campaignPointsApplied = true;
  p.campaignPoints = { determinacja: 15, gniew: 0, odpornosc: 0 };
  selectCompanyAdvance(p, {}, "determinacja-5-1");
  selectCompanyAdvance(p, {}, "determinacja-15-1");
  expect(companyLevel(p, "Kontakty handlowe")).toBe(2);
  expect(() => selectCompanyAdvance(p, {}, "determinacja-5-0")).toThrow();
  expect(companyChoices(p, {}).filter((c) => !c.selected)).toHaveLength(1);
});
test("craft reservation removes the exploration die before the pool is rolled and cannot be changed afterwards", () => {
  const p = setup([hero({ rules: ["Dowódca", "Kowal run"] })]);
  expect(explorationRules({ result: "loss" }, p).count).toBe(1);
  reserveCraft(p, "h", "rune");
  expect(explorationRules({ result: "loss" }, p).count).toBe(0);
  p.exploration = { locked: true };
  expect(() => reserveCraft(p, "h", "")).toThrow();
});
test("company medical bonus excludes special creatures; immortal replacement only follows a death roll", () => {
  const p = setup([hero({ type: "Stronnik" })]);
  p.armyRules = ["Konsyliarze", "Nieśmiertelni"];
  expect(companyInjuryModifier(p, p.units[0])).toBe(1);
  p.units[0].rules = ["Nieumarły"];
  expect(companyInjuryModifier(p, p.units[0])).toBe(0);
  p.units[0].rules = [];
  p.injuries["h:0"] = { code: 11, status: { dead: true } };
  expect(immortalTasks(p)).toHaveLength(1);
  p.injuries["h:0"].code = 22;
  expect(immortalTasks(p)).toHaveLength(0);
});
test("recruitment reads availability from the army profile instead of allowing a free manual bypass", () => {
  const name = Object.keys(dummy.heroes).find(
    (n) =>
      recruitAvailability(dummy, n) !== null &&
      !R.hasRule(dummy.heroes[n], "Dowódca"),
  );
  expect(name).toBeTruthy();
  const p = setup([]),
    target = recruitAvailability(dummy, name);
  p.availability = [{ id: "t", locked: true, total: 20, used: false }];
  recruit(p, dummy, name, { availability: 0, tokenId: "t" });
  expect(p.units).toHaveLength(1);
  expect(p.units[0].campaignNewRecruit).toBe(true);
  if (target > 0) expect(p.availability[0].used).toBe(true);
});
test("Drama search can be attempted once; a dead character cannot be rehired", () => {
  const p = setup(),
    profile = profiles.find((p) => p.name.startsWith("Ruben"));
  searchDrama(p, [2, 2]);
  expect(() => searchDrama(p, [1, 1])).toThrow();
  p.deadDrama = [profile.name];
  expect(() =>
    hireDrama(p, army, profile.name, "Potwierdzono warunki"),
  ).toThrow();
  p.deadDrama = [];
  const u = hireDrama(p, army, profile.name, "Potwierdzono warunki");
  expect(u.exp).toBe(12);
  expect(u.type).toBe("Postać Dramatu");
  expect(p.treasury).toBe(9950);
  expect(() =>
    hireDrama(p, army, profile.name, "Potwierdzono warunki"),
  ).toThrow();
});
test.each(profiles.map((p) => [p.name, p]))(
  "wage procedure exists for %s",
  (_, profile) => {
    const u = hero({
        unitName: profile.name,
        type: "Postać Dramatu",
        dramaId: profile.name,
      }),
      p = setup([
        hero({ uniqueId: "leader" }),
        u,
        hero({ uniqueId: "s", type: "Stronnik", unitName: "Zombie" }),
      ]);
    p.loot = 100;
    const answers = { feed: "Nie karm", wage: [6] };
    let plan;
    for (let i = 0; i < 20; i++) {
      plan = dramaWagePlan(u, answers, p);
      expect(plan.error).toBe("");
      if (plan.ready) break;
      const input = plan.inputs[plan.inputs.length - 1];
      answers[input.id] =
        input.type === "dice"
          ? Array(input.count).fill(1)
          : input.options[0].value;
    }
    expect(plan.ready).toBe(true);
  },
);
test("Ruben roll two requests K6 loot under the agreed erratum, and cannot be paid twice", () => {
  const profile = profiles.find((p) => p.name.startsWith("Ruben")),
    u = hero({
      type: "Postać Dramatu",
      dramaId: profile.name,
      unitName: profile.name,
    }),
    p = setup([u]);
  p.loot = 10;
  const answers = { wage: [2], payRoll: [4], payment: "Zapłać" };
  settleDrama(p, u.uniqueId, answers, army);
  expect(p.loot).toBe(6);
  expect(p.units).toHaveLength(1);
  expect(() => settleDrama(p, u.uniqueId, answers, army)).toThrow();
});
test("Strigos discount rounds up and the final theft removes all cash and loot and closes trading", () => {
  const p = setup();
  p.effects = { strigosDiscount: true, strigosTheftPending: true };
  p.loot = 12;
  expect(
    quotePrice(
      p,
      { price: "5", name: "Miecz", category: "Oręż — walka wręcz" },
      [],
      [],
    ),
  ).toBe(3);
  settleStrigos(p, [5]);
  expect(p.treasury).toBe(0);
  expect(p.loot).toBe(0);
  expect(p.tradeClosed).toBe(true);
  expect(() => settleStrigos(p, [1])).toThrow();
});
test("successful craft consumes a fixed material quote once and preserves an upgrade through the stash", () => {
  const p = setup([hero({ rules: ["Dowódca", "Kowal run"] })]),
    r = recipes.find((r) => r.name.startsWith("Runa cięcia"));
  reserveCraft(p, "h", "rune");
  p.availability = [{ id: "t", locked: true, total: 12, used: false }];
  prepareCraft(p, r.id, "h:startingEquipment:0", "h", [1, 2], "t");
  expect(p.craftQuote.price).toBe(53);
  resolveCraft(p, [5], [], [], "", [], {});
  expect(p.treasury).toBe(9947);
  expect(p.availability[0].used).toBe(true);
  expect(() => resolveCraft(p, [5], [], [], "", [], {})).toThrow();
  R.unequipItem(p, "h", "startingEquipment", 0);
  expect(p.inventory[0].crafting[0].id).toBe(r.id);
  R.equipStoredItem(p, "h", p.inventory[0].id, army.name);
  expect(p.units[0].craftedEquipment.Miecz[0].id).toBe(r.id);
});
test("craft failure stops a crafter but does not charge successful-material costs", () => {
  const p = setup([hero({ rules: ["Dowódca", "Kowal run"] })]),
    r = recipes.find((r) => r.name.startsWith("Runa cięcia"));
  reserveCraft(p, "h", "rune");
  p.availability = [{ id: "t", locked: true, total: 12, used: false }];
  prepareCraft(p, r.id, "h:startingEquipment:0", "h", [1, 2], "t");
  resolveCraft(p, [2], [3], [], "", [], {});
  expect(p.treasury).toBe(10000);
  expect(p.craftAttempts[0].stopped).toBe(true);
  expect(() =>
    prepareCraft(p, r.id, "h:startingEquipment:0", "h", [1, 2], "t"),
  ).toThrow();
});
test("Obled thresholds create required mental illness rolls once and cap at 89", () => {
  const p = setup([hero({ obled: 7, battleObled: 8 })]);
  R.applyExperience(p);
  expect(sanityTasks(p).map((t) => t.threshold)).toEqual([8, 15]);
  resolveSanity(p, sanityTasks(p)[0], [1, 1], "");
  expect(sanityTasks(p)).toHaveLength(1);
  expect(p.units[0].mentalIllnesses[0].name).toBe("Agorafobia");
});
test("Dark Pact limit is shared by the whole company, including fearless models", () => {
  const units = [hero({ rules: ["Niezłomny"] }), hero({ uniqueId: "second" })];
  darkPact(units, "h");
  darkPact(units, "second", [6]);
  darkPact(units, "h", [5]);
  expect(units[0].battleObled).toBe(6);
  expect(units[1].battleObled).toBe(3);
  expect(() => darkPact(units, "second", [1])).toThrow();
});
test("all five mutation tables cover every K66 result exactly once", () => {
  for (const god of [
    "Niepodzielony",
    "Khorne",
    "Nurgle",
    "Slaanesh",
    "Tzeentch",
  ])
    for (let a = 1; a <= 6; a++)
      for (let b = 1; b <= 6; b++)
        expect(
          mutations.filter(
            (m) => m.god === god && a * 10 + b >= m.min && a * 10 + b <= m.max,
          ),
        ).toHaveLength(1);
});
test("mutation stat changes may exceed racial maximum, repeated mutation is rejected", () => {
  const p = setup();
  p.units[0].stats.Maksymalna[4] = 3;
  applyMutation(p, "h", "Niepodzielony", [1, 1], { reason: "Stygmaty Chaosu" });
  expect(R.currentStats(p.units[0])[4]).toBe(4);
  expect(() =>
    applyMutation(p, "h", "Niepodzielony", [1, 1], {
      reason: "Stygmaty Chaosu",
    }),
  ).toThrow();
});
test("an injury during exploration can award PD and schedule a new advance after the normal experience phase", () => {
  const p = setup();
  p.units[0].exp = 23;
  p.expApplied = true;
  applyEffects(
    p,
    [
      {
        type: "injury",
        unitId: "h",
        result: R.injuryResult(p.units[0], [6, 6]),
      },
    ],
    "Przygoda",
    army,
  );
  expect(p.units[0].exp).toBe(24);
  expect(p.advances.map((a) => a.threshold)).toEqual([24]);
});
test("area-specific future effects wait for a matching game and are consumed once", () => {
  const notes = {
    campaign: {
      futureEffects: [
        { key: "scoutOutside", area: "outside" },
        { key: "extraExplorationDropLowest", extraDice: 1, discardLowest: 1 },
      ],
    },
  };
  const b = R.beginPostBattle(
    { ...R.newBattle([hero()]), area: "inside" },
    [hero()],
    notes,
    army,
  );
  expect(b.post.futureEffects.map((e) => e.key)).toEqual(["scoutOutside"]);
  expect(b.post.activeFutureEffects.map((e) => e.key)).toEqual([
    "extraExplorationDropLowest",
  ]);
});
test.each(
  profiles.flatMap((profile) =>
    [1, 2, 3, 4, 5, 6].map((n) => [profile.name, n, profile]),
  ),
)("wage branch %s / %i reaches a usable resolution", (_, face, profile) => {
  const u = hero({
      unitName: profile.name,
      type: "Postać Dramatu",
      dramaId: profile.name,
    }),
    p = setup([
      hero({ uniqueId: "leader", mentalIllnesses: [{ name: "Agorafobia" }] }),
      u,
      ...["Goblin", "Harpia", "Gorgona", "Kabuki", "Zombie", "Duch"].map(
        (name, i) =>
          hero({
            uniqueId: `s${i}`,
            unitName: name,
            type: "Stronnik",
            selectedNumber: 3,
            rules: name === "Duch" ? ["Leśny duch"] : [],
          }),
      ),
    ]);
  p.loot = 100;
  p.inventory = [
    "Krasnoludzki proch",
    "Piwo Bugmana",
    "Zwój Rozproszenia",
    "Kislevska wódka",
    "Eliksir witalności",
    "Gwiezdny pył",
  ].map((name, i) => ({ id: `i${i}`, name, quantity: 20 }));
  const answers = { feed: "Nie karm", wage: [face] };
  let plan;
  for (let i = 0; i < 40; i++) {
    plan = dramaWagePlan(u, answers, p);
    expect(plan.error).toBe("");
    if (plan.ready) break;
    const input = plan.inputs[plan.inputs.length - 1];
    answers[input.id] =
      input.type === "dice"
        ? Array(input.count).fill(1)
        : input.options[0].value;
  }
  expect(plan.ready).toBe(true);
  applyEffects(p, plan.effects, "Żołd", army);
  expect(p.loot).toBeGreaterThanOrEqual(0);
});
test("a debt-of-gratitude mercenary still owes the normal wage after the next game", () => {
  const p = setup();
  applyEffects(
    p,
    [
      {
        type: "recruit",
        name: "Gladiator",
        mercenary: true,
        freeNextBattle: true,
      },
    ],
    "Dług wdzięczności",
    army,
  );
  expect(p.units[1].campaignContract).toEqual({
    recruitmentWaived: true,
    source: "Dług wdzięczności",
  });
  expect(p.units[1].pay).toBeGreaterThan(0);
  expect(p.units[1].campaignContract.freeNextBattle).toBeUndefined();
});
test("serving an existing absence does not consume a new absence imposed during the same post-battle sequence", () => {
  const original = hero({
      campaignModelStatus: [{ skip: 1 }],
      battleAbsentModels: [true],
    }),
    battle = R.beginPostBattle(
      { ...R.newBattle([original]), gameName: "Test" },
      [original],
      {},
      army,
    ),
    p = battle.post;
  expect(p.units[0].campaignModelStatus[0].skip).toBe(0);
  p.units[0].campaignModelStatus[0].skip = 1;
  p.expApplied = true;
  expect(
    R.finalizePostBattle(battle, {}).units[0].campaignModelStatus[0].skip,
  ).toBe(1);
});
test("a hero with all table characteristics at racial maximum can increase speed instead of rerolling forever", () => {
  const u = hero();
  u.stats.Aktualna = [4, ...u.stats.Maksymalna.slice(1)];
  expect(R.allAdvancementStatsMaxed(u)).toBe(true);
  expect(R.availableStats(u, 6)).toEqual([0]);
});

test("Drama uses the printed initial prestige and adds earned PD and subsequently purchased equipment", () => {
  const u = hero({
    type: "Postać Dramatu",
    prestige: 35,
    exp: 12,
    startingEquipment: [],
    optionalEquipment: [],
  });
  expect(getPrestige([u])[0]).toBe(35);
  u.exp = 14;
  u.optionalEquipment = ["Miecz"];
  expect(getPrestige([u])[0]).toBe(38);
});
