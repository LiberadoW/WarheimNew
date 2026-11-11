import React from "react";
import { render, screen, fireEvent, within, waitFor, cleanup } from "@testing-library/react";
import CampaignManager from "./CampaignManager";
import useCampaignDraft from "./useCampaignDraft";
import * as R from "./rules";

const OWNER = "sequence-qa";
const hero = (extra = {}) => ({
  uniqueId: "hero", unitName: "Herszt", type: "Bohater", selectedNumber: 1,
  number: 1, cost: 55, totalCost: 55, exp: 20, skills: [0, 1], rules: ["Dowódca"],
  startingEquipment: ["Sztylet"], optionalEquipment: [],
  equipmentList: { Sztylet: [2, 0], Miecz: [10, 0] },
  stats: { Początkowa: [4,4,4,3,3,2,4,1,8], Maksymalna: [5,6,6,4,4,3,6,4,9] },
  battleAbsentModels: [false], battleOutOfActionModels: [false], ...extra,
});
const army = { name: "Gang przemytników", heroes: { Herszt: hero() }, maxModels: 15 };
const button = (name, scope = screen) => scope.getByRole("button", { name, exact: true });
const click = (name, scope = screen) => fireEvent.click(button(name, scope));
const change = (label, value, scope = screen) => fireEvent.change(scope.getByLabelText(label), { target: { value: String(value) } });
const dice = (label, values, scope = screen) => values.forEach((v,i) => change(`${label}, kość ${i+1}`, v, scope));
const card = (heading) => within(screen.getByRole("heading", {name: heading, exact: true}).closest("article"));

function setup(units = [hero()], extraNotes = {}, prepared = true) {
  const notes = { skarbiec: 100, ...extraNotes };
  if (prepared) notes.campaign = { ...notes.campaign, activeBattle: R.beginPostBattle(
    { ...R.newBattle(units), gameName: "QA o most" }, units, notes, army), history: [] };
  localStorage.setItem(`warheim:draft:${OWNER}`, JSON.stringify({ owner: OWNER, army: army.name,
    armyName: "QA", unitList: units, campaignNotes: notes }));
  const state = {}, finish = jest.fn().mockResolvedValue(undefined);
  function Harness() {
    const [draft, setField] = useCampaignDraft(OWNER);
    state.draft = draft;
    return <CampaignManager unitList={draft.unitList} setUnitList={(v) => setField("unitList",v)}
      army={army} campaignNotes={draft.campaignNotes} setCampaignNotes={(v) => setField("campaignNotes",v)} onFinish={finish} />;
  }
  let view = render(<Harness />);
  return { state, finish, resume: () => { view.unmount(); view = render(<Harness />); } };
}
const post = (state) => state.draft.campaignNotes.campaign.activeBattle.post;
function experienceToExploration(checkExperience = () => {}) {
  click("Dalej: Doświadczenie i rozwój");
  checkExperience();
  click("Nalicz doświadczenie i dalej");
  click("Zatwierdź punkty i dalej");
}
// From the loot sale: sell nothing, skip the optional steps and save.
function completeRemaining() {
  click("Bez sprzedaży łupów, dalej");
  click("Pomiń do podsumowania");
  click("Zapisz rozliczenie i zakończ potyczkę");
}
beforeEach(() => localStorage.clear());
afterEach(() => { cleanup(); jest.restoreAllMocks(); });

test("injuries, a group casualty, an absent hero and an animal survive resume and finalize exactly once", async () => {
  const units = [hero(), hero({ uniqueId:"group", unitName:"Stronnicy", type:"Stronnik", exp:0,
    selectedNumber:3, number:5, battleOutOfActionModels:[true,true,false], battleAbsentModels:[false,false,false] }),
    hero({ uniqueId:"beast", unitName:"Squig", type:"Stronnik", rules:["Zwierzę"], exp:0 }),
    hero({ uniqueId:"absent", unitName:"Nieobecny", battleAbsentModels:[true] })];
  const {state, resume, finish} = setup(units);
  click("Dalej: Doświadczenie i rozwój");
  expect(screen.getByRole("alert").textContent).toMatch(/obrażenia/);
  dice("Obrażenia", [1], card("Stronnicy #1")); click("Zastosuj obrażenia",card("Stronnicy #1"));
  resume();
  expect(card("Stronnicy #1").getByText(/poległy/).textContent).toMatch(/poległy/);
  dice("Obrażenia", [3], card("Stronnicy #2")); click("Zastosuj obrażenia",card("Stronnicy #2"));
  experienceToExploration(() => {
    expect(screen.queryByLabelText("Dodatkowe PD: Squig")).toBeNull();
    expect(screen.getByText("Nie zdobywa PD")).toBeTruthy();
  });
  expect(post(state).units.find(u=>u.uniqueId==="beast").exp).toBe(0);
  expect(post(state).units.find(u=>u.uniqueId==="absent").exp).toBe(20);
  dice("Eksploracja",[4]); click("Przerzut lub korekta przed zatwierdzeniem");
  resume();
  expect(button("Wynik zapisany").disabled).toBe(true);
  click("Zatwierdź eksplorację i dalej");
  completeRemaining();
  await waitFor(()=>expect(state.draft.campaignNotes.campaign.activeBattle).toBeNull());
  expect(state.draft.unitList.find(u=>u.uniqueId==="group").selectedNumber).toBe(2);
  expect(state.draft.unitList.find(u=>u.uniqueId==="hero").exp).toBe(21);
  expect(state.draft.campaignNotes.campaign.inventory.map(i=>i.name)).toEqual(["Sztylet"]);
  expect(finish).toHaveBeenCalledTimes(1);
  resume();
  expect(state.draft.campaignNotes.campaign.history).toHaveLength(1);
  expect(state.draft.unitList.find(u=>u.uniqueId==="hero").exp).toBe(21);
});

test.each(["stat", "skill"])("an unresolved %s advance blocks Next and its selected result survives resume", (kind) => {
  const {state, resume} = setup([hero({exp:23})]);
  click("Dalej: Doświadczenie i rozwój"); click("Nalicz doświadczenie i dalej");
  // Applying PD that crosses a threshold stays on the step for the advance.
  expect(screen.getByRole("status").textContent).toMatch(/awanse/);
  click("Dalej: Punkty kampanii"); expect(screen.getByRole("alert").textContent).toMatch(/awanse/);
  dice("Rozwój 1",kind==="stat" ? [3,4] : [2,2]); dice("Rozwój 2",[1,1]);
  click(kind==="stat" ? "Wybierz 7 · WW lub US +1" : "Wybierz 4 · Nowa umiejętność"); resume();
  expect(post(state).advances[0].selectedRoll).toBe(0);
  change(kind==="stat" ? "Współczynnik" : "Umiejętność",kind==="stat" ? "stat:1" : "rule:Błyskawiczny blok");
  click("Zastosuj rozwinięcie");
  expect(post(state).advances[0].resolved).toBe(true);
  if (kind==="stat") expect(R.currentStats(post(state).units[0])[1]).toBe(5);
  else expect(post(state).units[0].rules).toContain("Błyskawiczny blok");
  fireEvent.change(screen.getByLabelText("Etap kampanii"),{target:{value:"1"}});
  click("Dalej: Doświadczenie i rozwój"); expect(screen.queryByRole("button",{name:"Nalicz doświadczenie"})).toBeNull();
  expect(screen.getByText("✓ Doświadczenie naliczone")).toBeTruthy();
  expect(post(state).units[0].exp).toBe(24);
});

test("all heroes wounded: zero exploration dice can finish without a fabricated roll", async () => {
  const {state} = setup([hero({battleOutOfActionModels:[true]})]);
  dice("Obrażenia",[4,1],card("Herszt #1")); click("Zastosuj obrażenia",card("Herszt #1"));
  experienceToExploration();
  expect(screen.queryByLabelText("Eksploracja, kość 1")).toBeNull();
  click("Zatwierdź eksplorację i dalej");
  expect(post(state).loot).toBe(0);
  completeRemaining(); await waitFor(()=>expect(state.draft.campaignNotes.campaign.history).toHaveLength(1));
});

test("a generated availability roll survives a real persisted draft reload and cannot reroll", () => {
  const {state,resume} = setup(); experienceToExploration();
  dice("Eksploracja",[4]); click("Zatwierdź eksplorację i dalej");
  click("Bez sprzedaży łupów, dalej"); click("Dalej: Handel i dostępność");
  // The pool is created automatically when trading starts.
  const group=screen.getByRole("group",{name:"Dostępność: Herszt · 2K6"});
  click("Rzuć",within(group)); const result=post(state).availability[0].dice;
  resume();
  const restored=within(screen.getByRole("group",{name:"Dostępność: Herszt · 2K6"}));
  expect(button("Wynik zapisany",restored).disabled).toBe(true);
  expect(post(state).availability[0].dice).toEqual(result);
});

test("after correcting an empty battle name its validation error disappears on the next screen", () => {
  const {state} = setup(undefined,{},false);
  click("Rozpocznij potyczkę"); click("Rozpocznij sekwencję po potyczce");
  expect(screen.getByRole("alert").textContent).toMatch(/nazwę/);
  change("Nazwa potyczki","Poprawiona nazwa"); click("Rozpocznij sekwencję po potyczce");
  expect(state.draft.campaignNotes.campaign.activeBattle.stage).toBe(1);
  expect(screen.queryByRole("alert")).toBeNull();
});

test.each([false,true])("injury rerolls require the medic effect (%s) and cannot be repeated", (authorized) => {
  const {state,resume}=setup([hero({battleOutOfActionModels:[true]})],{
    campaign:{futureEffects: authorized ? [{key:"injuryRerollAll"}] : []},
  });
  dice("Obrażenia",[1,1],card("Herszt #1"));
  if (!authorized) {
    expect(screen.queryByLabelText("Przerzut obrażeń: pomoc medyka, kość 1")).toBeNull();
    return;
  }
  dice("Przerzut obrażeń: pomoc medyka",[4,1]); click("Zastosuj przerzut obrażeń");
  resume();
  expect(screen.queryByRole("button",{name:"Zastosuj przerzut obrażeń"})).toBeNull();
  click("Zastosuj obrażenia",card("Herszt #1"));
  expect(post(state).units[0].campaignModelStatus[0].dead).not.toBe(true);
  expect(Object.values(post(state).injuryDrafts)[0].originalDice).toEqual([1,1]);
});
