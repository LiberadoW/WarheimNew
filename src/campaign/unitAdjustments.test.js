import React, { useState } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import UnitAdjustments from "./UnitAdjustments";
import * as R from "./rules";

const group = (extra = {}) => ({
  uniqueId: "z", unitName: "Zelota", type: "Stronnik", number: 99, selectedNumber: 3, cost: 25, totalCost: 75, exp: 1,
  rules: [], startingEquipment: ["Sztylet"], optionalEquipment: [], equipmentList: {},
  campaignModelStatus: [{}, { skip: 1 }, {}], battleAbsentModels: [false, false, false], battleOutOfActionModels: [false, false, false],
  stats: { Początkowa: [4, 3, 3, 3, 3, 1, 3, 1, 7] }, ...extra,
});

function setup(units) {
  const state = {};
  function Harness() {
    const [p, setP] = useState({ units, journal: [], advances: [], injuries: {} });
    state.p = p;
    const update = (fn) => setP((cur) => { const c = JSON.parse(JSON.stringify(cur)); fn(c); return c; });
    return <UnitAdjustments post={p} update={update} />;
  }
  render(<Harness />);
  fireEvent.change(screen.getByLabelText("Uzasadnienie zmiany / wynik z tabeli"), { target: { value: "korekta" } });
  return state;
}

test("pause, capture and removal act on the chosen model of a group", () => {
  const state = setup([group()]);
  fireEvent.change(screen.getByLabelText("Model w grupie (pauza, pojmanie, usunięcie)"), { target: { value: "2" } });
  fireEvent.click(screen.getByLabelText("Pojmany (model #3)"));
  expect(state.p.units[0].campaignModelStatus).toEqual([{}, { skip: 1 }, { captured: true }]);
  fireEvent.change(screen.getByLabelText("Model w grupie (pauza, pojmanie, usunięcie)"), { target: { value: "1" } });
  fireEvent.click(screen.getByRole("button", { name: "Usuń model #2 z grupy" }));
  expect(state.p.units[0]).toMatchObject({ selectedNumber: 2, totalCost: 50, campaignModelStatus: [{}, { captured: true }] });
  expect(state.p.journal.at(-1).text).toMatch(/Zelota #2 opuszcza grupę/);
});

test("the banner bearer's group says which model leaves", () => {
  const u = group({ number: 2, selectedNumber: 2, optionalEquipment: ["Chorąży", "Sygnalista"], campaignModelStatus: [{}, {}], totalCost: 90 });
  const post = { units: [u], injuries: {} };
  expect(() => R.removeGroupModel(post, "z", 0)).toThrow(/chorąży, czy sygnalista/);
  expect(R.removeGroupModel(post, "z", 0, "Sygnalista")).toBe("Sygnalista");
  expect(u).toMatchObject({ selectedNumber: 1, optionalEquipment: ["Chorąży"], totalCost: 45 });
  expect(() => R.removeGroupModel(post, "z", 0)).toThrow(/ostatni model/);
});
