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
  fireEvent.change(screen.getByLabelText("Tradycja magii"), { target: { value: "Tradycja Cienia" } });
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

test("mages are told apart from Magiczna ochrona and Magia krwi; 'albo' lores are a choice", () => {
  const { loreChoices } = require("./spells");
  expect(isMage(unit("t", ["Magiczna ochrona (6+)"]))).toBe(false);
  expect(isMage(unit("v", ["Magia krwi"]))).toBe(false);
  const either = unit("s", ["Mag (Tradycja Bestii albo Tradycja Niebios albo Tradycja Życia)"]);
  expect(loreChoices(either)).toEqual(["Tradycja Bestii", "Tradycja Niebios", "Tradycja Życia"]);
  expect(loreOf(either)).toBeNull();
  expect(loreOf({ ...either, magicLore: "Tradycja Niebios" })).toBe("Tradycja Niebios");
  expect(loreOf(unit("d", ["Mag (Dziedzina Dao)"], { optionalEquipment: ["Dualizm (Yang)"] }))).toBe("Tradycja Yang");
});

test("a rolled stigma shows its own text, not the general STYGMAT CHAOSU", () => {
  const { unitRuleText, getRuleText } = require("../Functions/getRuleText");
  const table = require("./mutations.json");
  const own = { mutations: [{ name: "Przerażający", text: "Własny opis stygmatu." }] };
  expect(unitRuleText(own, "Stygmat Chaosu (Przerażający)", table)).toBe("Własny opis stygmatu.");
  // Older rosters without the stored text fall back to the stigma table.
  const fallback = unitRuleText({}, "Stygmat Chaosu (Przerażający)", table);
  expect(fallback).toBe(table.find((m) => m.name === "Przerażający").text);
  expect(fallback).not.toBe(getRuleText("Stygmat Chaosu"));
});

test("the builder asks casters without spells for their first one", () => {
  const { FirstSpellsPanel } = require("./MagicPanel");
  let units = [unit("p", ["Duchowny (modlitwy do Sigmara)"], { unitName: "Kapłan" }), unit("w", ["Rycerz"])];
  const view = render(<FirstSpellsPanel unitList={units} setUnitList={(u) => { units = u; }} />);
  expect(screen.getByRole("region", { name: "Zaklęcia przed pierwszą grą" })).not.toBeNull();
  fireEvent.change(screen.getByLabelText("albo wynik"), { target: { value: "4" } });
  fireEvent.click(screen.getByRole("button", { name: "Weź: Młot na czarownice" }));
  expect(units[0].learnedSpells).toEqual(["4 MŁOT NA CZAROWNICE"]);
  view.rerender(<FirstSpellsPanel unitList={units} setUnitList={() => {}} />);
  expect(screen.queryByRole("region", { name: "Zaklęcia przed pierwszą grą" })).toBeNull();
});

test("the lore picked in the builder is used; the panel does not ask again", () => {
  const { loreMissingInBuilder, needsLoreChoice } = require("./spells");
  const offered = { "Tradycja Ognia": [0, 4], "Tradycja Metalu": [0, 4], Sztylet: [2, 0] };
  const magister = unit("m", ["Mag (Kolegia Magii)"], { equipmentList: offered });
  expect(loreMissingInBuilder(magister)).toBe(true);
  expect(needsLoreChoice(magister)).toBe(false);
  const picked = { ...magister, rules: [...magister.rules, "Tradycja Metalu"] };
  expect(loreOf(picked)).toBe("Tradycja Metalu");
  expect(loreMissingInBuilder(picked)).toBe(false);
  // A profile whose builder list has no lore keeps the choice in the panel.
  expect(needsLoreChoice(unit("c", ["Guślarstwo", "Mag (Kolegia Magii)"], { equipmentList: { Sztylet: [2, 0] } }))).toBe(true);
});

test("Guślarstwo: a new spell from any college, K6 read from the brackets (spells 7–12)", () => {
  const AdvanceCard = require("./Advancement").default;
  const R = require("./rules");
  const { hedgeSpell } = require("./spells");
  expect(hedgeSpell("Tradycja Ognia", 1).name).toBe("Gorejący miecz Rhuin");
  expect(hedgeSpell("Tradycja Ognia", 6).name).toBe("Ogniste odrodzenie feniksa");
  const hedge = unit("c", ["Guślarstwo", "Mag (Kolegia Magii)"], { unitName: "Czarownik", magicLore: "Tradycja Ognia", exp: 12, skills: [2, 4, 5],
    learnedSpells: ["7 (1) GOREJĄCY MIECZ RHUIN"], stats: { Początkowa: [4,3,3,3,3,1,3,1,8], Maksymalna: [5,6,6,4,4,3,6,4,9] } });
  let post = { units: [hedge], journal: [], advances: [{ id: "a", unitId: "c", threshold: 14, resolved: false, rolls: [{ dice: [1, 3] }, { dice: [1, 1] }], selectedRoll: 0 }] };
  const update = (fn) => { const n = R.clone(post); fn(n); post = n; view.rerender(card()); };
  const card = () => <AdvanceCard advance={post.advances[0]} unit={post.units[0]} army={{ name: "x", heroes: {} }} post={post} update={update} />;
  const view = render(card());
  fireEvent.change(screen.getByLabelText("Umiejętność"), { target: { value: "spell:roll" } });
  fireEvent.change(screen.getByLabelText(/Kolegium Magii dla tego zaklęcia/), { target: { value: "Tradycja Cienia" } });
  fireEvent.change(screen.getByLabelText("Zaklęcie: K6, kość 1"), { target: { value: "2" } });
  const learn = screen.getByRole("button", { name: /^Naucz się:/ });
  fireEvent.click(learn);
  const known = knownSpells(post.units[0]);
  expect(known).toHaveLength(2);
  expect(known[1]).toMatchObject({ lore: "Tradycja Cienia", from: 8 });
});

test("Wiedza tajemna: with a new spell the elf mage also learns one from a college lore", () => {
  const AdvanceCard = require("./Advancement").default;
  const R = require("./rules");
  const { arcaneLores } = require("./spells");
  const armies = require("../Data.js/Armies").default;
  const { createUnit } = require("../Functions/createUnit");
  const elf = { ...createUnit(armies["Elfowie Wysokiego Rodu z Ulthuanu"].heroes, "Mag elfów"), uniqueId: "e", exp: 20,
    learnedSpells: [spellForRoll("Wysoka Magia", 12).key] };
  expect(loreOf(elf)).toBe("Wysoka Magia");
  expect(arcaneLores(elf)).toHaveLength(8);
  let post = { units: [elf], journal: [], advances: [{ id: "a", unitId: "e", threshold: 21, resolved: false, rolls: [{ dice: [1, 3] }, { dice: [1, 1] }], selectedRoll: 0 }] };
  const update = (fn) => { const n = R.clone(post); fn(n); post = n; view.rerender(card()); };
  const card = () => <AdvanceCard advance={post.advances[0]} unit={post.units[0]} army={{ name: "x", heroes: {} }} post={post} update={update} />;
  const view = render(card());
  fireEvent.change(screen.getByLabelText("Umiejętność"), { target: { value: "spell:roll" } });
  fireEvent.change(screen.getByLabelText("Zaklęcie: 2K6, kość 1"), { target: { value: "4" } });
  fireEvent.change(screen.getByLabelText("Zaklęcie: 2K6, kość 2"), { target: { value: "4" } });
  fireEvent.click(screen.getByRole("button", { name: /^Naucz się:/ }));
  // The own-lore spell waits; the extra one comes from a chosen college lore.
  expect(post.advances[0].resolved).toBe(false);
  fireEvent.change(screen.getByLabelText("Tradycja dodatkowego czaru"), { target: { value: "Tradycja Cienia" } });
  fireEvent.change(screen.getByLabelText("Dodatkowy czar: Tradycja Cienia, kość 1"), { target: { value: "2" } });
  fireEvent.click(screen.getByRole("button", { name: /^Naucz się obu:/ }));
  expect(post.advances[0].resolved).toBe(true);
  const known = knownSpells(post.units[0]);
  expect(known).toHaveLength(3);
  expect(known[1]).toMatchObject({ lore: "Wysoka Magia", from: 8 });
  expect(known[2]).toMatchObject({ lore: "Tradycja Cienia", from: 8 });
  expect(post.advances[0].description).toMatch(/Wiedza tajemna: .+ \(Tradycja Cienia\)/);
});
