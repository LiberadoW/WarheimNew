import { encounterPlan } from "./encounters";
import { applyEffects } from "./effects";
import * as R from "./rules";
const hero = (id = "h") => ({
  uniqueId: id,
  unitName: "Herszt gangu",
  type: "Bohater",
  selectedNumber: 1,
  number: 1,
  cost: 55,
  totalCost: 55,
  exp: 20,
  skills: [0, 1, 2, 3, 4],
  rules: ["Dowódca", "Mag"],
  equipmentList: { Miecz: [10, 0], Sztylet: [2, 0], Łuk: [10, 1] },
  startingEquipment: ["Sztylet", "Miecz", "Łuk"],
  optionalEquipment: [],
  stats: {
    Początkowa: [4, 4, 4, 4, 4, 2, 4, 2, 8],
    Maksymalna: [5, 6, 6, 5, 5, 3, 6, 4, 9],
  },
  battleAbsentModels: [false],
  battleOutOfActionModels: [false],
});
const army = {
  name: "Gang przemytników",
  nature: "Neutralna",
  maxModels: 15,
  mercenaries: ["Gladiator"],
  heroes: {},
};
const setup = () =>
  R.beginPostBattle(R.newBattle([hero()]), [hero()], { skarbiec: 1000 }, army)
    .post;
function fill(event, post, initial = {}) {
  const answers = { ...initial };
  for (let n = 0; n < 100; n++) {
    const plan = encounterPlan(event, answers, post, army);
    if (plan.error) throw Error(plan.error);
    if (plan.ready) return { answers, plan };
    const input = plan.inputs[plan.inputs.length - 1];
    if (input.type === "dice") answers[input.id] = Array(input.count).fill(2);
    else if (input.type === "allocation")
      answers[input.id] = { [input.options[0].value]: input.total };
    else answers[input.id] = input.options[0].value;
  }
  throw Error("Niekończące się zdarzenie");
}
test.each(
  R.exploration.map((event) => [
    `${event.area}:${event.key} ${event.name}`,
    event,
  ]),
)("%s has a complete resolvable recipe", (_, event) => {
  const p = setup();
  const { plan } = fill(event, p);
  expect(plan.ready).toBe(true);
  applyEffects(p, plan.effects, event.name, army);
  expect(p.treasury).toBeGreaterThanOrEqual(0);
  expect(p.loot).toBeGreaterThanOrEqual(0);
});
test("well success grants loot and experience; failure records a missed game", () => {
  const event = R.exploration.find(
      (e) => e.area === "inside" && e.key === "11",
    ),
    p = setup();
  let plan = encounterPlan(event, { wellHero: "h", wellTest: [2] }, p, army);
  expect(plan.effects).toContainEqual({ type: "loot", amount: 1 });
  expect(plan.effects).toContainEqual({ type: "xp", amount: 1, unitId: "h" });
  plan = encounterPlan(event, { wellHero: "h", wellTest: [6] }, p, army);
  expect(plan.effects).toContainEqual({ type: "skip", unitId: "h", games: 1 });
});
test("orphan reward with natural double six generates extra loot roll", () => {
  const event = R.exploration.find(
      (e) => e.area === "outside" && e.key === "33",
    ),
    p = setup();
  const { plan } = fill(event, p, { captives: "Pomóż", reward: [6, 6] });
  expect(plan.effects.some((e) => e.type === "loot")).toBe(true);
});
test("late encounter experience schedules new advances after normal PD was already applied", () => {
  const event = R.exploration.find(
      (e) => e.area === "inside" && e.key === "11",
    ),
    p = setup();
  p.units[0].exp = 23;
  p.expApplied = true;
  const { plan } = fill(event, p);
  applyEffects(p, plan.effects, "Studnia", army);
  expect(p.units[0].exp).toBe(24);
  expect(p.advances[0].threshold).toBe(24);
});

// Gospoda (s. 420): the leader's CP test is 2K6, passed at or below CP.
test.each([
  [[6, 2], true],
  [[6, 3], false],
])("the tavern CP test rolls 2K6 against CP 8: %p passes = %p", (roll, passes) => {
  const post = setup();
  const event = R.exploration.find((e) => e.key === "111" && e.area === "inside");
  const plan = encounterPlan(event, { leader: "h", innCP: roll, innGold: [1, 1, 1, 1] }, post, army);
  const input = plan.inputs.find((i) => i.id === "innCP");
  expect(input.count).toBe(2);
  expect(plan.ready).toBe(true);
  expect(plan.effects.some((e) => e.type === "gold")).toBe(passes);
  expect(plan.effects.some((e) => e.key === "drunken")).toBe(!passes);
});
