import armies from "../Data.js/Armies";
import { createUnit } from "../Functions/createUnit";
import * as R from "./rules";
import { applyPlague, hadPlague, plagueTasks, undoPlague } from "./plague";
import { explorationRules } from "./company";

const h = armies["Łowcy czarownic"].heroes;
const unit = (name, extra = {}) => ({ ...createUnit(h, name), ...extra });
const post = (units) => ({ units, journal: [], injuries: {}, plague: {} });
const battle = { events: [{ code: 61, area: "inside", name: "Zaraza" }] };

test("the plague is found in a campaign game's events or the play-mode log", () => {
  expect(hadPlague(battle)).toBe(true);
  expect(hadPlague({ events: [{ code: 61, area: "outside" }] })).toBe(false);
  expect(hadPlague({ log: [{ text: "Zdarzenie losowe (61): Zaraza" }] })).toBe(true);
  expect(hadPlague({ randomEvents: 1 })).toBe(false);
});

test("models on the table test WT; absent, dead and immune models do not", () => {
  const p = post([
    unit("Łowca czarownic", { uniqueId: "l" }),
    unit("Zelota", { uniqueId: "z", selectedNumber: 2, battleAbsentModels: [false, true] }),
    unit("Łowca czarownic", { uniqueId: "dead", campaignModelStatus: [{ dead: true }] }),
    unit("Łowca czarownic", { uniqueId: "undead", rules: ["Nieumarły"] }),
  ]);
  expect(plagueTasks(p, battle).map((t) => t.key)).toEqual(["l:0", "z:0"]);
  expect(plagueTasks(p, {})).toEqual([]);
});

test("a failed WT test rolls the effect: 1 dead, 2–5 misses a game, 6 recovers", () => {
  const units = ["a", "b", "c", "d"].map((id) => unit("Łowca czarownic", { uniqueId: id }));
  const p = post(units);
  const [a, b, c, d] = plagueTasks(p, battle);
  applyPlague(p, a, { test: [2] }); // WT 3: passed
  applyPlague(p, b, { test: [6], effect: [1] });
  applyPlague(p, c, { test: [4], effect: [3] });
  applyPlague(p, d, { test: [5], effect: [6] });
  expect(units.map((u) => u.campaignModelStatus?.[0] || {})).toEqual([{}, { dead: true }, { skip: 1 }, {}]);
  expect(p.plague["a:0"].result).toBe("passed");
  expect(p.plague["d:0"].result).toBe("recovered");
  expect(() => applyPlague(p, a, { test: [1] })).toThrow(/już rozstrzygnięto/);
  expect(() => applyPlague(post([unit("Łowca czarownic", { uniqueId: "x" })]), { ...a, unitId: "x", key: "x:0" }, { test: [6] })).toThrow(/skutki zarazy/);
  undoPlague(p, b);
  expect(units[1].campaignModelStatus[0]).toEqual({});
  expect(p.plague["b:0"]).toBeUndefined();
  expect(p.journal.some((e) => /Zaraza: Łowca czarownic umiera/.test(e.text))).toBe(true);
});


test("a hero laid up by the plague still explores and trades; a dead one does not", () => {
  const units = ["a", "b"].map((id) => unit("Łowca czarownic", { uniqueId: id, battleAbsentModels: [false], battleOutOfActionModels: [false] }));
  const p = post(units);
  const [a, b] = plagueTasks(p, battle);
  applyPlague(p, a, { test: [6], effect: [1] });
  applyPlague(p, b, { test: [6], effect: [3] });
  expect(units[0].campaignModelStatus[0].dead).toBe(true);
  expect(units[1].campaignModelStatus[0].skip).toBe(1);
  expect(R.availabilityHeroes(p).map((u) => u.uniqueId)).toEqual(["b"]);
  expect(explorationRules({ result: "loss" }, p).heroes.map((u) => u.uniqueId)).toEqual(["b"]);
});

test("a hero killed by the plague leaves an availability pool drawn up already", () => {
  const units = ["a", "b"].map((id) => unit("Łowca czarownic", { uniqueId: id, battleAbsentModels: [false], battleOutOfActionModels: [false] }));
  const p = post(units);
  R.createAvailabilityPool(p);
  expect(p.availability.map((t) => t.unitId)).toEqual(["a", "b"]);
  const [a] = plagueTasks(p, battle);
  applyPlague(p, a, { test: [6], effect: [1] });
  expect(p.availability.map((t) => t.unitId)).toEqual(["b"]);
  undoPlague(p, a);
  expect(p.availability.map((t) => t.unitId).sort()).toEqual(["a", "b"]);
});
