import React, { useState } from "react";
import { fireEvent, render, screen, within } from "@testing-library/react";
import * as R from "./rules";
import { AvailabilityPool } from "./Trade";

// Rozdział 14, s. 426: DOSTĘPNOŚĆ, BOGATY MOŻE WIĘCEJ…, SPOŁEM…
const hero = (id, extra = {}) => ({
  uniqueId: id,
  unitName: id,
  type: "Bohater",
  selectedNumber: 1,
  rules: [],
  stats: { Początkowa: [4, 4, 4, 3, 3, 1, 4, 1, 8] },
  ...extra,
});
const post = (units, extra = {}) => ({
  units,
  injuries: {},
  journal: [],
  treasury: 100,
  availability: null,
  ...extra,
});

describe("who gives a die", () => {
  test("heroes who did not roll on the serious injury table, also absent ones; not Drama", () => {
    const p = post([
      hero("played"),
      hero("absent", { battleAbsentModels: [true] }),
      hero("resting", { campaignModelStatus: [{ skip: 1 }], battleAbsentModels: [true] }),
      hero("wza", { battleOutOfActionModels: [true] }),
      hero("dead", { campaignModelStatus: [{ dead: true }] }),
      hero("drama", { type: "Postać Dramatu" }),
      hero("anoreksja", { rules: ["Anoreksja"] }),
      { ...hero("group"), type: "Stronnik", selectedNumber: 3 },
    ]);
    expect(R.availabilityHeroes(p).map((u) => u.uniqueId)).toEqual(["played", "absent", "resting"]);
  });

  test("the pool is one result per hero, Ulicznik adds +3", () => {
    const p = post([hero("a"), hero("b", { rules: ["Ulicznik"] })]);
    R.createAvailabilityPool(p);
    expect(p.availability.map((t) => [t.name, t.modifier])).toEqual([["a", 0], ["b", 3]]);
    R.setAvailabilityDice(p, p.availability[1].id, [3, 4]);
    expect(p.availability[1]).toMatchObject({ locked: true, total: 10 });
  });
});

describe("SPOŁEM", () => {
  test("helpers give up their result for +1 each on the seeker's", () => {
    const p = post([hero("a"), hero("b"), hero("c")]);
    R.createAvailabilityPool(p);
    const [a, b, c] = p.availability.map((t) => t.id);
    R.setAvailabilityHelper(p, b, a);
    R.setAvailabilityHelper(p, c, a);
    R.setAvailabilityDice(p, a, [5, 5]);
    expect(p.availability[0]).toMatchObject({ total: 12, helpers: 2 });
    expect(R.usableAvailability(p, 0).map((t) => t.id)).toEqual([a]);
    expect(() => R.setAvailabilityDice(p, b, [6, 6])).toThrow(/SPOŁEM/);
  });

  test("a hero who has rolled can no longer help", () => {
    const p = post([hero("a"), hero("b")]);
    R.createAvailabilityPool(p);
    const [a, b] = p.availability.map((t) => t.id);
    R.setAvailabilityDice(p, b, [2, 2]);
    expect(() => R.setAvailabilityHelper(p, b, a)).toThrow(/przed rzutem/);
  });
});

describe("BOGATY MOŻE WIĘCEJ…", () => {
  test("a 2K6 zk bribe: 3K6 without the lowest die, paid whatever the roll, once", () => {
    const p = post([hero("a"), hero("b")]);
    R.createAvailabilityPool(p);
    const [a, b] = p.availability.map((t) => t.id);
    R.bribeAvailability(p, a, [3, 4]);
    expect(p.treasury).toBe(93);
    R.setAvailabilityDice(p, a, [1, 6, 5]);
    expect(p.availability[0].total).toBe(11);
    expect(() => R.bribeAvailability(p, b, [1, 1])).toThrow(/raz/);
  });

  test("the bribe needs the gold and comes before the roll", () => {
    const p = post([hero("a")], { treasury: 5 });
    R.createAvailabilityPool(p);
    expect(() => R.bribeAvailability(p, p.availability[0].id, [6, 6])).toThrow(/12 zk/);
    R.setAvailabilityDice(p, p.availability[0].id, [2, 3]);
    expect(() => R.bribeAvailability({ ...p, treasury: 100 }, p.availability[0].id, [1, 1])).toThrow(/przed rzutem/);
  });
});

test("purchases use the smallest result that is enough", () => {
  const p = post([hero("a"), hero("b"), hero("c")]);
  R.createAvailabilityPool(p);
  const [a, b, c] = p.availability.map((t) => t.id);
  R.setAvailabilityDice(p, a, [6, 6]);
  R.setAvailabilityDice(p, b, [4, 4]);
  R.setAvailabilityDice(p, c, [1, 2]);
  expect(R.usableAvailability(p, 7).map((t) => t.id)).toEqual([b, a]);
  p.availability[1].used = true;
  expect(R.usableAvailability(p, 7).map((t) => t.id)).toEqual([a]);
});

test("the panel creates the pool by itself and rolls every result at once", () => {
  let latest;
  function Harness() {
    const [state, setState] = useState(post([hero("Mecenas"), hero("Szarlatan")]));
    latest = state;
    return (
      <AvailabilityPool
        post={state}
        update={(fn) =>
          setState((p) => {
            const next = R.clone(p);
            fn(next);
            return next;
          })
        }
      />
    );
  }
  render(<Harness />);
  expect(latest.availability).toHaveLength(2);
  fireEvent.click(screen.getByRole("button", { name: /Rzuć wszystkie \(2\)/ }));
  expect(latest.availability.every((t) => t.locked && t.total >= 2)).toBe(true);
  const chips = within(screen.getByRole("list", { name: "Wyniki puli dostępności" })).getAllByRole("listitem");
  expect(chips.map((li) => li.textContent)).toEqual(
    latest.availability.map((t) => expect.stringContaining(`${t.name}${t.total}`)),
  );
});
