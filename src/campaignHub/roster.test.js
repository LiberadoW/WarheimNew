import armies from "../Data.js/Armies";
import { createUnit } from "../Functions/createUnit";
import { groupRoster } from "./roster";

const h = armies["Łowcy czarownic"].heroes;
const unit = (name, id) => ({ ...createUnit(h, name), uniqueId: id });

test("the leader heads the heroes, the rest keep their order", () => {
  const list = [unit("Łowca czarownic", "l1"), unit("Prezbiter Sigmara", "p"), unit("Inkwizytor", "i"), unit("Łowca czarownic", "l2"), unit("Zelota", "z")];
  const groups = groupRoster(list);
  expect(groups[0].units.map((u) => u.id)).toEqual(["i", "l1", "p", "l2"]);
  expect(groups[1].units.map((u) => u.id)).toEqual(["z"]);
});
