import React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import CampaignPoints from "./CampaignPoints";
import * as R from "./rules";

const unit = (extra = {}) => ({
  uniqueId: "u", unitName: "Stronnicy", type: "Stronnik", selectedNumber: 4,
  exp: 0, rules: [], battleOutOfActionModels: [false, false, false, false],
  battleAbsentModels: [false, false, false, false], ...extra,
});
const points = (battle, units) => {
  render(<CampaignPoints battle={{ result: "win", round: 10, opponentModels: 0, opponentOut: 0, ...battle }}
    post={{ units, campaignPointsApplied: false }} update={() => {}} notes={{}} />);
  const values = ["Determinacja", "Gniew", "Odporność"].map((k) =>
    Number(screen.getByLabelText(new RegExp(`^${k}`)).value));
  cleanup();
  return values;
};

test("Żółtodzioby follow the prestige difference table", () => {
  expect(R.underdogBonus(100, 150)).toBeNull();
  expect(R.underdogBonus(100, 151)).toMatchObject({ diff: 51, exp: 1, gold: 20, dice: 2, rules: ["Pazerność"] });
  expect(R.underdogBonus(0, 100).exp).toBe(2);
  expect(R.underdogBonus(0, 101).dice).toBe(3);
  expect(R.underdogBonus(0, 300).rules).toContain("Samowystarczalni");
  expect(R.underdogBonus(0, 301)).toMatchObject({ exp: 5, gold: 70, dice: 5 });
  expect(R.underdogBonus(0, 301).rules).toContain("Odkrywcy");
});

test("underdog PD and rules are applied in the post-battle sequence", () => {
  const units = [unit({ selectedNumber: 1, battleOutOfActionModels: [false], battleAbsentModels: [false] })];
  const b = R.beginPostBattle({ ...R.newBattle(units), ownPrestige: 50, opponentPrestige: 130 }, units, {}, {});
  expect(b.post.armyRules).toEqual(expect.arrayContaining(["Kompania najemników", "Pazerność"]));
  R.applyExperience(b.post);
  expect(b.post.units[0].exp).toBe(1 + 2);
});

test("Determinacja gives +2 for a win up to and including round 4", () => {
  expect(points({ round: 4 }, [unit()])[0]).toBe(3);
  expect(points({ round: 5 }, [unit()])[0]).toBe(2);
});

test("Odporność ignores models that did not take part", () => {
  // 1 of 2 participating models out of action = 50% → +1, not 25% → +2.
  const u = unit({ battleOutOfActionModels: [true, false, false, false], battleAbsentModels: [false, false, true, true] });
  expect(points({}, [u])[2]).toBe(1);
});

const hero = (id, cp, exp, extra = {}) => ({
  uniqueId: id, unitName: id, type: "Bohater", selectedNumber: 1, exp, rules: [],
  stats: { Początkowa: [4, 4, 4, 3, 3, 1, 4, 1, cp] },
  campaignModelStatus: [{ dead: false }], ...extra,
});

test("a dead leader is succeeded by the highest CP, then PD", () => {
  const post = { journal: [], units: [
    hero("boss", 9, 30, { rules: ["Dowódca"], campaignModelStatus: [{ dead: true }] }),
    hero("a", 7, 20), hero("b", 8, 5), hero("c", 8, 12)] };
  const s = R.leaderSuccession(post);
  expect(s.tied.map((u) => u.uniqueId)).toEqual(["c"]);
  expect(() => R.assignLeader(post, "b")).toThrow();
  R.assignLeader(post, "c");
  expect(post.units[3].rules).toContain("Dowódca");
  expect(post.succession).toBe("c");
});

test("a full CP and PD tie lets the player pick any tied hero", () => {
  const post = { journal: [], units: [
    hero("boss", 9, 30, { rules: ["Dowódca"], campaignModelStatus: [{ dead: true }] }),
    hero("a", 8, 12), hero("b", 8, 12)] };
  expect(R.leaderSuccession(post).tied).toHaveLength(2);
  R.assignLeader(post, "b");
  expect(post.units[2].rules).toContain("Dowódca");
});

test("no succession is needed while the leader lives", () => {
  expect(R.leaderSuccession({ units: [hero("boss", 9, 0, { rules: ["Dowódca"] })] })).toBeNull();
});

const henchmen = (id, n, extra = {}) => ({
  uniqueId: id, unitName: "Khorngor", type: "Stronnik", selectedNumber: n, number: 5, cost: 55,
  exp: 2, rules: ["Furia"], startingEquipment: ["Sztylet", "Broń wielka"], optionalEquipment: [],
  stats: { Początkowa: [5, 4, 3, 4, 4, 1, 3, 1, 7] },
  campaignModelStatus: Array.from({ length: n }, () => ({})),
  battleOutOfActionModels: Array(n).fill(false), battleAbsentModels: Array(n).fill(false), ...extra,
});

test("Khorne counts its own WzA towards Gniew", () => {
  const battle = { result: "loss", round: 10, opponentModels: 10, opponentOut: 2 };
  const units = [henchmen("g", 4, { battleOutOfActionModels: [true, true, true, false] })];
  expect(R.suggestCampaignPoints(battle, { units }).suggested.gniew).toBe(0);
  const khorne = { units, armyRules: ["Znak Chaosu (Wojownicy Khorna)"] };
  // (2 + 3) / (10 + 4) = 36% → +1
  expect(R.suggestCampaignPoints(battle, khorne)).toMatchObject({ khorne: true, suggested: { gniew: 1 } });
  expect(R.isKhorne({ units, armyRules: ["Znak Chaosu"], khorne: true })).toBe(true);
});

test("a henchman group splits into two with the chosen models", () => {
  const post = { journal: [], injuries: {}, units: [henchmen("g", 4, {
    campaignModelStatus: [{}, { skip: 1 }, {}, { dead: true }] })] };
  expect(() => R.splitGroup(post, "g", [0, 1, 2])).toThrow(/co najmniej jeden/);
  const id = R.splitGroup(post, "g", [1, 2]);
  const [a, b] = post.units;
  expect(b.uniqueId).toBe(id);
  expect(b.selectedNumber).toBe(2);
  expect(b.campaignModelStatus[0].skip).toBe(1);
  expect(a.selectedNumber).toBe(2);
  expect(a.campaignModelStatus[1].dead).toBe(true);
  expect(a.totalCost).toBe(110);
});

test("only identical groups merge, within the group size limit", () => {
  const post = { journal: [], injuries: {}, units: [henchmen("a", 2), henchmen("b", 2), henchmen("c", 4),
    henchmen("d", 1, { exp: 5 }), henchmen("e", 1, { optionalEquipment: ["Tarcza"] })] };
  const [a, , c, d, e] = post.units;
  expect(R.mergeProblem(a, c)).toMatch(/najwyżej 5/);
  expect(R.mergeProblem(a, d)).toMatch(/doświadczenie/);
  expect(R.mergeProblem(a, e)).toMatch(/oręż/);
  R.mergeGroups(post, "a", "b");
  expect(post.units.map((u) => u.uniqueId)).toEqual(["a", "c", "d", "e"]);
  expect(post.units[0].selectedNumber).toBe(4);
});

test("groups cannot be reorganised before injuries are settled", () => {
  const post = { journal: [], injuries: {}, units: [henchmen("g", 3, {
    battleOutOfActionModels: [true, false, false] })] };
  expect(() => R.splitGroup(post, "g", [1])).toThrow(/poważne rany/);
});

test("an undead leader passes command to a necromancer, or the company dissolves", () => {
  const vamp = hero("vamp", 9, 30, { rules: ["Dowódca", "Nieumarły"], campaignModelStatus: [{ dead: true }] });
  const post = { journal: [], inventory: [{ name: "Miecz" }], units: [vamp,
    hero("ghoul", 9, 50, { unitName: "Upiór" }), hero("necro", 7, 3, { unitName: "Nekromanta" })] };
  const s = R.leaderSuccession(post);
  expect(s.candidates.map((u) => u.uniqueId)).toEqual(["necro"]);
  expect(() => R.assignLeader(post, "ghoul")).toThrow();
  R.assignLeader(post, "necro");

  const lost = { journal: [], inventory: [{ name: "Miecz" }], units: [R.clone(vamp), hero("ghoul", 9, 50, { unitName: "Upiór" })] };
  expect(R.leaderSuccession(lost).dissolves).toBe(true);
  R.dissolveCompany(lost);
  expect(lost.inventory).toEqual([]);
  const done = R.finalizePostBattle({ id: "b", post: { ...lost, expApplied: false, advances: [], injuries: {} } }, {});
  expect(done.units).toEqual([]);
});

test("development roll buttons name the outcome", () => {
  const h = hero("h", 8, 24);
  expect(R.advanceLabel(h, 12)).toBe("Nowa umiejętność");
  expect(R.advanceLabel(h, 2)).toBe("Nowa umiejętność");
  expect(R.advanceLabel(h, 7)).toBe("WW lub US +1");
  const g = henchmen("g", 2);
  expect(R.advanceLabel(g, 11)).toBe("Chłopak ma talent!");
  expect(R.advanceLabel(g, 4)).toBe("I lub CP +1");
});

test("K6 injury results show the roll in Polish, not the K66 code", () => {
  const squig = henchmen("s", 1, { rules: ["Zwierzę"] });
  const r = R.injuryResult(squig, [1]);
  expect(r).toMatchObject({ name: "Martwy", roll: 1, simple: true });
  expect(r.text).toMatch(/skarbca/);
  expect(R.INJURY_TABLES[R.injuryKind(squig)]).toMatch(/^Nieumarły \/ opętany \/ wierzchowiec \/ zwierzę/);
  const merc = henchmen("m", 1, { type: "Najemne Ostrze" });
  expect(R.injuryResult(merc, [2]).text).toMatch(/przepada/);
});

test("Podatek adds K6 / 2K6 / 3K6 by base price and giants pay double for armour", () => {
  const { taxDice, quotePrice, giantArmourBlocked, basePriceOf } = require("./trading");
  const taxed = { armyRules: ["Podatek"], effects: {}, companyAdvancements: [] };
  expect([taxDice(taxed, 20), taxDice(taxed, 21), taxDice(taxed, 50), taxDice(taxed, 51)]).toEqual([1, 2, 2, 3]);
  expect(taxDice({ armyRules: [] }, 10)).toBe(0);
  const sword = { id: "x", name: "Miecz", category: "Oręż — walka wręcz", price: "10" };
  expect(() => quotePrice(taxed, sword, [], [])).toThrow(/podatek/);
  expect(quotePrice(taxed, sword, [], [], { taxRoll: [4] })).toBe(14);
  const ogre = henchmen("o", 1, { rules: ["Wielkolud"] });
  const light = { name: "Lekki pancerz", category: "Tarcza i pancerz", price: "5" };
  const gromril = { name: "Pancerz z gromrilu (ciężki pancerz)", category: "Tarcza i pancerz", price: "50" };
  expect(giantArmourBlocked(ogre, light)).toMatch(/dla wielkoluda/);
  expect(giantArmourBlocked(henchmen("h", 1), light)).toBeNull();
  expect(basePriceOf(gromril, [], ogre)).toBe(100);
  expect(basePriceOf({ name: "Hełm", category: "Tarcza i pancerz", price: "5" }, [], ogre)).toBe(5);
});

test("company rules adjust exploration and the loot sale automatically", () => {
  const { explorationAuto, explorationAutoTotals, lootSaleAuto } = require("./auto-rules");
  const post = { armyRules: ["Rozrzutność"], units: [
    hero("a", 8, 10, { rules: ["Dowódca", "Światowiec", "Łowca skarbów", "Rewelator"] }),
    henchmen("t", 2, { rules: ["Złodziej", "Przepastne trzewia"] }),
    henchmen("w", 2, { rules: ["Światowiec", "Ekonom"] }),
  ] };
  const auto = explorationAuto({ area: "outside" }, post);
  expect(auto.rerolls).toEqual([{ source: "Łowca skarbów: a", count: 1 }]);
  expect(auto.bonuses.map((b) => b.dice)).toEqual([1, 2]);
  expect(explorationAutoTotals(auto, {})).toBeNull();
  const rolls = { [auto.bonuses[0].key]: [5], [auto.bonuses[1].key]: [1, 6] };
  expect(explorationAutoTotals(auto, rolls, {}, { t: true })).toEqual({ sum: 3 + 3, loot: 1 });
  const sale = lootSaleAuto(post);
  expect(sale).toMatchObject({ gluttons: 2, economists: 2, extraLoot: 1, spendthrift: true, leaderCp: 8 });
});
