import armies from "../Data.js/Armies";
import { withChaosMark, remarkUnits, needsChaosMark } from "./chaosMark";
import { createUnit } from "./createUnit";
import { companyGod, pendingStigmata } from "../Components/StigmataPanel";
import { applyMutation } from "../campaign/sanity";
import * as R from "../campaign/rules";

const carnival = armies["Karnawał Chaosu"];
const raiders = armies["Grasanci Chaosu"];

test("only companies with an unspecified mark choose one", () => {
  expect(needsChaosMark(raiders)).toBe(true);
  expect(needsChaosMark(armies["Kult Karmazynowej Czaszki"])).toBe(false);
  expect(withChaosMark(armies["Kult Karmazynowej Czaszki"], "nurgle")).toBe(armies["Kult Karmazynowej Czaszki"]);
});

test("the mark sets the spell lore, Khorne turns the mage into a Demonolog", () => {
  const nurgle = withChaosMark(raiders, "nurgle");
  expect(nurgle.heroes["Czarnoksiężnik Chaosu"].rules).toContain("Mag (Dziedzina Nurgla)");
  expect(nurgle.armyRules).toContain("Znak Chaosu (Potworny Lud Nurgla)");
  const khorne = withChaosMark(raiders, "khorne");
  expect(khorne.heroes["Czarnoksiężnik Chaosu"].rules).toContain("Demonolog");
  expect(khorne.heroes["Czarnoksiężnik Chaosu"].rules.some((r) => r.startsWith("Mag ("))).toBe(false);
  const beastmen = withChaosMark(armies["Zbrojne stado Zwierzoludzi"], "tzeentch");
  expect(beastmen.heroes["Szaman zwierzoludzi"].rules).toContain("Mag (Dziedzina Tzeentcha albo Dziedzina Dziczy)");
});

test("Karnawał offers only the demon of its Dark Power, and none before the choice", () => {
  const unmarked = withChaosMark(carnival, undefined);
  expect(unmarked.chaosMark).toBeNull();
  expect(unmarked.heroes["Nurgling"].retired).toBe(true);
  const slaanesh = withChaosMark(carnival, "slaanesh");
  expect(slaanesh.heroes["Bólożądna pieszczota"].retired).toBeUndefined();
  expect(slaanesh.heroes["Piekielny ogar"].retired).toBe(true);
});

test("changing the mark re-marks recruited casters and keeps learned rules", () => {
  const nurgle = withChaosMark(raiders, "nurgle");
  const mage = { ...createUnit(nurgle.heroes, "Czarnoksiężnik Chaosu") };
  mage.rules = [...mage.rules, "Szybki"];
  const [after] = remarkUnits([mage], raiders, "tzeentch");
  expect(after.rules).toContain("Mag (Dziedzina Tzeentcha)");
  expect(after.rules).not.toContain("Mag (Dziedzina Nurgla)");
  expect(after.rules).toContain("Szybki");
});

test("stigmata are rolled once per Stygmat Chaosu, from the company's god table", () => {
  expect(companyGod(raiders, "slaanesh")).toBe("Slaanesh");
  expect(companyGod(armies["Kult Karmazynowej Czaszki"])).toBe("Khorne");
  const unit = createUnit(withChaosMark(raiders, "nurgle").heroes, "Wybraniec Chaosu");
  expect(pendingStigmata(unit)).toBe(1);
  const draft = { units: [unit], journal: [], injuries: {}, inventory: [] };
  applyMutation(draft, unit.uniqueId, "Nurgle", [3, 3], { reason: "Stygmat Chaosu (rekrutacja)" });
  expect(pendingStigmata(draft.units[0])).toBe(0);
  expect(draft.units[0].rules.some((r) => R.baseName(r) === "stygmat chaosu" && r.includes("("))).toBe(true);
});
