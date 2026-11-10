import * as R from "./rules";

// Firestore rejects an array stored directly inside another array
// ("Nested arrays are not supported"), so a finished battle must not hold any.
const nestedArrays = (v, path = "", out = []) => {
  if (Array.isArray(v))
    v.forEach((x, i) => {
      if (Array.isArray(x)) out.push(`${path}[${i}]`);
      nestedArrays(x, `${path}[${i}]`, out);
    });
  else if (v && typeof v === "object")
    Object.entries(v).forEach(([k, x]) => nestedArrays(x, `${path}.${k}`, out));
  return out;
};
const group = {
  uniqueId: "g",
  unitName: "Hobgoblin",
  type: "Stronnik",
  selectedNumber: 2,
  number: 15,
  cost: 20,
  totalCost: 40,
  exp: 2,
  rules: [],
  equipmentList: { Włócznia: [10, 0] },
  startingEquipment: [],
  optionalEquipment: [],
  customEquipment: [],
  stats: { Początkowa: [4, 3, 3, 3, 3, 1, 3, 1, 6], Maksymalna: [5, 6, 6, 4, 4, 3, 6, 4, 9] },
  battleAbsentModels: [false, false],
  battleOutOfActionModels: [false, false],
};

test("a purchase with per-item tax rolls (Podatek) is logged as text", () => {
  const battle = R.beginPostBattle({ ...R.newBattle([group]), gameName: "Test" }, [group], {}, { name: "Krasnoludy Chaosu" });
  const p = battle.post;
  p.treasury = 100;
  p.armyRules = ["Podatek"];
  const item = { id: "wlocznia", name: "Włócznia", category: "Oręż — walka wręcz", availability: 0, price: "10 zk" };
  R.buyItem(p, "g", item, { id: "q", itemId: "wlocznia", price: 12, unitPrices: [12, 13], quantity: 2, taxRolls: [[2], [3]], basePrice: 10, used: false }, "Krasnoludy Chaosu");
  expect(p.journal.at(-1).taxRolls).toEqual(["2", "3"]);
});

test("the finished battle is flattened for Firestore, also for journals of older drafts", () => {
  const battle = R.beginPostBattle({ ...R.newBattle([group]), gameName: "Test" }, [group], {}, { name: "Krasnoludy Chaosu" });
  battle.post.expApplied = true;
  battle.post.journal.push({ id: "old", type: "purchase", text: "Włócznia ×2", taxRolls: [[3, 4], [2, 5]] });
  const done = R.finalizePostBattle(battle, {});
  expect(nestedArrays(done)).toEqual([]);
  expect(done.entry.journal.find((j) => j.id === "old").taxRolls).toEqual(["3+4", "2+5"]);
  expect(done.units[0].stats.Początkowa).toEqual(group.stats.Początkowa);
});
