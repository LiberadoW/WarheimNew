import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import * as R from "./rules";
import { applyMutation, resolveSanity, sanityTasks } from "./sanity";
import { explorationRules } from "./company";
import { eligibleHeroesLabel } from "./Exploration";
import InjuryResolution from "./InjuryResolution";
import UnitPlay from "../Components/UnitPlay";
import { getPrestige } from "../Functions/getPrestige";

const hero = (extra = {}) => ({
  uniqueId: "hero",
  unitName: "Kapitan",
  unitDisplayName: "",
  type: "Bohater",
  selectedNumber: 1,
  number: 1,
  cost: 55,
  totalCost: 55,
  exp: 20,
  skills: [0, 1, 2, 3, 4, 5],
  rules: [],
  startingEquipment: ["Sztylet"],
  optionalEquipment: [],
  customEquipment: [],
  equipmentList: { Sztylet: [2, 0], Miecz: [10, 0] },
  stats: {
    Początkowa: [4, 4, 4, 3, 3, 2, 4, 1, 8],
    Maksymalna: [5, 6, 6, 4, 4, 3, 6, 4, 9],
  },
  battleOutOfActionModels: [false],
  battleAbsentModels: [false],
  ...extra,
});
const group = (n, extra = {}) =>
  hero({
    uniqueId: "group",
    unitName: "Wojownik",
    type: "Stronnik",
    selectedNumber: n,
    number: 5,
    cost: 25,
    totalCost: 25 * n,
    exp: 0,
    battleOutOfActionModels: Array(n).fill(false),
    battleAbsentModels: Array(n).fill(false),
    ...extra,
  });
const begin = (units, notes = {}) =>
  R.beginPostBattle({ ...R.newBattle(units), gameName: "Test" }, units, notes);
const task = (post, i = 0) => R.injuryTasks(post)[i];
const injure = (post, dice, detail, i = 0) => {
  const t = task(post, i);
  R.applyInjury(post, t, R.injuryResult(t.unit, dice), detail);
};

describe("1. Atrofia on a henchman group", () => {
  test.each([
    [6, "Rana nogi"],
    [3, "Amputowane ramię"],
  ])("K6 %s applies once and kills nobody", (die, effect) => {
    const b = begin([group(3)]);
    applyMutation(b.post, "group", "Niepodzielony", [5, 3], {
      secondary: [die],
      reason: "test",
    });
    const u = b.post.units[0];
    expect(u.campaignModelStatus.map((s) => !!s.dead)).toEqual([
      false,
      false,
      false,
    ]);
    if (die === 6) {
      expect(R.currentStats(u)[0]).toBe(2);
      expect(u.injuries).toEqual([effect]);
    } else expect(u.rules).toContain(effect);
  });
});

describe("2. temporary injury results", () => {
  test("one-off results are not stored as wounds, lasting ones are", () => {
    const b = begin([
      hero({ uniqueId: "a", battleOutOfActionModels: [true] }),
      hero({ uniqueId: "b", battleOutOfActionModels: [true] }),
      hero({ uniqueId: "c", battleOutOfActionModels: [true] }),
      group(2, { battleOutOfActionModels: [true, true] }),
    ]);
    const [a, bb, c, g0, g1] = R.injuryTasks(b.post);
    R.applyInjury(b.post, a, R.injuryResult(a.unit, [4, 1]));
    R.applyInjury(b.post, bb, R.injuryResult(bb.unit, [3, 5]), {
      secondary: [3],
    });
    R.applyInjury(b.post, c, R.injuryResult(c.unit, [1, 6]), {
      secondary: [3],
      children: [{ dice: [1, 1] }, { dice: [3, 2] }],
    });
    R.applyInjury(b.post, g0, R.injuryResult(g0.unit, [1]));
    R.applyInjury(b.post, g1, R.injuryResult(g1.unit, [4]));
    const [ua, ub, uc, ug] = b.post.units;
    expect(ua.injuries || []).toEqual([]);
    expect(ub.injuries || []).toEqual([]);
    expect(ub.campaignModelStatus[0].skip).toBe(2);
    expect(uc.injuries).toEqual(["Rana nogi", "Rana klatki piersiowej"]);
    expect(ug.injuries || []).toEqual([]);
  });
  test("second leg wound, second eye and second arm still remove a hero", () => {
    const b = begin([
      hero({
        uniqueId: "a",
        injuries: ["Rana nogi"],
        battleOutOfActionModels: [true],
      }),
      hero({
        uniqueId: "b",
        injuries: ["Oślepiony"],
        battleOutOfActionModels: [true],
      }),
      hero({
        uniqueId: "c",
        rules: ["Amputowane ramię"],
        battleOutOfActionModels: [true],
      }),
    ]);
    injure(b.post, [2, 2], {}, 0);
    injure(b.post, [3, 1], {}, 1);
    injure(b.post, [2, 3], { secondary: [1] }, 2);
    expect(b.post.units.map((u) => u.campaignModelStatus[0].dead)).toEqual([
      true,
      true,
      true,
    ]);
  });
  test("legacy one-off names are dropped at finalization, lasting ones kept", () => {
    const b = begin([
      hero({
        injuries: [
          "Martwy",
          "Powrót do zdrowia",
          "Rana nogi",
          "Stare wojenne rany",
          "Pojmany",
        ],
      }),
    ]);
    R.applyExperience(b.post);
    b.post.advances.forEach((a) => (a.resolved = true));
    const done = R.finalizePostBattle(b, {});
    expect(done.units[0].injuries).toEqual(["Rana nogi", "Stare wojenne rany"]);
  });
  test("UnitPlay lists lasting wounds and a separate temporary part", () => {
    const u = hero({
      injuries: ["Martwy", "Rana nogi"],
      campaignModelStatus: [{ skip: 2 }],
    });
    render(
      <UnitPlay unit={u} unitList={[u]} setUnitList={() => {}} campaign={{}} />,
    );
    fireEvent.click(screen.getByText("Poważne obrażenia"));
    expect(screen.getByText("Rana nogi")).toBeTruthy();
    expect(screen.queryByText("Martwy")).toBeNull();
    expect(screen.getByText("Tymczasowe")).toBeTruthy();
    expect(screen.getByText("pauza: 2 potyczki")).toBeTruthy();
  });
  test("UnitPlay drops the temporary part once the status ends", () => {
    const u = hero({ campaignModelStatus: [{ skip: 0 }] });
    render(
      <UnitPlay unit={u} unitList={[u]} setUnitList={() => {}} campaign={{}} />,
    );
    fireEvent.click(screen.getByText("Poważne obrażenia"));
    expect(screen.queryByText("Tymczasowe")).toBeNull();
  });
});

test("3. survival PD and Obłęd need a model that played and survived", () => {
  const b = begin([
    group(2, {
      battleAbsentModels: [false, true],
      battleOutOfActionModels: [true, false],
      battleObled: 2,
      obled: 0,
    }),
  ]);
  injure(b.post, [1]);
  R.applyExperience(b.post);
  expect(b.post.units[0].exp).toBe(0);
  expect(b.post.units[0].obled).toBe(0);
});

describe("4. robbed heroes lose all equipment data", () => {
  const rich = () =>
    hero({
      cost: 55 + 10 + 30,
      totalCost: 95,
      optionalEquipment: ["Miecz"],
      customEquipment: [{ id: "t", name: "Talizman", price: 30 }],
      campaignEquipment: [
        { name: "Talizman", category: "Magiczne talizmany", basePrice: 30 },
      ],
      craftedEquipment: { Miecz: [{ name: "Runa" }] },
      weaponEnhancements: { Miecz: ["Ostry"] },
      equipmentAliasSelections: { "Miecz/Topór": ["Miecz"] },
      battleOutOfActionModels: [true],
    });
  test.each([
    ["Ograbiony", [3, 6], {}],
    ["arena loss 3+", [6, 5], { arena: "loss", secondary: [3] }],
  ])("%s", (_, dice, detail) => {
    const b = begin([rich()]);
    injure(b.post, dice, detail);
    const u = b.post.units[0];
    expect(u.cost).toBe(55);
    expect(u.totalCost).toBe(55);
    expect(u.startingEquipment).toEqual([]);
    expect(u.campaignEquipment).toEqual([]);
    expect(u.craftedEquipment).toEqual({});
    expect(u.weaponEnhancements).toEqual({});
    expect(u.equipmentAliasSelections).toEqual({});
    expect(
      R.equipmentCapacity(u, { category: "Magiczne talizmany" }),
    ).toBeNull();
    // 20 PD + 5 for the model; no equipment or magic items remain.
    expect(getPrestige([u])[0]).toBe(25);
  });
});

describe("5. Wielokrotnie zraniony K3 correction", () => {
  test("applyInjury uses only ceil(K6/2) child wounds", () => {
    const b = begin([hero({ battleOutOfActionModels: [true] })]);
    injure(b.post, [1, 6], {
      secondary: [1],
      children: [{ dice: [3, 2] }, { dice: [3, 2] }, { dice: [3, 2] }],
    });
    expect(R.currentStats(b.post.units[0])[4]).toBe(2);
  });
  test("the UI trims extra wounds when the K3 die is corrected", () => {
    const onChange = jest.fn();
    const result = R.injuries.find((r) => r.min === 16);
    render(
      <InjuryResolution
        result={result}
        value={{
          // A K3 of 6 was entered and then cleared for correction.
          secondary: [""],
          children: [{ dice: [1, 1] }, { dice: [2, 2] }, { dice: [3, 3] }],
        }}
        onChange={onChange}
      />,
    );
    const group = screen.getByText(/Liczba ran K3/).closest("fieldset");
    const input = group.querySelector("input");
    fireEvent.change(input, { target: { value: "1" } });
    const last = onChange.mock.calls[onChange.mock.calls.length - 1][0];
    expect(last.secondary).toEqual([1]);
    expect(last.children).toHaveLength(1);
  });
});

describe("6. shared mental illness application", () => {
  const mad = (mental, note) => {
    const b = begin([hero({ battleOutOfActionModels: [true] })]);
    injure(b.post, [2, 4], { mental, note });
    return b.post.units[0];
  };
  test("Żarłoczność and Nienawiść add their linked rules", () => {
    expect(mad([6, 6]).rules).toContain("Przepastne trzewia");
    expect(mad([5, 2]).rules).toEqual(
      expect.arrayContaining(["Nienawiść", "Animozja"]),
    );
    expect(mad([6, 6]).mentalIllnesses[0]).toMatchObject({ age: 0, code: 66 });
  });
  test("Amnezja requires its note on the injury path", () => {
    expect(() => mad([1, 5], "")).toThrow(/amnezji/);
    expect(mad([1, 5], "Zapomniał Unik").mentalIllnesses[0].note).toBe(
      "Zapomniał Unik",
    );
  });
  test("Bezduszność adds Zimnokrwisty on both paths", () => {
    expect(mad([2, 3]).rules).toContain("Zimnokrwisty");
    const b = begin([hero({ obled: 7 })]);
    b.post.units[0].obled = 8;
    resolveSanity(b.post, sanityTasks(b.post)[0], [2, 3], "");
    expect(b.post.units[0].rules).toContain("Zimnokrwisty");
  });
  test("Żarłoczność excludes the hero from exploration like Anoreksja", () => {
    const b = begin([
      hero({ rules: ["Żarłoczność"] }),
      hero({ uniqueId: "x" }),
    ]);
    const heroes = explorationRules(
      { result: "loss", area: "inside" },
      b.post,
    ).heroes;
    expect(heroes.map((u) => u.uniqueId)).toEqual(["x"]);
  });
});

test("7. Zawzięty wróg keeps an existing Nienawiść and logs it", () => {
  const b = begin([
    hero({ rules: ["Nienawiść (Skaveni)"], battleOutOfActionModels: [true] }),
  ]);
  injure(b.post, [5, 6], { secondary: [5] });
  expect(b.post.units[0].rules).toEqual(["Nienawiść (Skaveni)"]);
  expect(
    b.post.journal.some((j) => /nienawiści nie dodano/.test(j.text)),
  ).toBe(true);
});

test("8. finalization summary feeds the saved-list history", () => {
  const b = begin(
    [
      hero({ battleOutOfActionModels: [true], battleKills: 1 }),
      group(2, { battleOutOfActionModels: [false, true] }),
    ],
    { campaign: { settings: { obled: true } } },
  );
  injure(b.post, [6, 6], { obled: [6] }, 0);
  injure(b.post, [1], {}, 1);
  R.applyExperience(b.post);
  R.grantExperience(b.post, b.post.units[1], 1, "Eksploracja");
  b.post.advances.forEach((a) => (a.resolved = true));
  const { entry } = R.finalizePostBattle(b, {});
  // Hero: survival + kill + Wbrew wszystkiemu; group: survival + exploration.
  expect(entry.summary.totalExpGained).toBe(5);
  expect(entry.summary.totalObledGained).toBe(3);
  expect(entry.summary.outOfActionModels).toEqual([
    "Kapitan: Wbrew wszystkiemu",
    "Wojownik #2: Martwy",
  ]);
  expect(entry.summary.unitResults[1]).toMatchObject({
    unitLabel: "Wojownik",
    gainedExp: 2,
    modelResults: [
      { modelLabel: "Wojownik #1", isOutOfAction: false, status: "aktywny" },
      { modelLabel: "Wojownik #2", isOutOfAction: true, status: "poległ" },
    ],
  });
});

describe("9. small fixes", () => {
  test("a: the K3 healing input appears only for the hero result 35", () => {
    const skip = R.injuryResult(group(1, { rules: ["Wielkolud"] }), [2]);
    expect(skip).toMatchObject({ code: 35, simple: true });
    const { container, unmount } = render(
      <InjuryResolution result={skip} value={{}} onChange={() => {}} />,
    );
    expect(container.textContent).not.toMatch(/Czas leczenia/);
    unmount();
    const deep = R.injuries.find((r) => r.min === 35);
    render(<InjuryResolution result={deep} value={{}} onChange={() => {}} />);
    expect(screen.getByText(/Czas leczenia K3/)).toBeTruthy();
  });
  test.each([
    [0, "0 uprawnionych bohaterów"],
    [1, "1 uprawniony bohater"],
    [3, "3 uprawnieni bohaterowie"],
    [5, "5 uprawnionych bohaterów"],
  ])("c: exploration label for %s", (n, text) =>
    expect(eligibleHeroesLabel(n)).toBe(text),
  );
});

test("10. a captured hero cannot become the new leader", () => {
  const b = begin([
    hero({
      uniqueId: "leader",
      rules: ["Dowódca"],
      battleOutOfActionModels: [true],
    }),
    hero({
      uniqueId: "captive",
      exp: 40,
      campaignModelStatus: [{ captured: true }],
      battleAbsentModels: [true],
    }),
    hero({ uniqueId: "free" }),
  ]);
  injure(b.post, [1, 1]);
  expect(
    R.leaderSuccession(b.post).candidates.map((u) => u.uniqueId),
  ).toEqual(["free"]);
});

test("11. Żółtodzioby PD skips mercenaries but not Drama", () => {
  const units = [
    hero({ uniqueId: "m", type: "Najemne Ostrze", exp: 0 }),
    hero({ uniqueId: "d", type: "Postać Dramatu", exp: 12 }),
  ];
  const b = R.beginPostBattle(
    { ...R.newBattle(units), ownPrestige: 0, opponentPrestige: 60 },
    units,
    {},
  );
  R.applyExperience(b.post);
  expect(b.post.units.map((u) => u.exp)).toEqual([1, 14]);
});

describe("12. +K3 Obłęd for heroes taken out of action", () => {
  const on = { campaign: { settings: { obled: true } } };
  test("required, added to battleObled and logged when the setting is on", () => {
    const b = begin([hero({ battleOutOfActionModels: [true] })], on);
    const t = task(b.post);
    expect(R.wzaSanityRequired(b.post, t)).toBe(true);
    expect(() =>
      R.applyInjury(b.post, t, R.injuryResult(t.unit, [4, 1])),
    ).toThrow(/K3/);
    R.applyInjury(b.post, t, R.injuryResult(t.unit, [4, 1]), { obled: [5] });
    expect(b.post.units[0].battleObled).toBe(3);
    expect(b.post.journal.some((j) => j.type === "sanity")).toBe(true);
    R.applyExperience(b.post);
    expect(b.post.units[0].obled).toBe(3);
  });
  test("not for henchmen, Niezłomny heroes or with the setting off", () => {
    const b = begin(
      [
        group(1, { battleOutOfActionModels: [true] }),
        hero({ rules: ["Niezłomny"], battleOutOfActionModels: [true] }),
      ],
      on,
    );
    expect(
      R.injuryTasks(b.post).map((t) => R.wzaSanityRequired(b.post, t)),
    ).toEqual([false, false]);
    const off = begin([hero({ battleOutOfActionModels: [true] })]);
    expect(R.wzaSanityRequired(off.post, task(off.post))).toBe(false);
  });
  test("UnitPlay hides the manual Obłęd counter for henchmen", () => {
    const campaign = { settings: { obled: true }, activeBattle: { id: "b" } };
    const g = group(1);
    const { unmount } = render(
      <UnitPlay
        unit={g}
        unitList={[g]}
        setUnitList={() => {}}
        campaign={campaign}
      />,
    );
    expect(screen.queryByText("Obłęd")).toBeNull();
    unmount();
    const h = hero();
    render(
      <UnitPlay
        unit={h}
        unitList={[h]}
        setUnitList={() => {}}
        campaign={campaign}
      />,
    );
    expect(screen.getByText("Obłęd")).toBeTruthy();
  });
});
