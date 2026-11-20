import React, { useState } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Recruitment from "./Recruitment";
import { recruitTaxes } from "./trading";

const group = {
  uniqueId: "g", unitName: "Zbir", type: "Stronnik", selectedNumber: 2, number: 5, cost: 45, totalCost: 90, exp: 2,
  rules: [], startingEquipment: ["Sztylet"], optionalEquipment: ["Miecz", "Ciężki"],
  equipmentList: { Sztylet: [2, 0], Miecz: [10, 0], Ciężki: [30, 2, "Zbroja"] },
  customEquipment: [{ id: "x", name: "Rusznica", price: 60 }],
  campaignModelStatus: [{}, {}],
};
const army = { name: "Kompania testowa", maxModels: 15, heroes: { Zbir: group } };
const post = (rules) => ({ units: [group], armyRules: rules, treasury: 200, recruitBudget: 10, recruitBudgetLocked: true, journal: [], rollDrafts: {} });

test("Podatek is due on every bought item of a joining recruit", () => {
  expect(recruitTaxes(post(["Podatek"]), group)).toEqual([
    { key: "o0", name: "Miecz", price: 10, dice: 1 },
    { key: "o1", name: "Ciężki", price: 30, dice: 2 },
    { key: "c0", name: "Rusznica", price: 60, dice: 3 },
  ]);
  expect(recruitTaxes(post([]), group)).toEqual([]);
});

test("joining a recruit waits for the tax and pays it", () => {
  let latest;
  function Harness() {
    const [p, setP] = useState(post(["Podatek"]));
    latest = p;
    const update = (fn) => setP((cur) => { const c = JSON.parse(JSON.stringify(cur)); fn(c); return c; });
    return <Recruitment post={p} update={update} army={army} />;
  }
  render(<Harness />);
  fireEvent.change(screen.getByLabelText("Model bandy"), { target: { value: "Zbir" } });
  fireEvent.change(screen.getByLabelText("Przydział stronnika"), { target: { value: "g" } });
  fireEvent.change(screen.getByLabelText("Źródło / zasada dostępności"), { target: { value: "Profil testowy" } });
  expect(screen.getByText("Rzuć na podatek za ekwipunek rekruta.")).toBeTruthy();
  const type = (label, values) =>
    values.forEach((v, i) => fireEvent.change(screen.getByLabelText(`Podatek: ${label}, kość ${i + 1}`), { target: { value: String(v) } }));
  type("Miecz (cena podstawowa 10 zk)", [2]);
  type("Ciężki (cena podstawowa 30 zk)", [3, 4]);
  type("Rusznica (cena podstawowa 60 zk)", [1, 1, 1]);
  // 45 per model + 2 PD × 2 + tax 2 + 7 + 3.
  expect(screen.getByText(/Podatek za ekwipunek rekruta: 12 zk/)).toBeTruthy();
  expect(screen.getByText(/Koszt: 61 zk/)).toBeTruthy();
  fireEvent.click(screen.getByRole("button", { name: "Dołącz rekruta" }));
  expect(latest.treasury).toBe(200 - 61);
  expect(latest.units[0].selectedNumber).toBe(3);
  expect(latest.journal.find((entry) => entry.type === "recruitment").text).toMatch(/w tym podatek 12 zk/);
});
