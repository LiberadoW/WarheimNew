import React, { useState } from "react";
import { fireEvent, render, screen, within } from "@testing-library/react";
import ScenarioField from "./ScenarioField";
import BattleTracker from "./BattleTracker";
import * as R from "./rules";

test("a rulebook scenario sets the area of the skirmish", () => {
  let latest;
  function Harness() {
    const [battle, setBattle] = useState({ ...R.newBattle([]), area: "inside" });
    latest = battle;
    return <ScenarioField battle={battle} setBattle={setBattle} />;
  }
  render(<Harness />);
  fireEvent.click(screen.getByRole("tab", { name: "Wybierz z listy" }));
  const select = screen.getByLabelText("Scenariusz");
  const option = within(select).getAllByRole("option").find((o) => o.closest("optgroup")?.label === "Poza murami");
  fireEvent.change(select, { target: { value: option.value } });
  fireEvent.click(screen.getByRole("button", { name: "Ustaw scenariusz" }));
  expect(latest.area).toBe("outside");
  expect(latest.scenarioRecord).toMatchObject({ area: "outside", name: latest.scenario });
  expect(screen.getByRole("button", { name: "Zmień scenariusz" })).toBeTruthy();
});

test("a single model is a clear in-play / out-of-action toggle", () => {
  const hero = { uniqueId: "h", unitName: "Herszt", type: "Bohater", selectedNumber: 1, rules: [], exp: 20 };
  let units = [hero];
  const { rerender } = render(<BattleTracker units={units} setUnits={(u) => (units = u)} />);
  const group = screen.getByRole("group", { name: "Wyłączeni z akcji: Herszt" });
  fireEvent.click(within(group).getByRole("button", { name: /W grze/ }));
  expect(units[0].battleOutOfActionModels).toEqual([true]);
  rerender(<BattleTracker units={units} setUnits={(u) => (units = u)} />);
  expect(within(group).getByRole("button", { name: /WzA/ }).getAttribute("aria-pressed")).toBe("true");
});
