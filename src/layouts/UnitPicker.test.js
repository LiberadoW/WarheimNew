import React, { useState } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { gangPrzemytnikow as army } from "../Data.js/Armies/GangPrzemytnikow";
import UnitPicker from "./UnitPicker";

const renderPicker = () => {
  const result = { unitList: [], addedIds: [] };
  const Harness = () => {
    const [unitList, setUnitList] = useState([]);
    result.unitList = unitList;
    return (
      <UnitPicker
        army={army}
        unitList={unitList}
        setUnitList={setUnitList}
        onUnitAdded={(id) => result.addedIds.push(id)}
      />
    );
  };
  render(<Harness />);
  return result;
};

const getUnitButton = (name) =>
  screen.getByText(name, { selector: ".unit-picker-item-name, .unit-picker-item-name *" }).closest("button");

test("adds a unit and reports its id so its details can open", () => {
  const result = renderPicker();
  fireEvent.click(getUnitButton("Herszt gangu"));
  expect(result.unitList).toHaveLength(1);
  expect(result.unitList[0].unitName).toBe("Herszt gangu");
  expect(result.addedIds).toEqual([result.unitList[0].uniqueId]);
});

test("disables a unit once its limit is reached", () => {
  const result = renderPicker();
  fireEvent.click(getUnitButton("Herszt gangu"));
  expect(getUnitButton("Herszt gangu").disabled).toBe(true);
  fireEvent.click(getUnitButton("Herszt gangu"));
  expect(result.unitList).toHaveLength(1);
});

test("blocks the other half of an either/or choice", () => {
  renderPicker();
  fireEvent.click(getUnitButton("Kapłan Ranalda"));
  expect(getUnitButton("Kapłan Mananna").disabled).toBe(true);
  expect(screen.getByText("Wyklucza: Kapłan Ranalda")).not.toBeNull();
  expect(getUnitButton("Przemytnik").disabled).toBe(false);
});

test("filters units by search text", () => {
  renderPicker();
  fireEvent.change(screen.getByPlaceholderText("Szukaj jednostki..."), {
    target: { value: "kapłan" },
  });
  expect(screen.queryByText("Herszt gangu")).toBeNull();
  expect(getUnitButton("Kapłan Mananna")).not.toBeNull();
});
