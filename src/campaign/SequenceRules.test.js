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
