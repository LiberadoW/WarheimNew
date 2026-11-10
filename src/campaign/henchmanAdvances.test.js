import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import * as R from "./rules";
import UnitEditStats from "../Components/UnitEdit/unitEditStats";

// Rozdział 13, s. 414: grupa stronników nie może dwa razy otrzymać tego samego
// rozwinięcia charakterystyki.
const group = (extra = {}) => ({
  uniqueId: "g",
  unitName: "Cyrkowiec",
  type: "Stronnik",
  selectedNumber: 3,
  rules: [],
  stats: {
    Początkowa: [4, 3, 3, 3, 3, 1, 3, 1, 7],
    Maksymalna: [5, 6, 6, 4, 4, 3, 6, 4, 9],
  },
  ...extra,
});

describe("henchman groups never repeat a characteristic advance", () => {
  test("rosters without a record treat raised stats as already advanced", () => {
    const legacy = group({
      stats: { ...group().stats, Aktualna: [4, 4, 3, 3, 3, 1, 3, 1, 7] },
    });
    expect(R.takenAdvances(legacy)).toEqual([1]);
    // Roll 6–7: WW lub US. WW was raised before the campaign record existed.
    expect(R.availableStats(legacy, 7)).toEqual([2]);
  });

  test("a stat lowered by an injury is not an advance", () => {
    const hurt = group({
      stats: { ...group().stats, Aktualna: [4, 3, 3, 3, 2, 1, 3, 1, 7] },
    });
    expect(R.takenAdvances(hurt)).toEqual([]);
  });

  test("the record wins over stats, so a mutation's +1 does not block an advance", () => {
    const mutated = group({
      campaignAdvancements: [],
      stats: { ...group().stats, Aktualna: [4, 4, 3, 3, 3, 1, 3, 1, 7] },
    });
    expect(R.availableStats(mutated, 7)).toEqual([1, 2]);
  });

  test("both options taken leaves nothing to pick (the player rerolls)", () => {
    expect(R.availableStats(group({ campaignAdvancements: [1, 2] }), 6)).toEqual([]);
  });

  test("heroes may advance the same stat again", () => {
    const hero = group({ type: "Bohater", selectedNumber: 1, campaignAdvancements: [1] });
    expect(R.availableStats(hero, 7)).toEqual([1, 2]);
  });

  test("raising a group's stat by hand in edit mode records the advance", () => {
    const unit = group();
    const list = [unit];
    const setUnitList = jest.fn();
    const { rerender } = render(<UnitEditStats unitList={list} unit={unit} setUnitList={setUnitList} />);
    fireEvent.click(screen.getByRole("button", { name: "WW +1" }));
    expect(unit.campaignAdvancements).toEqual([1]);
    expect(R.availableStats(unit, 7)).toEqual([2]);
    rerender(<UnitEditStats unitList={list} unit={unit} setUnitList={setUnitList} />);
    fireEvent.click(screen.getByRole("button", { name: "WW −1" }));
    expect(unit.campaignAdvancements).toEqual([]);
  });
});
