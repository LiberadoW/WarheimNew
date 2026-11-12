import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import armies from "../Data.js/Armies";
import { createUnit } from "../Functions/createUnit";
import { AuthContext } from "../Context/AuthContext";
import {
  activePdRules,
  companyModels,
  countOut,
  modelState,
  pdSummary,
  randomEventFor,
  toBattle,
} from "./gamePlay";
import GamePage from "./GamePage";
import * as service from "./campaignService";

const heroes = armies["Cyrkowcy z Ligii Ostermarku"].heroes;
const unit = (name, extra = {}) => ({ ...createUnit(heroes, name), ...extra });
const mecenas = unit("Mecenas", { uniqueId: "m1", exp: 20 });
const magister = unit("Magister Magii", { uniqueId: "mag" });
const cyrkowcy = unit("Cyrkowiec", { uniqueId: "cy", selectedNumber: 3 });
const ogr = unit("Ogr", { uniqueId: "ogr", campaignModelStatus: [{ skip: 1 }] });
const armyA = [mecenas, magister, cyrkowcy, ogr];

describe("game state", () => {
  const play = {
    round: 7,
    units: {
      a: {
        m1: { kills: 2, extraPd: 1, treasure: 1 },
        cy: { out: { 1: true }, absent: { 2: true } },
      },
    },
  };

  test("model states come from the play map and earlier injuries", () => {
    expect(modelState(play, "a", cyrkowcy, 0)).toBe("in");
    expect(modelState(play, "a", cyrkowcy, 1)).toBe("out");
    expect(modelState(play, "a", cyrkowcy, 2)).toBe("absent");
    expect(modelState(play, "a", ogr, 0)).toBe("unavailable");
    expect(countOut(play, "a", armyA)).toBe(1);
    expect(companyModels([cyrkowcy], "a").map((m) => m.label)).toEqual([
      "Cyrkowiec #1",
      "Cyrkowiec #2",
      "Cyrkowiec #3",
    ]);
  });

  test("optional-rule PD: heroes, mages, and Nagła śmierć only after 6 rounds", () => {
    const rules = ["MGŁA WOJNY", "NAGŁA ŚMIERĆ", "ZMIENNE WIATRY MAGII", "KRYTYCZNY PECH"];
    expect(activePdRules(rules, 5)).toEqual(["MGŁA WOJNY", "ZMIENNE WIATRY MAGII"]);
    const rows = pdSummary(armyA, { ...play, round: 7 }, "a", { optionalRules: rules });
    const by = Object.fromEntries(rows.map((r) => [r.unitId, r]));
    expect(by.m1).toMatchObject({ kills: 2, extra: 1, rules: 2, total: 5 });
    expect(by.mag).toMatchObject({ rules: 3, total: 3 });
    expect(by.cy).toBeUndefined(); // henchmen: no optional-rule PD, kills don't count
  });

  test("random events resolve K66 ranges", () => {
    expect(randomEventFor("outside", 23).name).toBe("Leśne licho");
    expect(randomEventFor("inside", 11).name).toBe("Ochroniarz");
    expect(randomEventFor(undefined, 11)).toBeNull();
  });

  test("hand-off fills the play view's battle fields", () => {
    const game = {
      id: "g1",
      round: 2,
      players: ["a", "b"],
      optionalRules: ["MGŁA WOJNY"],
      scenario: { name: "Ruiny", area: "inside" },
      result: { winner: "a" },
    };
    // Ruiny is a rulebook scenario: the winning leader gets +1.
    game.scenario.key = "inside:15:Ruiny";
    const { units, battle } = toBattle({
      savedList: { armyList: armyA },
      play,
      owner: "a",
      game,
      opponentName: "Bartek",
      opponentList: { armyList: [unit("Mecenas", { uniqueId: "x" })], prestige: 40 },
      campaignName: "Jesień",
    });
    const m = units.find((u) => u.uniqueId === "m1");
    expect(m).toMatchObject({ battleKills: 2, battleExp: 3, battleTreasure: 1 }); // +1 extra, +1 Mgła wojny, +1 zwycięstwo
    // The named sources travel with the unit; the +1 typed on the game screen stays unnamed.
    expect(m.battleExpParts).toEqual([
      { label: "Mgła wojny", pd: 1 },
      { label: "Zwycięstwo (DOWÓDCA)", pd: 1 },
    ]);
    const c = units.find((u) => u.uniqueId === "cy");
    expect(c.battleOutOfActionModels).toEqual([false, true, false]);
    expect(c.battleAbsentModels).toEqual([false, false, true]);
    expect(units.find((u) => u.uniqueId === "ogr").battleAbsentModels).toEqual([true]);
    expect(battle).toMatchObject({
      gameName: "Jesień · runda 2",
      opponent: "Bartek",
      scenario: "Ruiny",
      area: "inside",
      result: "win",
      round: 7,
      opponentModels: 1,
      opponentPrestige: 40,
      stage: 0,
    });
    // The saved list itself is not changed.
    expect(mecenas.battleKills).toBeUndefined();
  });
});

jest.mock("./campaignService", () => {
  const actual = jest.requireActual("./campaignService");
  return {
    ...actual,
    watchCampaign: jest.fn(),
    watchGame: jest.fn(),
    watchCampaignLists: jest.fn(),
    recordTakedown: jest.fn(() => Promise.resolve()),
    addLogEntry: jest.fn(() => Promise.resolve()),
    setModelState: jest.fn(() => Promise.resolve()),
    changeCounter: jest.fn(() => Promise.resolve()),
    recordResult: jest.fn(() => Promise.resolve()),
    getMySavedLists: jest.fn(),
  };
});

describe("game screen", () => {
  const campaign = { id: "c1", name: "Jesień", ownerId: "a", members: ["a", "b"], memberNames: { a: "Ania", b: "Bartek" } };
  const listB = { armyName: "Banda B", armyType: "Cyrkowcy z Ligii Ostermarku", armyList: [unit("Szarlatan", { uniqueId: "sz" })], prestige: 30 };
  const listA = { armyName: "Banda A", armyType: "Cyrkowcy z Ligii Ostermarku", armyList: armyA, prestige: 80 };
  const setup = (game, extra = {}) => {
    service.watchCampaign.mockImplementation((id, cb) => { cb(campaign); return () => {}; });
    service.watchGame.mockImplementation((id, gid, cb) => { cb(game); return () => {}; });
    service.watchCampaignLists.mockImplementation((id, cb) => { cb({ a: listA, b: listB }); return () => {}; });
    const setters = { setUnitList: jest.fn(), setArmy: jest.fn(), setArmyName: jest.fn(), setCampaignNotes: jest.fn() };
    render(
      <AuthContext.Provider value={{ currentUser: { user: { uid: "a" } } }}>
        <MemoryRouter initialEntries={["/campaigns/c1/games/g1"]}>
          <Routes>
            <Route path="/campaigns/:id/games/:gameId" element={<GamePage {...setters} {...extra} />} />
            <Route path="/play" element={<p>tryb gry</p>} />
          </Routes>
        </MemoryRouter>
      </AuthContext.Provider>,
    );
    return setters;
  };
  const baseGame = {
    id: "g1",
    campaignId: "c1",
    round: 1,
    players: ["a", "b"],
    status: "planned",
    scenario: { key: null, name: "Ruiny", area: "inside" },
    optionalRules: ["ZDARZENIA LOSOWE"],
    play: { round: 3 },
  };

  test("records who took out whom, with the kill for a hero", async () => {
    setup(baseGame);
    fireEvent.change(screen.getByLabelText("Wyłączony z akcji"), { target: { value: "b|sz|0" } });
    fireEvent.change(screen.getByLabelText("Przez"), { target: { value: "a|m1|0" } });
    fireEvent.click(screen.getByRole("button", { name: "Zapisz" }));
    await waitFor(() => expect(service.recordTakedown).toHaveBeenCalled());
    expect(service.recordTakedown).toHaveBeenCalledWith("c1", "g1", {
      round: 3,
      victim: { owner: "b", unitId: "sz", index: 0 },
      killer: { owner: "a", unitId: "m1", index: 0, counts: true },
      text: "Mecenas (Ania) wyłącza z akcji: Szarlatan (Bartek)",
    });
  });

  test("a typed K66 shows the random event from the scenario's table", () => {
    setup(baseGame);
    expect(screen.getByText(/Tabela: Wewnątrz murów/)).not.toBeNull();
    fireEvent.change(screen.getAllByLabelText("K66 dziesiątki")[0], { target: { value: "1" } });
    fireEvent.change(screen.getAllByLabelText("K66 jedności")[0], { target: { value: "1" } });
    expect(screen.getByText("(11) Ochroniarz")).not.toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Zapisz w przebiegu" }));
    expect(service.addLogEntry).toHaveBeenCalledWith("c1", "g1", expect.objectContaining({ type: "event", code: 11, area: "inside" }));
  });

  test("after the game a player sends their company to the post-battle sequence", async () => {
    service.getMySavedLists.mockResolvedValue([{ ...listA, campaignNotes: {} }]);
    const setters = setup({ ...baseGame, status: "done", result: { winner: "b", rounds: 3 } });
    fireEvent.click(screen.getByRole("button", { name: "Sekwencja po potyczce mojej kompanii" }));
    await screen.findByText("tryb gry");
    expect(setters.setArmyName).toHaveBeenCalledWith("Banda A");
    const notes = setters.setCampaignNotes.mock.calls[0][0];
    expect(notes.campaign.activeBattle).toMatchObject({ opponent: "Bartek", result: "loss", scenario: "Ruiny" });
  });

  test("a settled sequence is not offered again", () => {
    setup({ ...baseGame, status: "done", result: { winner: "b" }, sequenceDone: { a: { entryId: "e1" } } });
    expect(screen.getByText(/jest już rozliczona/)).not.toBeNull();
    expect(screen.queryByRole("button", { name: /Sekwencja po potyczce/ })).toBeNull();
  });

  test("the saved list's history blocks settling the same game twice", async () => {
    service.getMySavedLists.mockResolvedValue([
      { ...listA, campaignNotes: { campaign: { history: [{ id: "e1", campaignGame: { campaignId: "c1", gameId: "g1" } }] } } },
    ]);
    const setters = setup({ ...baseGame, status: "done", result: { winner: "b" } });
    fireEvent.click(screen.getByRole("button", { name: "Sekwencja po potyczce mojej kompanii" }));
    expect(await screen.findByText(/została już rozliczona/)).not.toBeNull();
    expect(setters.setCampaignNotes).not.toHaveBeenCalled();
  });

  test("an unfinished sequence of this game is resumed, not replaced", async () => {
    const setters = setup(
      { ...baseGame, status: "done", result: { winner: "b" } },
      { campaignNotes: { campaign: { activeBattle: { stage: 3, campaignGame: { campaignId: "c1", gameId: "g1" } } } } },
    );
    fireEvent.click(screen.getByRole("button", { name: "Wróć do sekwencji po potyczce" }));
    await screen.findByText("tryb gry");
    expect(setters.setCampaignNotes).not.toHaveBeenCalled();
  });
});

describe("both players settle from the same snapshot", () => {
  const play = { round: 5, units: { b: { sz: { out: { 0: true } } } } };
  const listB = { armyList: [unit("Szarlatan", { uniqueId: "sz" }), unit("Cyrkowiec", { uniqueId: "c2", selectedNumber: 2 })], prestige: 60 };
  const game = { id: "g9", campaignId: "c1", round: 3, players: ["a", "b"], status: "done", result: { winner: "a" }, scenario: { name: "Most" } };

  test("the snapshot counts models, those out of action and prestige before the fight", () => {
    const { companySnapshot } = require("./gamePlay");
    expect(companySnapshot(listB, play, "b")).toEqual({ models: 3, out: 1, prestige: 60 });
  });

  test("a later hand-off uses the snapshot, not the opponent's re-uploaded list", () => {
    // B settled first: Szarlatan died and the list was uploaded with a new prestige.
    const afterB = { armyList: [unit("Cyrkowiec", { uniqueId: "c2", selectedNumber: 2 })], prestige: 45 };
    const { battle } = toBattle({
      savedList: { armyList: armyA }, play, owner: "a",
      game: { ...game, before: { b: { models: 3, out: 1, prestige: 60 } } },
      opponentName: "Bartek", opponentList: afterB, campaignName: "Jesień",
    });
    expect(battle).toMatchObject({ opponentModels: 3, opponentOut: 1, opponentPrestige: 60 });
  });

  test("the settlement line names who has settled", () => {
    const { settlementLine } = require("./gamePlay");
    expect(settlementLine({ players: ["a", "b"], sequenceDone: { b: {} } }, { a: "Ania", b: "Bartek" }))
      .toBe("Ania: czeka · Bartek: rozliczona");
  });
});
