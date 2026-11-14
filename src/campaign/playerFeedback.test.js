import React, { useState } from "react";
import { render, screen, fireEvent, within } from "@testing-library/react";
import armies from "../Data.js/Armies";
import { createUnit } from "../Functions/createUnit";
import * as R from "./rules";
import Inventory from "./Inventory";
import { commandRoleProblem, recruit } from "./recruiting";
import SequenceHistory from "../campaignHub/SequenceHistory";
import RosterView from "../campaignHub/RosterView";

const army = { ...armies["Łowcy czarownic"], name: "Łowcy czarownic" };
const h = army.heroes;

test("a recruit can be promoted to banner bearer once per company", () => {
  const post = { units: [], treasury: 100, journal: [], availability: [], armyRules: [] };
  const u = recruit(post, army, "Zelota", { commandRole: "Chorąży" });
  expect(u.optionalEquipment).toContain("Chorąży");
  expect(post.treasury).toBe(100 - 20 - 20);
  expect(commandRoleProblem(post, createUnit(h, "Zelota"), "Chorąży")).toMatch(/ma już chorążego/);
  expect(commandRoleProblem(post, createUnit(h, "Zelota"), "Sygnalista")).toBeNull();
  expect(commandRoleProblem(post, createUnit(h, "Flagelant"), "Sygnalista")).toMatch(/nie może/);
});

function stash(units, inventory) {
  const state = {};
  function Harness() {
    const [p, setP] = useState({ units, inventory, journal: [], usedItems: [] });
    state.p = p;
    const update = (fn) => setP((cur) => { const c = JSON.parse(JSON.stringify(cur)); fn(c); return c; });
    return <Inventory post={p} update={update} army={army} />;
  }
  render(<Harness />);
  return state;
}

test("a group with a dead model needs equipment only for the living", () => {
  const g = { ...createUnit(h, "Zelota"), uniqueId: "z", selectedNumber: 4, campaignModelStatus: [{}, {}, {}, { dead: true }] };
  stash([g], [{ id: "s", name: "Sztylet", quantity: 3 }]);
  expect(screen.queryByText(/za mało/)).toBeNull();
  expect(screen.getByRole("button", { name: "Przydziel" }).disabled).toBe(false);
});

test("an item removed without refund can be restored", () => {
  const state = stash([{ ...createUnit(h, "Łowca czarownic"), uniqueId: "l" }], [{ id: "s", name: "Sztylet", quantity: 1, basePrice: 2 }]);
  fireEvent.click(screen.getByRole("button", { name: "Usuń bez zwrotu" }));
  fireEvent.change(screen.getByLabelText("Powód (zużyty, zgubiony, zniszczony…)"), { target: { value: "pomyłka" } });
  fireEvent.click(screen.getByRole("button", { name: "Usuń jedną sztukę bez zwrotu złota" }));
  expect(state.p.inventory).toEqual([]);
  fireEvent.click(screen.getByRole("button", { name: "Przywróć" }));
  expect(state.p.inventory).toMatchObject([{ name: "Sztylet", quantity: 1, basePrice: 2 }]);
  expect(state.p.usedItems).toEqual([]);
});

test("the roster shows the stash kept after the sequence", () => {
  render(<RosterView armyList={[{ ...createUnit(h, "Inkwizytor"), uniqueId: "i" }]} notes={{ skarbiec: 35, campaign: { inventory: [{ id: "a", name: "Miecz", quantity: 2 }] } }} />);
  expect(screen.getByText("35 zk")).toBeTruthy();
  expect(screen.getByText("Miecz ×2")).toBeTruthy();
});

test("a finished game shows both players' sequences", () => {
  const entry = {
    result: "win", treasury: 40, loot: 1, campaignGame: { gameId: "g1" },
    summary: { totalExpGained: 5, unitResults: [{ unitLabel: "Inkwizytor", gainedExp: 3, modelResults: [{ modelLabel: "Inkwizytor", status: "aktywny" }] }] },
    journal: [{ id: "j", text: "Sprzedano 1 łupów za 20 zk." }],
  };
  const sides = [
    { owner: "a", name: "Ania", list: { campaignNotes: { campaign: { history: [entry] } } } },
    { owner: "b", name: "Bartek", list: { campaignNotes: { campaign: { history: [] } } } },
  ];
  render(<SequenceHistory game={{ id: "g1", sequenceDone: { a: {} } }} sides={sides} />);
  const box = within(screen.getByRole("region", { name: "Sekwencje po potyczce" }));
  expect(box.getByText(/Ania: wygrana · \+5 PD · skarbiec 40 zk/)).toBeTruthy();
  expect(box.getByText("Sprzedano 1 łupów za 20 zk.")).toBeTruthy();
  expect(box.getByText(/Bartek: jeszcze nie rozliczona/)).toBeTruthy();
});
