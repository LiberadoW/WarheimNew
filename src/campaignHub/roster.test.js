import React from "react";
import { render, screen } from "@testing-library/react";
import RosterView from "./RosterView";
import armies from "../Data.js/Armies";
import { createUnit } from "../Functions/createUnit";
import { groupRoster } from "./roster";

const h = armies["Łowcy czarownic"].heroes;
const unit = (name, id) => ({ ...createUnit(h, name), uniqueId: id });

test("the leader heads the heroes, the rest keep their order", () => {
  const list = [unit("Łowca czarownic", "l1"), unit("Prezbiter Sigmara", "p"), unit("Inkwizytor", "i"), unit("Łowca czarownic", "l2"), unit("Zelota", "z")];
  const groups = groupRoster(list);
  expect(groups[0].units.map((u) => u.id)).toEqual(["i", "l1", "p", "l2"]);
  expect(groups[1].units.map((u) => u.id)).toEqual(["z"]);
});

test("models missing games show the campaign rounds they miss", () => {
  const { pauseText, nextRoundFor, summarizeUnit } = require("./roster");
  expect(pauseText(1, 2)).toBe("opuszcza rundę 2");
  expect(pauseText(2, 2)).toBe("opuszcza rundy 2 i 3");
  expect(pauseText(3, 2)).toBe("opuszcza rundy 2–4");
  expect(pauseText(1, null)).toBe("opuszcza następną potyczkę");
  const games = [
    { round: 1, players: ["a", "b"], status: "done" },
    { round: 2, players: ["a", "c"], status: "done" },
    { round: 3, players: ["b", "c"], status: "planned" },
  ];
  expect(nextRoundFor(games, "a")).toBe(3);
  expect(nextRoundFor(games, "b")).toBe(3);
  expect(nextRoundFor([...games, { round: 3, players: ["a", "d"], status: "planned" }], "a")).toBe(3);
  expect(nextRoundFor([], "a")).toBeNull();
  const group = { ...unit("Zelota", "z"), selectedNumber: 3, campaignModelStatus: [{}, { skip: 2 }, { captured: true }] };
  expect(summarizeUnit(group).pauses).toEqual([
    { label: "#2", skip: 2, captured: false },
    { label: "#3", skip: 0, captured: true },
  ]);
});

test("the campaign roster says which rounds a model misses", () => {
  const hero = { ...unit("Łowca czarownic", "l"), campaignModelStatus: [{ skip: 2 }] };
  render(<RosterView armyList={[hero]} nextRound={4} />);
  expect(screen.getByText("opuszcza rundy 4 i 5")).toBeTruthy();
});
