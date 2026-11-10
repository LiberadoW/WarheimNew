import React from "react";
import { fireEvent, render as rtlRender, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import {
  OPTIONAL_RULE_PD,
  findScenario,
  optionalRules,
  resolveScenarioRoll,
  scenarioForRoll,
  scenarioKey,
  allScenarios,
} from "./scenarios";
import randomEvents from "./data/randomEvents.json";
import { generatePairings, nextRound, playedPairs } from "./pairings";
import ScenarioPicker from "./ScenarioPicker";
import RoundsSection from "./RoundsSection";
import * as service from "./campaignService";

jest.mock("./campaignService", () => ({
  addGame: jest.fn(() => Promise.resolve()),
  createRound: jest.fn(() => Promise.resolve()),
  deleteGame: jest.fn(() => Promise.resolve()),
  recordResult: jest.fn(() => Promise.resolve()),
  reopenGame: jest.fn(() => Promise.resolve()),
  updateGame: jest.fn(() => Promise.resolve()),
}));

// Game cards link to the game screen, so they need a router.
const render = (ui) => {
  const result = rtlRender(<MemoryRouter>{ui}</MemoryRouter>);
  return { ...result, rerender: (next) => result.rerender(<MemoryRouter>{next}</MemoryRouter>) };
};

describe("scenario data", () => {
  test("both tables cover K66 13–64 and three special scenarios exist", () => {
    const codes = [];
    for (let t = 1; t <= 6; t++) for (let u = 1; u <= 6; u++) codes.push(t * 10 + u);
    const expected = codes.filter((c) => c >= 13 && c <= 64);
    ["inside", "outside"].forEach((area) =>
      expect(allScenarios.filter((s) => s.area === area && !s.special).map((s) => s.code)).toEqual(expected),
    );
    expect(allScenarios.filter((s) => s.special).map((s) => s.name)).toEqual([
      "Misja ratunkowa",
      "Magiczne koryto",
      "Zabij mutanta",
    ]);
  });

  test("every scenario has its victory condition and PD", () => {
    allScenarios.forEach((s) => {
      const titles = s.sections.map((x) => x.title);
      expect(titles.some((t) => t.startsWith("Cel"))).toBe(true);
      expect(titles).toContain("Punkty doświadczenia");
    });
  });

  test("random event tables cover every K66 result in both areas", () => {
    ["inside", "outside"].forEach((area) => {
      const covered = randomEvents[area].flatMap((e) => {
        const out = [];
        for (let c = e.code; c <= e.max; c++) if (c % 10 >= 1 && c % 10 <= 6) out.push(c);
        return out;
      });
      expect(covered).toHaveLength(36);
    });
  });

  test("optional rules with company PD come from the rulebook text", () => {
    Object.keys(OPTIONAL_RULE_PD).forEach((key) => {
      const rule = optionalRules.find((r) => r.key === key);
      expect(rule.pdText[0]).toMatch(/otrzymują dodatkowe \+1 PD/);
    });
  });
});

describe("scenario roll (rulebook p. 336)", () => {
  test("K6 picks the area and K66 the scenario", () => {
    expect(resolveScenarioRoll({ areaDie: 2, first: [1, 5] }).scenario.name).toBe("Ruiny");
    expect(resolveScenarioRoll({ areaDie: 5, first: [1, 5] }).scenario.name).toBe("Natarcie");
  });

  test("11 and 66 hand the choice to the player with lower prestige", () => {
    expect(scenarioForRoll("inside", [1, 1]).type).toBe("choose");
    expect(scenarioForRoll("outside", [6, 6]).type).toBe("choose");
  });

  test("12 and 65 roll again on the other table", () => {
    const first = resolveScenarioRoll({ areaDie: 1, first: [1, 2] });
    expect(first.needsSecond).toBe(true);
    expect(first.area).toBe("outside");
    const done = resolveScenarioRoll({ areaDie: 1, first: [1, 2], second: [1, 5] });
    expect(done.scenario.name).toBe("Natarcie");
    expect(done.steps).toHaveLength(2);
  });

  test("a second 'other table' result becomes a choice", () => {
    expect(resolveScenarioRoll({ areaDie: 4, first: [6, 5], second: [1, 2] }).type).toBe("choose");
  });

  test("scenario keys round-trip", () => {
    const ruiny = allScenarios.find((s) => s.name === "Ruiny");
    expect(findScenario(scenarioKey(ruiny))).toBe(ruiny);
  });
});

describe("pairings", () => {
  const seq = (values) => {
    let i = 0;
    return () => values[i++ % values.length];
  };

  test("everyone plays once and odd players get a bye", () => {
    const { pairs, bye } = generatePairings(["a", "b", "c", "d", "e"], [], seq([0.1, 0.7, 0.3, 0.9]));
    expect(pairs).toHaveLength(2);
    expect(new Set([...pairs.flat(), bye]).size).toBe(5);
  });

  test("repeat opponents are avoided when possible", () => {
    const games = [
      { round: 1, players: ["a", "b"] },
      { round: 1, players: ["c", "d"] },
    ];
    for (let i = 0; i < 20; i++) {
      const { repeats, pairs } = generatePairings(["a", "b", "c", "d"], games);
      expect(repeats).toBe(0);
      pairs.forEach((p) => expect(playedPairs(games).has([...p].sort().join("|"))).toBe(false));
    }
  });

  test("the bye goes to someone who hasn't had one", () => {
    const games = [{ round: 1, players: ["a"], bye: true }];
    for (let i = 0; i < 20; i++) expect(generatePairings(["a", "b", "c"], games).bye).not.toBe("a");
  });

  test("rounds are numbered after the highest one", () => {
    expect(nextRound([])).toBe(1);
    expect(nextRound([{ round: 1 }, { round: 3 }])).toBe(4);
  });
});

describe("scenario picker", () => {
  test("typed rolls pick the scenario", () => {
    const onPick = jest.fn();
    render(<ScenarioPicker onPick={onPick} onCancel={() => {}} />);
    fireEvent.click(screen.getByRole("tab", { name: "Wpisz swoje rzuty" }));
    fireEvent.change(screen.getByLabelText("K6 obszar"), { target: { value: "3" } });
    fireEvent.change(screen.getByLabelText("K66 dziesiątki"), { target: { value: "1" } });
    fireEvent.change(screen.getByLabelText("K66 jedności"), { target: { value: "5" } });
    fireEvent.click(screen.getByRole("button", { name: "Ustaw scenariusz" }));
    expect(onPick).toHaveBeenCalledWith(
      expect.objectContaining({ name: "Ruiny", area: "inside", code: 15, source: "player-roll" }),
    );
  });

  test("a custom scenario keeps its name", () => {
    const onPick = jest.fn();
    render(<ScenarioPicker onPick={onPick} onCancel={() => {}} />);
    fireEvent.click(screen.getByRole("tab", { name: "Własny" }));
    fireEvent.change(screen.getByLabelText("Nazwa scenariusza"), { target: { value: "Most na Reiku" } });
    fireEvent.click(screen.getByRole("button", { name: "Ustaw scenariusz" }));
    expect(onPick).toHaveBeenCalledWith(expect.objectContaining({ name: "Most na Reiku", source: "custom" }));
  });
});

describe("rounds section", () => {
  const campaign = { id: "c1", members: ["u1", "u2", "u3"], ownerId: "u1", settings: { optionalRules: ["MGŁA WOJNY"] } };
  const names = { u1: "Ania", u2: "Bartek", u3: "Celina" };
  const act = (fn) => Promise.resolve(fn()).then(() => true);
  const games = [
    { id: "g1", round: 1, players: ["u2", "u3"], status: "planned", optionalRules: ["MGŁA WOJNY"] },
    { id: "g2", round: 1, players: ["u1"], bye: true, status: "bye" },
  ];

  test("a player of the game can record its result; others can't", () => {
    const { rerender } = render(
      <RoundsSection campaign={campaign} games={games} names={names} user={{ uid: "u2" }} isOrganizer={false} act={act} />,
    );
    expect(screen.getByText("Ania")).not.toBeNull();
    expect(screen.getByText(/pauzuje/)).not.toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Wpisz wynik" }));
    const select = screen.getByLabelText("Wynik");
    fireEvent.change(select, { target: { value: "u3" } });
    fireEvent.click(screen.getByRole("button", { name: "Zapisz wynik" }));
    expect(service.recordResult).toHaveBeenCalledWith("c1", "g1", { winner: "u3", notes: "" }, { uid: "u2" });

    rerender(<RoundsSection campaign={campaign} games={games} names={names} user={{ uid: "u1x" }} isOrganizer={false} act={act} />);
    expect(screen.queryByRole("button", { name: "Wpisz wynik" })).toBeNull();
  });

  test("the organizer previews and saves a new round", async () => {
    render(<RoundsSection campaign={campaign} games={games} names={names} user={{ uid: "u1" }} isOrganizer act={act} />);
    fireEvent.click(screen.getByRole("button", { name: /Generuj pary: runda 2/ }));
    const save = screen.getByRole("button", { name: "Zapisz rundę 2" });
    const preview = save.closest(".hub-editor");
    expect(within(preview).getAllByRole("listitem")).toHaveLength(2); // one pair + one bye
    fireEvent.click(save);
    expect(service.createRound).toHaveBeenCalledWith(campaign, 2, expect.any(Array), expect.any(String));
  });
});
