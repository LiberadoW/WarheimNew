import * as R from "./rules";
const hero = (extra = {}) => ({
  uniqueId: "hero",
  unitName: "Herszt",
  unitDisplayName: "",
  type: "Bohater",
  selectedNumber: 1,
  number: 1,
  cost: 55,
  totalCost: 55,
  exp: 20,
  skills: [0, 1, 2, 3, 4, 5],
  rules: ["Dowódca"],
  startingEquipment: ["Sztylet"],
  optionalEquipment: [],
  equipmentList: { Sztylet: [2, 0], Miecz: [10, 0], Lekki: [5, 2, "Zbroja"] },
  stats: {
    Początkowa: [4, 4, 4, 3, 3, 2, 4, 1, 8],
    Maksymalna: [5, 6, 6, 4, 4, 3, 6, 4, 9],
  },
  battleOutOfActionModels: [false],
  battleAbsentModels: [false],
  ...extra,
});
const begin = (units, notes = {}) =>
  R.beginPostBattle({ ...R.newBattle(units), gameName: "Test" }, units, notes);
const item = (name) => R.catalog.find((x) => x.name === name);

test("all 36 K66 results map to exactly one serious injury", () => {
  for (let a = 1; a <= 6; a++)
    for (let b = 1; b <= 6; b++)
      expect(R.injuryResult(hero(), [a, b]).name).toBeTruthy();
});
test.each([
  ["Bohater", [], [1, 1], 11],
  ["Stronnik", [], [2], 11],
  ["Stronnik", [], [3], 41],
  ["Bohater", ["Nieumarły"], [2], 35],
  ["Bohater", ["Demon"], [3], 35],
  ["Stronnik", ["Wielkolud"], [3], 35],
  ["Bohater", ["Chowaniec & cherubin"], [2], 41],
])("injury table follows type %s and rules %s", (type, rules, dice, code) =>
  expect(R.injuryResult(hero({ type, rules }), dice).code).toBe(code),
);
test("out of action is temporary: a recovered hero remains in the army", () => {
  const u = hero({ battleOutOfActionModels: [true] });
  const b = begin([u]);
  R.applyInjury(b.post, R.injuryTasks(b.post)[0], R.injuryResult(u, [4, 1]));
  R.applyExperience(b.post);
  const result = R.finalizePostBattle(b, {});
  expect(result.units).toHaveLength(1);
  expect(result.units[0].exp).toBe(21);
  expect(u.exp).toBe(20);
  expect(u.battleOutOfActionModels).toEqual([true]);
});
test("dead henchmen are removed individually and equipment moves to storage", () => {
  const u = hero({
    type: "Stronnik",
    exp: 0,
    selectedNumber: 3,
    battleOutOfActionModels: [true, true, false],
    battleAbsentModels: [false, false, false],
  });
  const b = begin([u]);
  const tasks = R.injuryTasks(b.post);
  R.applyInjury(b.post, tasks[0], R.injuryResult(u, [1]));
  R.applyInjury(b.post, tasks[1], R.injuryResult(u, [3]));
  R.applyExperience(b.post);
  const r = R.finalizePostBattle(b, {});
  expect(r.units[0].selectedNumber).toBe(2);
  expect(r.units[0].exp).toBe(1);
  expect(r.notes.campaign.inventory.map((i) => i.name)).toEqual(["Sztylet"]);
});
test("wounded model cannot be forgotten after its skip status changes", () => {
  const u = hero({ battleOutOfActionModels: [true] });
  const b = begin([u]);
  const task = R.injuryTasks(b.post)[0];
  R.applyInjury(b.post, task, R.injuryResult(u, [3, 5]), { secondary: [3] });
  expect(R.injuryTasks(b.post)).toHaveLength(1);
  expect(b.post.units[0].campaignModelStatus[0].skip).toBe(2);
  expect(() =>
    R.applyInjury(b.post, task, R.injuryResult(u, [4, 1])),
  ).toThrow();
});
test("multiple injuries use the dedicated subtable and all follow-up effects", () => {
  const u = hero({ battleOutOfActionModels: [true] });
  const b = begin([u]);
  R.applyInjury(b.post, R.injuryTasks(b.post)[0], R.injuryResult(u, [1, 6]), {
    secondary: [3],
    children: [{ dice: [3, 2] }, { dice: [5, 1] }],
  });
  expect(R.currentStats(b.post.units[0])[4]).toBe(2);
  expect(R.currentStats(b.post.units[0])[1]).toBe(3);
});
test("surviving hero gets survival, kills and scenario PD once; absent hero gets none", () => {
  const b = begin([
    hero({ battleKills: 2, battleExp: 1 }),
    hero({ uniqueId: "absent", battleAbsentModels: [true] }),
  ]);
  R.applyExperience(b.post);
  expect(b.post.units.map((u) => u.exp)).toEqual([24, 20]);
  expect(b.post.advances.map((a) => a.threshold)).toEqual([24]);
  expect(() => R.applyExperience(b.post)).toThrow();
});
test("undead heroes earn PD unless they are Unaware", () => {
  expect(R.canEarnExperience(hero({ rules: ["Nieumarły"] }))).toBe(true);
  expect(R.canEarnExperience(hero({ rules: ["Nieświadomy"] }))).toBe(false);
});
test("starting PD does not award advances retroactively", () =>
  expect(R.crossed(20, 21, hero())).toEqual([]));
test("the greatest repeat wins, with higher face breaking ties", () => {
  expect(R.repeats([1, 1, 1, 6, 6, 2])[0].key).toBe("111");
  expect(R.repeats([1, 1, 3, 3, 6, 6])[0].key).toBe("66");
  expect(R.explorationResult([3, 3, 3, 3, 3, 3], "inside").best.name).toBe(
    "Krasnoludzki kowal",
  );
});
test.each([
  [[], 0],
  [[5], 1],
  [[6], 2],
  [[6, 6], 3],
  [[6, 6, 6], 4],
  [[6, 6, 6, 6, 1], 5],
  [[6, 6, 6, 6, 6, 1], 6],
  [[6, 6, 6, 6, 6, 6], 7],
])("exploration loot for %s", (dice, n) =>
  expect(R.explorationResult(dice, "inside").loot).toBe(n),
);
test("60 exploration entries cover both tables", () => {
  expect(R.exploration).toHaveLength(60);
  expect(new Set(R.exploration.map((x) => x.area + x.key)).size).toBe(60);
});
test("income applies supply level shifts to the table", () => {
  expect(R.income(1, 8, 2, 10)).toBe(40);
  expect(R.income(1, 8, 2, 9)).toBe(45);
  expect(R.income(1, 8, 2, 11)).toBe(35);
  expect(R.income(0, 8, 2, 10)).toBe(0);
});
test("price expressions support variable count and multiplier without eval", () => {
  expect(R.priceRoll("10+2K6", [2, 3]).price).toBe(15);
  expect(R.priceRoll("35+K6X5", [4]).price).toBe(55);
  expect(() => R.priceRoll("10+K6", [7])).toThrow();
  expect(() => R.priceRoll("1;alert(1)")).toThrow();
});
test("catalog prices are executable and source references are present", () => {
  expect(R.catalog).toHaveLength(505);
  for (const i of R.catalog) {
    const n = R.priceDiceCount(i.price);
    expect(R.priceRoll(i.price, Array(n).fill(1)).price).toBeGreaterThan(0);
    expect(i.page).toBeGreaterThanOrEqual(427);
  }
});
test("weapons are filtered by personal list, with Fechmistrz exception", () => {
  const u = hero();
  expect(
    R.equipmentPermission(u, item("Miecz"), "Gang przemytników"),
  ).toBeNull();
  expect(
    R.equipmentPermission(u, item("Halabarda"), "Gang przemytników"),
  ).toBeTruthy();
  R.addRule(u, "Fechmistrz");
  expect(
    R.equipmentPermission(u, item("Halabarda"), "Gang przemytników"),
  ).toBeNull();
  expect(
    R.equipmentPermission(u, item("Spaczhalabarda"), "Gang przemytników"),
  ).toBeTruthy();
});
test("buying variable-price rare equipment consumes one locked availability result", () => {
  const b = begin([hero()], { skarbiec: 100 });
  const i = item("Amulet");
  const t = { id: "token", total: 8, used: false, locked: true };
  b.post.availability = [t];
  const q = { itemId: i.id, price: 5, basePrice: 1, tokenId: "token" };
  R.buyItem(b.post, "hero", i, q, "Gang przemytników");
  expect(b.post.treasury).toBe(95);
  expect(t.used).toBe(true);
  expect(q.used).toBe(true);
  expect(() => R.buyItem(b.post, "hero", i, q, "Gang przemytników")).toThrow();
});
test("newly recruited heroes cannot buy rare equipment directly this sequence", () => {
  const b = begin([hero({ campaignNewRecruit: true })], { skarbiec: 100 });
  expect(() =>
    R.buyItem(b.post, "hero", item("Amulet"), {}, "Gang przemytników"),
  ).toThrow(/rekrut/);
});
test("maximum stats and henchman duplicate advances are blocked", () => {
  const u = hero({
    stats: {
      Początkowa: [4, 6, 6, 3, 3, 2, 4, 1, 8],
      Maksymalna: [5, 6, 6, 4, 4, 3, 6, 4, 9],
    },
  });
  expect(R.availableStats(u, 7)).toEqual([]);
  expect(() => R.changeStat(u, 1, 1)).toThrow();
  const h = hero({ type: "Stronnik", campaignAdvancements: [1] });
  expect(R.availableStats(h, 7)).toEqual([2]);
});
test("finalization is idempotent by battle id and blocks unfinished advances", () => {
  const b = begin([hero()]);
  R.applyExperience(b.post);
  const r = R.finalizePostBattle(b, {});
  expect(() => R.finalizePostBattle(b, r.notes)).toThrow(/zapisana/);
  b.post.advances.push({ resolved: false });
  expect(() => R.finalizePostBattle(b, {})).toThrow(/awanse/);
});

test("stored armour equips a real armour entry and can be returned to storage", () => {
  const u = hero();
  const b = begin([u]);
  const armour = item("Lekki pancerz");
  R.storeItem(b.post, armour.name, 1, { catalogId: armour.id, basePrice: 5 });
  R.equipStoredItem(
    b.post,
    "hero",
    b.post.inventory[0].id,
    "Gang przemytników",
  );
  expect(b.post.units[0].optionalEquipment).toContain("Lekki");
  expect(b.post.inventory).toHaveLength(0);
  R.unequipItem(b.post, "hero", "optionalEquipment", 0);
  expect(b.post.units[0].optionalEquipment).toHaveLength(0);
  expect(b.post.inventory[0].quantity).toBe(1);
});
test("identical items from casualties combine so a whole group can use them", () => {
  const b = begin([hero()]);
  R.storeItem(b.post, "Miecz");
  R.storeItem(b.post, "Miecz");
  expect(b.post.inventory).toHaveLength(1);
  expect(b.post.inventory[0].quantity).toBe(2);
});
test("group rare equipment requires separate availability results per copy", () => {
  const b = begin([hero({ selectedNumber: 2 })], { skarbiec: 100 });
  const i = item("Amulet");
  b.post.availability = [{ id: "t", total: 8, locked: true }];
  expect(() =>
    R.buyItem(
      b.post,
      "hero",
      i,
      { itemId: i.id, price: 5, basePrice: 1, tokenId: "t" },
      "Gang przemytników",
    ),
  ).toThrow(/pojedynczo/);
});

test.each(["Zwierzę", "Nieświadomy"])("%s cannot gain battle or exploration experience or produce an advance", (rule) => {
  const u = hero({ type: "Stronnik", exp: 0, rules: [rule], battleExp: 9, battleKills: 5 });
  const b = begin([u]);
  R.applyExperience(b.post);
  R.grantExperience(b.post, b.post.units[0], 5, "nagroda eksploracji");
  expect(b.post.units[0].exp).toBe(0);
  expect(b.post.advances).toHaveLength(0);
});
