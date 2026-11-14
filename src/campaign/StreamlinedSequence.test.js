import React from "react";
import { render, screen, fireEvent, waitFor, cleanup, act } from "@testing-library/react";
import CampaignManager from "./CampaignManager";
import useCampaignDraft from "./useCampaignDraft";
import * as R from "./rules";
import { myCurrentGame } from "../campaignHub/CampaignPage";

// Campaign games read their events from Firestore when the sequence opens.
jest.mock("../campaignHub/campaignService", () => ({
  ...jest.requireActual("../campaignHub/campaignService"),
  getGameEvents: jest.fn(() => Promise.resolve(null)),
  watchGame: jest.fn(),
}));
// CRA resets mock implementations before each test.
beforeEach(() => {
  const service = require("../campaignHub/campaignService");
  service.getGameEvents.mockImplementation(() => Promise.resolve(null));
  // Both players of a campaign game declare their loot sale in the game.
  service.watchGame.mockImplementation((c, g, cb) => {
    cb({ players: ["me", "op"], lootSales: { me: 0, op: 2 } });
    return () => {};
  });
});

const OWNER = "streamlined-qa";
const hero = (extra = {}) => ({
  uniqueId: "hero", unitName: "Herszt", type: "Bohater", selectedNumber: 1,
  number: 1, cost: 55, totalCost: 55, exp: 20, skills: [0, 1], rules: ["Dowódca"],
  startingEquipment: ["Sztylet"], optionalEquipment: [],
  equipmentList: { Sztylet: [2, 0], Miecz: [10, 0] },
  stats: { Początkowa: [4, 4, 4, 3, 3, 2, 4, 1, 8], Maksymalna: [5, 6, 6, 4, 4, 3, 6, 4, 9] },
  battleAbsentModels: [false], battleOutOfActionModels: [false], ...extra,
});
const group = (id, out) =>
  hero({ uniqueId: id, unitName: `Stronnik ${id}`, type: "Stronnik", exp: 0, rules: [],
    battleOutOfActionModels: [out] });
const army = { name: "Gang przemytników", heroes: { Herszt: hero() }, maxModels: 15 };
const click = (name) => fireEvent.click(screen.getByRole("button", { name, exact: true }));

function setup(units = [hero()], { battle = {}, notes = {}, finish, stage } = {}) {
  const campaignNotes = { skarbiec: 100, ...notes };
  const started = R.beginPostBattle(
    { ...R.newBattle(units), gameName: "QA", ...battle }, units, campaignNotes, army);
  campaignNotes.campaign = {
    activeBattle: stage ? { ...started, stage } : started,
    history: [],
  };
  localStorage.setItem(`warheim:draft:${OWNER}`, JSON.stringify({
    owner: OWNER, army: army.name, armyName: "QA", unitList: units, campaignNotes }));
  const state = {};
  const onFinish = finish || jest.fn().mockResolvedValue(undefined);
  function Harness() {
    const [draft, setField] = useCampaignDraft(OWNER);
    state.draft = draft;
    return (
      <CampaignManager unitList={draft.unitList} setUnitList={(v) => setField("unitList", v)}
        army={army} campaignNotes={draft.campaignNotes}
        setCampaignNotes={(v) => setField("campaignNotes", v)} onFinish={onFinish} />
    );
  }
  render(<Harness />);
  return { state, onFinish };
}
const battle = (state) => state.draft.campaignNotes.campaign.activeBattle;

beforeEach(() => localStorage.clear());
afterEach(cleanup);

test("one tap rolls every injury and the main button applies them and moves on", () => {
  const { state } = setup([hero(), group("a", true), group("b", true)]);
  click("Rzuć za wszystkich");
  // App-rolled dice are locked on each card.
  expect(screen.getAllByRole("button", { name: "Wynik zapisany" })).toHaveLength(2);
  click("Zastosuj obrażenia (2) i dalej");
  expect(Object.keys(battle(state).post.injuries)).toHaveLength(2);
  expect(battle(state).stage).toBe(2);
});

test("each confirmation step takes a single click", () => {
  const { state } = setup();
  click("Dalej: Doświadczenie i rozwój");
  click("Nalicz doświadczenie i dalej");
  expect(battle(state).post.expApplied).toBe(true);
  click("Zatwierdź punkty i dalej");
  expect(battle(state).post.campaignPointsApplied).toBe(true);
  fireEvent.change(screen.getByLabelText("Eksploracja, kość 1"), { target: { value: "4" } });
  click("Zatwierdź eksplorację i dalej");
  expect(battle(state).post.explorationApplied).toBe(true);
  expect(battle(state).stage).toBe(5);
  expect(screen.queryByRole("button", { name: "Zatwierdź eksplorację" })).toBeNull();
});

test("a step chip ahead never makes the player's decisions for later steps", () => {
  const { state } = setup([hero()], { notes: { kosztownosci: 2 } });
  // The step picker jumps ahead.
  fireEvent.change(screen.getByLabelText("Etap kampanii"), { target: { value: "5" } });
  // Jumping ahead stops at the first step that still needs the player.
  expect(battle(state).stage).toBe(2);
  expect(battle(state).post.expApplied).toBeFalsy();
  expect(screen.getByRole("alert").textContent).toMatch(/Doświadczenie i rozwój: Nalicz PD/);
});

test("jumping forward confirms only the current step and stops at the next open one", () => {
  const { state } = setup();
  click("Dalej: Doświadczenie i rozwój");
  fireEvent.change(screen.getByLabelText("Etap kampanii"), { target: { value: "11" } });
  expect(battle(state).post.expApplied).toBe(true);
  expect(battle(state).post.campaignPointsApplied).toBeFalsy();
  expect(battle(state).stage).toBe(3);
  expect(screen.getByRole("alert").textContent).toMatch(/Punkty kampanii: Zatwierdź punkty kampanii/);
});

test("optional steps can be skipped straight to the summary", () => {
  const { state } = setup([hero()], { notes: { kosztownosci: 2 } });
  click("Dalej: Doświadczenie i rozwój");
  click("Nalicz doświadczenie i dalej");
  click("Zatwierdź punkty i dalej");
  fireEvent.change(screen.getByLabelText("Eksploracja, kość 1"), { target: { value: "4" } });
  click("Zatwierdź eksplorację i dalej");
  fireEvent.click(screen.getByRole("button", { name: "Więcej łupów" }));
  const sell = screen.getByRole("button", { name: /^Sprzedaj 1 za \d+ zk i dalej$/ });
  fireEvent.click(sell);
  expect(battle(state).post.lootSold).toBe(true);
  expect(battle(state).post.loot).toBe(2);
  expect(battle(state).stage).toBe(6);
  click("Pomiń do podsumowania");
  expect(battle(state).stage).toBe(11);
  // The pool for trading was still drawn up on the way.
  expect(battle(state).post.availability).toBeTruthy();
});

test("a campaign game starts folded and its finish links back to the campaign", async () => {
  const finish = jest.fn().mockResolvedValue({ campaignId: "c1", uploaded: true });
  const units = [hero()];
  const campaignNotes = { skarbiec: 100, campaign: { history: [], activeBattle: {
    ...R.newBattle(units), gameName: "Kampania · runda 1", opponent: "Kasia",
    scenario: "Most", result: "win", round: 6, campaignGame: { campaignId: "c1", gameId: "g1", owner: "me" } } } };
  localStorage.setItem(`warheim:draft:${OWNER}`, JSON.stringify({
    owner: OWNER, army: army.name, armyName: "QA", unitList: units, campaignNotes }));
  const state = {};
  function Harness() {
    const [draft, setField] = useCampaignDraft(OWNER);
    state.draft = draft;
    return (
      <CampaignManager unitList={draft.unitList} setUnitList={(v) => setField("unitList", v)}
        army={army} campaignNotes={draft.campaignNotes}
        setCampaignNotes={(v) => setField("campaignNotes", v)} onFinish={finish} />
    );
  }
  render(<Harness />);
  expect(screen.getByText("Gra z kampanii")).toBeTruthy();
  expect(screen.getByText("Most · vs Kasia · Zwycięstwo · runda 6")).toBeTruthy();
  expect(screen.getByText("Popraw dane potyczki")).toBeTruthy();
  click("Rozpocznij sekwencję po potyczce");
  click("Dalej: Doświadczenie i rozwój");
  click("Nalicz doświadczenie i dalej");
  click("Zatwierdź punkty i dalej");
  // A win adds a die to the pool; no doubles, so no encounter to settle.
  fireEvent.change(screen.getByLabelText("Eksploracja, kość 1"), { target: { value: "1" } });
  fireEvent.change(screen.getByLabelText("Eksploracja, kość 2"), { target: { value: "3" } });
  click("Zatwierdź eksplorację i dalej");
  // The opponent's declared sale fills Nadpodaż.
  await waitFor(() => expect(screen.getByText(/Przeciwnik: 2 łupów/)).toBeTruthy());
  click("Bez sprzedaży łupów, dalej");
  click("Pomiń do podsumowania");
  click("Zapisz rozliczenie i zakończ potyczkę");
  await waitFor(() => expect(state.draft.campaignNotes.campaign.activeBattle).toBeNull());
  expect(finish.mock.calls[0][0].campaignGame).toEqual({ campaignId: "c1", gameId: "g1", owner: "me" });
  expect(screen.getByText("Rozpiska w kampanii została zaktualizowana.")).toBeTruthy();
  expect(screen.getByRole("link", { name: "Wróć do kampanii" }).getAttribute("href")).toBe("/campaigns/c1");
});

test("the campaign page leads with the player's game in the latest round", () => {
  const games = [
    { id: "1", round: 1, players: ["a", "b"], status: "done" },
    { id: "2", round: 2, players: ["c", "a"], status: "planned" },
    { id: "3", round: 2, players: ["b", "d"], status: "planned" },
    { id: "4", round: 3, players: ["a"], bye: true, status: "bye" },
  ];
  expect(myCurrentGame(games, "a").id).toBe("2");
  expect(myCurrentGame(games, "d").id).toBe("3");
  expect(myCurrentGame(games, "z")).toBeNull();
});

test("Głód trzewi and Szał change the loot sale without a manual modifier", () => {
  const glutton = hero({ uniqueId: "g", unitName: "Ghul", type: "Stronnik", exp: 0,
    rules: ["Głód trzewi"], selectedNumber: 3, battleOutOfActionModels: [false, false, false],
    battleAbsentModels: [false, false, false] });
  const berserk = hero({ uniqueId: "s", unitName: "Berserk", type: "Stronnik", exp: 0,
    rules: ["Szał"], selectedNumber: 2, battleOutOfActionModels: [false, false],
    battleAbsentModels: [false, false] });
  const { lootQuote } = require("./LootSale");
  const b = { ...R.newBattle([hero(), glutton, berserk]) };
  const post = R.beginPostBattle(b, [hero(), glutton, berserk], { kosztownosci: 3 }, army).post;
  post.lootDraft = { quantity: 3 };
  const base = lootQuote(b, post);
  expect(base.models).toBe(6);
  post.lootDraft = { quantity: 3, devoured: true, frenzy: { s: 5 } };
  const q = lootQuote(b, post);
  // Szał: two models in frenzy (capped at the group) count twice.
  expect(q.models).toBe(8);
  expect(q.notes).toEqual(expect.arrayContaining([
    "Głód trzewi: −1 poziom liczebności", "Szał: +2 do liczby modeli"]));
  expect(q.gold).toBe(R.income(3, 8, 2, 3, -1));
});

test("the experience step names every source of PD and applies exactly that sum", () => {
  const h = hero({ battleKills: 2, battleExp: 3,
    battleExpParts: [{ label: "Zwycięstwo (DOWÓDCA)", pd: 1 }] });
  const post = R.beginPostBattle(R.newBattle([h]), [h], {}, army).post;
  post.underdog = { exp: 1 };
  const parts = R.experienceBreakdown(post, post.units[0]);
  expect(parts).toEqual([
    { label: "Przeżycie", pd: 1 },
    { label: "Żółtodzioby", pd: 1 },
    { label: "Wrogowie WzA", pd: 2 },
    { label: "Zwycięstwo (DOWÓDCA)", pd: 1 },
    { label: "Scenariusz, zdarzenia", pd: 2 },
  ]);
  expect(R.typedBattleExp(post.units[0])).toBe(2);
  R.applyExperience(post);
  expect(post.units[0].exp).toBe(27);
  expect(post.expBreakdown.hero).toMatchObject({ from: 20, to: 27 });
});

test("treasure markers from the battle give PD at the start and loot with the exploration", () => {
  const units = [hero({ battleTreasure: 2 })];
  const notes = { skarbiec: 100, kosztownosci: 0, campaign: { history: [], activeBattle: {
    ...R.newBattle(units), gameName: "Ruiny", scenarioRecord: { key: "inside:15:Ruiny", name: "Ruiny", area: "inside" } } } };
  localStorage.setItem(`warheim:draft:${OWNER}`, JSON.stringify({ owner: OWNER, army: army.name, armyName: "QA", unitList: units, campaignNotes: notes }));
  const state = {};
  function Harness() {
    const [draft, setField] = useCampaignDraft(OWNER);
    state.draft = draft;
    return <CampaignManager unitList={draft.unitList} setUnitList={(v) => setField("unitList", v)} army={army}
      campaignNotes={draft.campaignNotes} setCampaignNotes={(v) => setField("campaignNotes", v)} onFinish={jest.fn()} />;
  }
  render(<Harness />);
  click("Rozpocznij sekwencję po potyczce");
  click("Dalej: Doświadczenie i rozwój");
  expect(screen.getByText(/\+2 znaczniki kosztowności/)).toBeTruthy();
  click("Nalicz doświadczenie i dalej");
  expect(battle(state).post.units[0].exp).toBe(23);
  click("Zatwierdź punkty i dalej");
  expect(screen.getByText(/Razem: \+2 łupy/)).toBeTruthy();
  fireEvent.change(screen.getByLabelText("Eksploracja, kość 1"), { target: { value: "4" } });
  click("Zatwierdź eksplorację i dalej");
  // One die without doubles finds 0 loot in the pool; the markers add 2.
  expect(battle(state).post.loot).toBe(2 + R.explorationResult([4], "inside", 0).loot);
});

test("after Zaraza every model on the table takes a WT test before moving on", () => {
  const plague = { events: [{ code: 61, area: "inside", name: "Zaraza" }] };
  const { state } = setup([hero(), group("a", false)], { battle: plague });
  click("Dalej: Doświadczenie i rozwój");
  expect(battle(state).stage).toBe(1);
  expect(screen.getByText(/Rozstrzygnij skutki zarazy/)).toBeTruthy();
  fireEvent.change(screen.getAllByLabelText("Test WT, kość 1")[0], { target: { value: "2" } });
  fireEvent.click(screen.getAllByRole("button", { name: "Zatwierdź" })[0]);
  fireEvent.click(screen.getByRole("button", { name: "Nie było go na stole" }));
  expect(battle(state).post.plague["hero:0"].result).toBe("passed");
  expect(battle(state).post.plague["a:0"].result).toBe("absent");
  click("Dalej: Doświadczenie i rozwój");
  expect(battle(state).stage).toBe(2);
});

test("a sequence from a campaign game is cancelled without touching the game", () => {
  const { state } = setup([hero()], { battle: { campaignGame: { campaignId: "c", gameId: "g" } } });
  const confirm = jest.spyOn(window, "confirm").mockReturnValue(true);
  click("Anuluj sekwencję");
  expect(confirm.mock.calls[0][0]).toMatch(/Gra w kampanii i jej wynik zostają/);
  expect(state.draft.campaignNotes.campaign.activeBattle).toBeNull();
  confirm.mockRestore();
});

test("a sequence started before the plague step still gets it on a later step", () => {
  const plague = { events: [{ code: 61, area: "inside", name: "Zaraza" }] };
  const { state } = setup([hero()], { battle: plague, stage: 4 });
  expect(battle(state).stage).toBe(4);
  expect(screen.getByRole("region", { name: "Zaraza" })).toBeTruthy();
  fireEvent.change(screen.getByLabelText("Test WT, kość 1"), { target: { value: "6" } });
  fireEvent.change(screen.getByLabelText("Skutek zarazy, kość 1"), { target: { value: "3" } });
  click("Zatwierdź");
  expect(battle(state).post.plague["hero:0"].result).toBe("skip");
  expect(screen.queryByRole("region", { name: "Zaraza" })).toBeNull();
});

test("in a campaign game the sale waits for the opponent's declaration", async () => {
  const service = require("../campaignHub/campaignService");
  let push;
  service.watchGame.mockImplementation((c, g, cb) => {
    push = cb;
    cb({ players: ["me", "op"], lootSales: {} });
    return () => {};
  });
  const { state } = setup([hero()], { battle: { campaignGame: { campaignId: "c1", gameId: "g1", owner: "me" } }, stage: 5 });
  expect(await screen.findByText(/Przeciwnik: czekam na zgłoszenie/)).toBeTruthy();
  click("Dalej: Doświadczeni stronnicy");
  expect(battle(state).stage).toBe(5);
  expect(screen.getAllByText(/Zgłoś przeciwnikowi/).length).toBeGreaterThan(0);
  // Declarations arrive from Firestore: mine, then the opponent's.
  await act(async () => push({ players: ["me", "op"], lootSales: { me: 0 } }));
  expect(screen.getAllByText(/Czekam, aż przeciwnik wpisze/).length).toBeGreaterThan(0);
  await act(async () => push({ players: ["me", "op"], lootSales: { me: 0, op: 7 } }));
  expect(battle(state).othersSold).toBe(7);
  click("Bez sprzedaży łupów, dalej");
  expect(battle(state).post.lootSold).toBe(true);
});
