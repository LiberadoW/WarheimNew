import React from "react";
import { fireEvent, render, screen, within } from "@testing-library/react";
import UnitDetails from "./UnitDetails";
import { CommandContext } from "../layouts/Builder";
import { getRuleText } from "../Functions/getRuleText";

jest.mock("../layouts/Builder", () => ({
  CommandContext: require("react").createContext({}),
}));

const renderDetails = () => {
  const unit = {
    unitName: "Wojownik", unitDisplayName: "Wojownik", type: "Stronnik",
    rules: ["Strach"], skills: [],
    stats: { Początkowa: [4, 3, 3, 3, 3, 1, 3, 1, 7] },
    startingEquipment: ["Miecz"], optionalEquipment: [],
    equipmentList: { Miecz: [10, 0], Kusza: [25, 1] },
    cost: 30, totalCost: 30, selectedNumber: 1,
  };
  const setUnitList = jest.fn();
  render(
    <CommandContext.Provider value={{}}>
      <UnitDetails unit={unit} unitIndex={0} unitList={[unit]}
        setUnitList={setUnitList} heroes={{ Wojownik: { cost: 30 } }} army={{}} />
    </CommandContext.Provider>
  );
  return setUnitList;
};

test("unit rules exclude equipment rules", () => {
  renderDetails();
  fireEvent.click(screen.getByRole("button", { name: /Opisy zasad/ }));
  const dialog = within(screen.getByRole("dialog"));
  expect(dialog.getByText((_, element) => element.tagName === "P" && element.textContent === getRuleText("Strach"))).toBeTruthy();
  expect(dialog.queryByText("Zasady ekwipunku")).toBeNull();
  expect(dialog.queryByText("Parowanie")).toBeNull();
});

test("clicking a weapon opens its profile and full rules without changing equipment", () => {
  const setUnitList = renderDetails();
  expect(screen.queryByText("Zasięg")).toBeNull();
  const opener = screen.getByRole("button", { name: "Pokaż statystyki i zasady: Miecz" });
  opener.focus();
  fireEvent.click(opener);
  const modal = screen.getByRole("dialog");
  const dialog = within(modal);
  expect(dialog.getByText("Walka wręcz")).toBeTruthy();
  expect(dialog.getByText("Użytkownika")).toBeTruthy();
  expect(dialog.getByText((_, element) => element.tagName === "P" && element.textContent === getRuleText("Parowanie"))).toBeTruthy();
  expect(dialog.queryByText("Strach")).toBeNull();
  expect(setUnitList).not.toHaveBeenCalled();
  fireEvent.keyDown(document, { key: "Escape" });
  expect(screen.queryByRole("dialog")).toBeNull();
  expect(document.activeElement).toBe(opener);
});
