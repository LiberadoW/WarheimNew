import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import armies from "../Data.js/Armies";
import getErrors, { getErrorMessages } from "./getErrors";
import { formatErrorCount } from "../Components/ArmyInfo";
import HeaderMenu from "../Components/HeaderMenu";

const army = armies["Gang przemytników"];
const unit = (unitName, uniqueId) => ({
  ...army.heroes[unitName],
  unitName,
  uniqueId,
  optionalEquipment: [],
  equipmentList: { ...army.heroes[unitName].equipmentList },
  selectedNumber: 1,
});

describe("getErrorMessages", () => {
  test("the header count is the number of messages", () => {
    const list = [unit("Przemytnik", "a")];
    const messages = getErrorMessages(army, 900, 1, list, army.limit);
    expect(getErrors(army, 900, 1, list, army.limit)).toBe(messages.length);
    expect(messages.map(({ message }) => message)).toEqual(
      expect.arrayContaining([
        "Przekroczono liczbę złotych koron.",
        "Banda musi posiadać dowódcę.",
        "Banda musi składać się z przynajmniej 3 modeli.",
      ]),
    );
  });

  test("unit-specific messages point at the unit", () => {
    const list = [
      unit("Herszt gangu", "leader"),
      unit("Kapłan Ranalda", "ranald"),
      unit("Kapłan Mananna", "manann"),
    ];
    const choice = getErrorMessages(army, 100, 3, list, army.limit).find(({ message }) =>
      message.includes("tylko jedną z jednostek"),
    );
    expect(choice.uniqueId).toBe("manann");
  });

  test("a valid roster has no messages", () => {
    const list = [unit("Herszt gangu", "a"), unit("Przemytnik", "b"), unit("Przemytnik", "c")];
    expect(getErrorMessages(army, 95, 3, list, army.limit)).toEqual([]);
  });
});

test("Polish plural forms for the error count", () => {
  expect([1, 2, 4, 5, 12, 14, 21, 22, 25].map(formatErrorCount)).toEqual([
    "1 błąd",
    "2 błędy",
    "4 błędy",
    "5 błędów",
    "12 błędów",
    "14 błędów",
    "21 błędów",
    "22 błędy",
    "25 błędów",
  ]);
});

describe("HeaderMenu", () => {
  const renderMenu = () =>
    render(
      <div>
        <HeaderMenu label="PDF">
          <button type="button">Zapisz PDF</button>
        </HeaderMenu>
        <p>poza menu</p>
      </div>,
    );

  test("opens, moves focus inside and closes on Escape back to its button", () => {
    renderMenu();
    const trigger = screen.getByRole("button", { name: "PDF" });
    fireEvent.click(trigger);
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
    expect(document.activeElement.textContent).toBe("Zapisz PDF");

    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByText("Zapisz PDF")).toBeNull();
    expect(document.activeElement).toBe(trigger);
  });

  test("closes on an outside click", () => {
    renderMenu();
    fireEvent.click(screen.getByRole("button", { name: "PDF" }));
    fireEvent.mouseDown(screen.getByText("poza menu"));
    expect(screen.queryByText("Zapisz PDF")).toBeNull();
  });
});
