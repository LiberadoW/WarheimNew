import "@testing-library/jest-dom";
import React, { useState } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import UnitSelect from "../layouts/UnitSelect";
import PrintPreview from "./PrintPreview";
import ArmySelect from "./ArmySelect";
import armies from "../Data.js/Armies";

jest.mock("../layouts/Builder", () => ({
  CommandContext: require("react").createContext({ setStandardBearer: () => {}, setMusician: () => {} }),
}));

test("searching recruitment options cannot re-enable an exclusive choice", () => {
  const army = armies["Cyrkowcy z Ligii Ostermarku"];
  const Harness = () => {
    const [unitName, setUnitName] = useState("");
    const [unitList, setUnitList] = useState([{ unitName: "Kapłan Ranalda", selectedNumber: 1 }]);
    return <UnitSelect heroes={army.heroes} armyName={army.name} {...{ unitName, setUnitName, unitList, setUnitList }} />;
  };
  render(<Harness />);
  fireEvent.change(screen.getByLabelText("Znajdź postać"), { target: { value: "magister" } });
  expect(screen.getByRole("option", { name: /Magister Magii/ })).toBeDisabled();
  fireEvent.change(screen.getByLabelText("Znajdź postać"), { target: { value: "kaplan" } });
  expect(screen.getByRole("option", { name: /Kapłan Ranalda/ })).toBeDisabled();
  expect(screen.getByRole("button", { name: "Dodaj" })).toBeDisabled();
});

test("an empty search result is explained without losing the chosen profile", () => {
  const army = armies["Cyrkowcy z Ligii Ostermarku"];
  const Harness = () => {
    const [unitName, setUnitName] = useState("");
    return <UnitSelect heroes={army.heroes} armyName={army.name} {...{unitName, setUnitName}} unitList={[]} setUnitList={() => {}} />;
  };
  render(<Harness />);
  fireEvent.change(screen.getByLabelText("Znajdź postać"), { target: { value: "zzzz" } });
  expect(screen.getByRole("status")).toHaveTextContent("Brak postaci");
  fireEvent.change(screen.getByLabelText("Znajdź postać"), { target: { value: "" } });
  fireEvent.change(screen.getByRole("combobox"), { target: { value: "Mecenas" } });
  fireEvent.change(screen.getByLabelText("Znajdź postać"), { target: { value: "zzzz" } });
  expect(screen.getByRole("combobox")).toHaveValue("Mecenas");
  expect(screen.getByRole("button", { name: "Dodaj" })).toBeEnabled();
});

test("print preview contains keyboard focus and restores it on close", () => {
  const Harness = () => {
    const [open, setOpen] = useState(false);
    return <><button onClick={() => setOpen(true)}>Podgląd</button><PrintPreview open={open} onClose={() => setOpen(false)}><div id="armylist">Karta</div></PrintPreview></>;
  };
  render(<Harness />);
  const trigger = screen.getByRole("button", { name: "Podgląd" });
  trigger.focus(); fireEvent.click(trigger);
  const close = screen.getByRole("button", { name: "Wróć do kompanii" });
  expect(close).toHaveFocus();
  fireEvent.keyDown(close, { key: "Tab" });
  expect(close).toHaveFocus();
  fireEvent.keyDown(close, { key: "Escape" });
  expect(screen.queryByRole("dialog")).toBeNull();
  expect(trigger).toHaveFocus();
  expect(document.getElementById("armylist")).toHaveTextContent("Karta");
});

test("canceling a faction change preserves a populated roster", () => {
  const confirm = jest.spyOn(window, "confirm").mockReturnValue(false);
  const setArmy = jest.fn(); const setUnitList = jest.fn();
  render(<ArmySelect army={armies["Cyrkowcy z Ligii Ostermarku"]} unitList={[{ unitName: "Mecenas" }]} {...{ setArmy, setUnitList }} />);
  fireEvent.change(screen.getByLabelText("Banda"), { target: { value: "Gang przemytników" } });
  expect(confirm).toHaveBeenCalledTimes(1);
  expect(setArmy).not.toHaveBeenCalled(); expect(setUnitList).not.toHaveBeenCalled();
  confirm.mockRestore();
});
