import React, { useState } from "react";
import { render, screen, fireEvent, cleanup, within } from "@testing-library/react";
import MagicPanel from "./MagicPanel";
import {
  dicePools, firstSpellOptions, isMage, isPriest, knownSpells, learnTotal, loreOf, mageLevel, maxPowerDice, spellForRoll, spellList,
} from "./spells";

const unit = (id, rules, extra = {}) => ({ uniqueId: id, unitName: id, type: "Bohater", selectedNumber: 1, rules, ...extra });
afterEach(cleanup);

test("a lore lists common spells 1–6 and its own 7–12; prayers run 1–9", () => {
  const fire = spellList("Tradycja Ognia");
  expect(fire[0]).toMatchObject({ from: 1, to: 2, name: "Magiczne żądło" });
  expect(spellForRoll("Tradycja Ognia", 7).name).toBe("Gorejący miecz Rhuin");
  expect(spellForRoll("Tradycja Ognia", 12).name).toBe("Ogniste odrodzenie feniksa");
  expect(spellForRoll("Duchowny (modlitwy do Sigmara)", 2).name).toBe("Aura odwagi");
  expect(spellForRoll("Duchowny (modlitwy do Sigmara)", 9).name).toBe("Zbroja Sigmara");
});

test("first spell: K6 on the common list, or the lore's 7th / the first prayer", () => {
  const mage = unit("m", ["Mag (Tradycja Ognia)"]);
  expect(isMage(mage)).toBe(true);
  expect(firstSpellOptions(mage, 4).map((s) => s.from)).toEqual([4, 7]);
  const priest = unit("p", ["Duchowny (modlitwy do Sigmara)"]);
  expect(isPriest(priest)).toBe(true);
  expect(firstSpellOptions(priest, 5).map((s) => s.from)).toEqual([5, 1]);
});

test("mage level, power and dispel dice follow s. 550", () => {
  const l1 = unit("a", ["Mag (Tradycja Ognia)"], { learnedSpells: ["1-2 MAGICZNE ŻĄDŁO"] });
  const l3 = unit("b", ["Mag (Tradycja Ognia)"], { learnedSpells: ["1", "2", "3", "4"] });
  const priest = unit("c", ["Duchowny (modlitwy do Sigmara)", "Rozproszenie magii (2)"]);
  expect([mageLevel(l1), mageLevel(l3), maxPowerDice(l3)]).toEqual([1, 3, 4]);
  const pools = dicePools([l1, l3, priest]);
  expect(pools.mages.map((m) => m.n)).toEqual([1, 3]);
  expect(pools.pool).toBe(1);
  // 1 + 1 (level I) + 2 (level III) + 2 (Rozproszenie magii 2)
  expect(pools.dispelTotal).toBe(6);
  // An out-of-action mage generates nothing.
  expect(dicePools([{ ...l3, battleOutOfActionModels: [true] }]).dispelTotal).toBe(1);
});

test("priests learn on 3K3: each K6 is halved", () => {
  expect(learnTotal(unit("p", ["Duchowny (modlitwy do Sigmara)"]), [1, 4, 6])).toBe(1 + 2 + 3);
  expect(learnTotal(unit("m", ["Mag (Tradycja Ognia)"]), [3, 5])).toBe(8);
});

test("the panel takes the first spell, shows it with its text and taps dice off", () => {
  let latest;
  function Harness() {
    const [units, setUnits] = useState([unit("m", ["Mag (Tradycja Ognia)"], { unitName: "Czarodziej" })]);
    latest = units;
    return <MagicPanel units={units} onAssign={(id, patch) => setUnits(units.map((u) => (u.uniqueId === id ? { ...u, ...patch } : u)))} />;
  }
  render(<Harness />);
  fireEvent.change(screen.getByLabelText("albo wynik"), { target: { value: "3" } });
  fireEvent.click(screen.getByRole("button", { name: "Weź: Gorejący miecz Rhuin" }));
  expect(knownSpells(latest[0]).map((s) => s.name)).toEqual(["Gorejący miecz Rhuin"]);
  expect(loreOf(latest[0])).toBe("Tradycja Ognia");
  fireEvent.click(screen.getByRole("button", { name: /^Gorejący miecz Rhuin/ }));
  expect(screen.getByRole("dialog")).not.toBeNull();
  fireEvent.click(screen.getByRole("button", { name: "Zamknij" }));
  const power = within(screen.getByRole("group", { name: /Moc: Czarodziej/ }));
  fireEvent.click(power.getByRole("button", { name: /kostka 1/ }));
  expect(power.getByText("0/1")).not.toBeNull();
});

test("a college mage chooses a lore first", () => {
  let latest;
  function Harness() {
    const [units, setUnits] = useState([unit("m", ["Mag (Kolegia Magii)"])]);
    latest = units;
    return <MagicPanel units={units} onAssign={(id, patch) => setUnits(units.map((u) => (u.uniqueId === id ? { ...u, ...patch } : u)))} />;
  }
  render(<Harness />);
  fireEvent.change(screen.getByLabelText("Tradycja magii (Kolegia Magii)"), { target: { value: "Tradycja Cienia" } });
  expect(latest[0].magicLore).toBe("Tradycja Cienia");
  expect(screen.getByText(/Pełna lista: Tradycja Cienia/)).not.toBeNull();
});

test("a new skill learns a spell by 2K6; a known one may be mastered instead", () => {
  const AdvanceCard = require("./Advancement").default;
  const R = require("./rules");
  const mage = unit("m", ["Mag (Tradycja Ognia)"], { unitName: "Czarodziej", exp: 20, skills: [0, 1],
    learnedSpells: ["7 (1) GOREJĄCY MIECZ RHUIN"], stats: { Początkowa: [4,3,3,3,3,1,4,1,7], Maksymalna: [4,6,6,4,4,3,6,4,9] } });
  let post = { units: [mage], journal: [], advances: [{ id: "a", unitId: "m", threshold: 21, resolved: false, rolls: [{ dice: [1, 3] }, { dice: [1, 1] }], selectedRoll: 0 }] };
  const update = (fn) => { const n = R.clone(post); fn(n); post = n; view.rerender(card()); };
  const card = () => <AdvanceCard advance={post.advances[0]} unit={post.units[0]} army={{ name: "x", heroes: {} }} post={post} update={update} />;
  const view = render(card());
  fireEvent.change(screen.getByLabelText("Umiejętność"), { target: { value: "spell:roll" } });
  fireEvent.change(screen.getByLabelText("Zaklęcie: 2K6, kość 1"), { target: { value: "3" } });
  fireEvent.change(screen.getByLabelText("Zaklęcie: 2K6, kość 2"), { target: { value: "4" } });
  // 7 is already known: mastery gives +1 to cast it.
  fireEvent.click(screen.getByRole("button", { name: "Lepiej opanuje: Gorejący miecz Rhuin" }));
  expect(post.units[0].spellMastery).toEqual({ "7 (1) GOREJĄCY MIECZ RHUIN": 1 });
  expect(post.advances[0].resolved).toBe(true);
});
