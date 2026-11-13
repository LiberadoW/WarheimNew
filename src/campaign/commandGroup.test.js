import React, { useState } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import * as R from "./rules";
import { ExperiencedRecruits } from "./Extras";

const zelota = (roles, extra = {}) => ({
  uniqueId: roles.join("") || "plain", unitName: "Zelota", type: "Stronnik", number: roles.length ? 2 : 99,
  selectedNumber: roles.length || 1, cost: 20, totalCost: 20 + 20 * roles.length, exp: 0, rules: [],
  startingEquipment: ["Sztylet"], optionalEquipment: [...roles], equipmentList: { Sztylet: [2, 0] },
  campaignModelStatus: Array.from({ length: roles.length || 1 }, () => ({})), stats: { Początkowa: [4, 3, 3, 3, 3, 1, 3, 1, 7] },
  ...extra,
});

test("a banner bearer's group takes only a musician, and the other way round", () => {
  expect(R.joiningRole(zelota(["Chorąży"]))).toBe("Sygnalista");
  expect(R.joiningRole(zelota(["Sygnalista"]))).toBe("Chorąży");
  expect(R.joiningRole(zelota(["Chorąży", "Sygnalista"]))).toBe("full");
  expect(R.joiningRole(zelota([]))).toBeNull();
  const g = zelota(["Chorąży"]);
  expect(R.addGroupModel(g)).toBe("Sygnalista");
  expect(g.optionalEquipment).toEqual(["Chorąży", "Sygnalista"]);
  expect(g.selectedNumber).toBe(2);
  expect(g.totalCost).toBe(20 * 2 + 40);
  expect(() => R.addGroupModel(g)).toThrow(/pełna/);
});

test("groups merge only banner bearer with musician", () => {
  const plain = zelota([]);
  const banner = zelota(["Chorąży"]);
  const horn = zelota(["Sygnalista"]);
  expect(R.mergeProblem(banner, plain)).toMatch(/tylko sygnalista/);
  expect(R.mergeProblem(banner, zelota(["Chorąży"], { uniqueId: "b2" }))).toMatch(/tylko sygnalista/);
  expect(R.mergeProblem(banner, horn)).toBeNull();
  const post = { units: [banner, horn], journal: [], injuries: {} };
  R.mergeGroups(post, banner.uniqueId, horn.uniqueId);
  expect(post.units).toHaveLength(1);
  expect(banner.optionalEquipment).toEqual(["Chorąży", "Sygnalista"]);
  expect(banner.totalCost).toBe(80);
});

test("the recruit joining the banner bearer becomes the musician for +20 zk", () => {
  let latest;
  function Harness() {
    const [p, setP] = useState({ units: [zelota(["Chorąży"])], armyRules: [], treasury: 100, recruitBudget: 5, recruitBudgetLocked: true, journal: [], rollDrafts: {} });
    latest = p;
    const update = (fn) => setP((cur) => { const c = JSON.parse(JSON.stringify(cur)); fn(c); return c; });
    return <ExperiencedRecruits post={p} update={update} army={null} />;
  }
  render(<Harness />);
  fireEvent.change(screen.getByRole("combobox"), { target: { value: "Chorąży" } });
  expect(screen.getByText(/rekrut dołącza jako/)).toBeTruthy();
  fireEvent.click(screen.getByRole("button", { name: "Dołącz rekruta" }));
  expect(latest.treasury).toBe(100 - 40);
  expect(latest.units[0].optionalEquipment).toEqual(["Chorąży", "Sygnalista"]);
  expect(latest.journal[0].text).toMatch(/dołącza jako sygnalista/);
});

test("a joined recruit can be undone: gold, PD pool and the role come back", () => {
  let latest;
  function Harness() {
    const [p, setP] = useState({ units: [zelota(["Chorąży"], { exp: 2 })], armyRules: [], treasury: 100, recruitBudget: 5, recruitBudgetLocked: true, journal: [], rollDrafts: {} });
    latest = p;
    const update = (fn) => setP((cur) => { const c = JSON.parse(JSON.stringify(cur)); fn(c); return c; });
    return <ExperiencedRecruits post={p} update={update} army={null} />;
  }
  render(<Harness />);
  fireEvent.change(screen.getByRole("combobox"), { target: { value: "Chorąży" } });
  fireEvent.click(screen.getByRole("button", { name: "Dołącz rekruta" }));
  expect(latest.treasury).toBe(100 - 44); // 20 + 2 PD × 2 + 20 for the role
  expect(latest.recruitBudget).toBe(3);
  fireEvent.click(screen.getByRole("button", { name: "Cofnij" }));
  expect(latest.treasury).toBe(100);
  expect(latest.recruitBudget).toBe(5);
  expect(latest.units[0]).toMatchObject({ selectedNumber: 1, optionalEquipment: ["Chorąży"], totalCost: 40 });
  expect(latest.experiencedJoins).toEqual([]);
});

test("a recruit joined before joins were recorded is undone from the journal", () => {
  const { undoLegacyJoin, legacyJoins } = require("./Extras");
  const g = zelota([], { selectedNumber: 2, campaignModelStatus: [{}, {}], totalCost: 40, exp: 1 });
  const p = { units: [g], treasury: 10, recruitBudget: 2, journal: [{ id: "j1", type: "recruitment", text: "Doświadczony Zelota: 27 zk, 1 PD puli." }] };
  expect(legacyJoins(p)).toEqual([{ id: "j1", legacy: true, name: "Zelota", role: null, cost: 27, exp: 1 }]);
  undoLegacyJoin(p, "j1");
  expect(p.treasury).toBe(37);
  expect(p.recruitBudget).toBe(3);
  expect(g.selectedNumber).toBe(1);
  expect(g.campaignModelStatus).toEqual([{}]);
  expect(legacyJoins(p)).toEqual([]);
});
