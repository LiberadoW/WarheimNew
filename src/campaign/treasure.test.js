import React, { useState } from "react";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import * as R from "./rules";
import { addTreasurePd, applyTreasure, treasureState } from "./treasure";
import BattleTracker from "./BattleTracker";
import PlayPanel, { RoundCounter } from "./PlayPanel";

const hero = (extra = {}) => ({
  uniqueId: "h", unitName: "Herszt", type: "Bohater", selectedNumber: 1, exp: 20, rules: [],
  stats: { Początkowa: [4, 4, 4, 3, 3, 2, 4, 1, 8], Maksymalna: [5, 6, 6, 4, 4, 3, 6, 4, 9] },
  battleAbsentModels: [false], battleOutOfActionModels: [false], ...extra,
});
const group = (extra = {}) => hero({ uniqueId: "g", unitName: "Zbir", type: "Stronnik", exp: 0, ...extra });
const start = (scenarioKey, units) =>
  R.beginPostBattle({ ...R.newBattle(units), scenarioRecord: scenarioKey ? { key: scenarioKey } : null }, units, {}, {});
const RUINY = "inside:15:Ruiny";

afterEach(cleanup);

test("Ruiny: each marker is one loot and a carrying hero earns +1 PD per marker", () => {
  const battle = start(RUINY, [hero({ battleTreasure: 2 }), group({ battleTreasure: 1 })]);
  addTreasurePd(battle.post, battle);
  expect(R.experienceBreakdown(battle.post, battle.post.units[0])).toContainEqual({ label: "Znaczniki kosztowności", pd: 2 });
  // Henchmen carry markers for the loot, but the PD is for heroes.
  expect(battle.post.units[1].battleExpParts || []).toEqual([]);
  const s = treasureState(battle, battle.post);
  expect(s).toMatchObject({ markers: 3, loot: 3, missing: "" });
  const loot = battle.post.loot;
  applyTreasure(battle.post, battle);
  expect(battle.post.loot).toBe(loot + 3);
});

test("Grzmiąca góra: one K6 per marker, 3+ is a loot and 1–2 a ruby worth K6 × 15 zk", () => {
  const battle = start("outside:53:Grzmiąca góra", [hero({ battleTreasure: 2 })]);
  battle.post.exploration = { dice: [], encounter: {}, treasure: { chest: [4] } };
  expect(treasureState(battle, battle.post).missing).toMatch(/K6 za każdy znacznik/);
  battle.post.exploration.treasure = { chest: [4, 1] };
  expect(treasureState(battle, battle.post).missing).toMatch(/rubinu/);
  battle.post.exploration.treasure = { chest: [4, 1], chestOther: [undefined, 2] };
  const before = { loot: battle.post.loot, gold: battle.post.treasury };
  applyTreasure(battle.post, battle);
  expect(battle.post.loot).toBe(before.loot + 1);
  expect(battle.post.treasury).toBe(before.gold + 30);
});

test("a K3+2 reward counts only when its condition is ticked", () => {
  const battle = start("inside:44:Zagubiony syn kupca", [hero()]);
  expect(treasureState(battle, battle.post).loot).toBe(0);
  battle.post.exploration = { dice: [], encounter: {}, treasure: { bonusMet: true, bonusDice: [5] } };
  expect(treasureState(battle, battle.post).loot).toBe(5);
});

test("a custom scenario takes the player's number, starting from the markers", () => {
  const battle = start(null, [hero({ battleTreasure: 2 })]);
  expect(treasureState(battle, battle.post).loot).toBe(2);
  battle.post.exploration = { dice: [], encounter: {}, treasure: { manualLoot: 0 } };
  expect(treasureState(battle, battle.post).loot).toBe(0);
});

test("the tracker counts treasure markers and logs each tap", () => {
  let units = [hero()];
  const log = [];
  render(<BattleTracker units={units} setUnits={(u) => (units = u)} onLog={(t) => log.push(t)} />);
  fireEvent.click(screen.getByRole("button", { name: "Kosztowności: Herszt +1" }));
  fireEvent.click(screen.getByRole("button", { name: /W grze/ }));
  expect(units[0].battleOutOfActionModels).toEqual([true]);
  expect(log).toEqual(["Herszt zdobywa znacznik kosztowności", "Herszt: wyłączony z akcji"]);
});

test("the play panel's round is the skirmish's end round and notes go to the log", () => {
  let latest;
  function Harness() {
    const [battle, setBattle] = useState({ ...R.newBattle([]), round: 10 });
    latest = battle;
    const addLog = (text) =>
      setBattle((b) => ({ ...b, log: [...(b.log || []), { id: String((b.log || []).length), round: b.playRound || 1, text }] }));
    return (
      <>
        <RoundCounter battle={battle} setBattle={setBattle} />
        <PlayPanel battle={battle} setBattle={setBattle} addLog={addLog} />
      </>
    );
  }
  render(<Harness />);
  fireEvent.click(screen.getByRole("button", { name: "Runda: więcej" }));
  fireEvent.click(screen.getByRole("button", { name: "Runda: więcej" }));
  expect(latest).toMatchObject({ playRound: 3, round: 3 });
  fireEvent.change(screen.getByLabelText("Wpis w dzienniku"), { target: { value: "Szarża na most" } });
  fireEvent.click(screen.getByRole("button", { name: "Dodaj" }));
  expect(latest.log).toEqual([{ id: "0", round: 3, text: "Szarża na most" }]);
  expect(screen.getByText("Szarża na most")).not.toBeNull();
});

test("every random event gives the company +1 loot, also without treasure markers", () => {
  const { eventCount } = require("./treasure");
  const battle = start(null, [hero()]);
  battle.log = [{ id: "1", round: 2, text: "Zdarzenie losowe (11): Ochroniarz" }, { id: "2", round: 3, text: "Notatka" }];
  expect(eventCount(battle)).toBe(1);
  expect(treasureState(battle, battle.post)).toMatchObject({ events: 1, loot: 1, missing: "" });
  // From a shared game the count arrives with the hand-off.
  const shared = start(RUINY, [hero({ battleTreasure: 1 })]);
  shared.randomEvents = 1;
  expect(treasureState(shared, shared.post).loot).toBe(2);
  // The player can correct it.
  shared.post.exploration = { dice: [], encounter: {}, treasure: { events: 0 } };
  expect(treasureState(shared, shared.post).loot).toBe(1);
});

test("Uszkodzenie pancerza adds one loot for the company", () => {
  const s = treasureState({ optionalRules: ["USZKODZENIE PANCERZA", "MGŁA WOJNY"] }, { units: [] });
  expect(s.loot).toBe(1);
  expect(s.lines).toEqual(["Uszkodzenie pancerza: +1 łup"]);
  expect(treasureState({ optionalRules: ["MGŁA WOJNY"] }, { units: [] })).toBeNull();
});
