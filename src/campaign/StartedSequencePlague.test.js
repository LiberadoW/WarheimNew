import React from "react";
import { render, screen, waitFor, cleanup } from "@testing-library/react";
import CampaignManager from "./CampaignManager";
import useCampaignDraft from "./useCampaignDraft";
import * as R from "./rules";
import * as service from "../campaignHub/campaignService";

jest.mock("../campaignHub/campaignService", () => ({ getGameEvents: jest.fn() }));

const OWNER = "started-plague";
const hero = {
  uniqueId: "hero", unitName: "Herszt", type: "Bohater", selectedNumber: 1, number: 1, cost: 55, totalCost: 55,
  exp: 20, skills: [0], rules: ["Dowódca"], startingEquipment: ["Sztylet"], optionalEquipment: [],
  equipmentList: { Sztylet: [2, 0] },
  stats: { Początkowa: [4, 4, 4, 3, 3, 2, 4, 1, 8], Maksymalna: [5, 6, 6, 4, 4, 3, 6, 4, 9] },
  battleAbsentModels: [false], battleOutOfActionModels: [false],
};
const army = { name: "Gang przemytników", heroes: { Herszt: hero }, maxModels: 15 };

afterEach(cleanup);

test("a sequence handed off before events were passed fetches them and shows Zaraza", async () => {
  service.getGameEvents.mockResolvedValue([{ code: 61, area: "inside", name: "Zaraza", round: 2 }]);
  const notes = { skarbiec: 0 };
  // An old hand-off: the event count, no event list, already on step 5.
  const old = R.beginPostBattle(
    { ...R.newBattle([hero]), gameName: "QA", randomEvents: 1, campaignGame: { campaignId: "c", gameId: "g" } },
    [hero], notes, army);
  notes.campaign = { activeBattle: { ...old, stage: 5 }, history: [] };
  localStorage.setItem(`warheim:draft:${OWNER}`, JSON.stringify({ owner: OWNER, army: army.name, armyName: "QA", unitList: [hero], campaignNotes: notes }));
  function Harness() {
    const [draft, setField] = useCampaignDraft(OWNER);
    return (
      <CampaignManager unitList={draft.unitList} setUnitList={(v) => setField("unitList", v)} army={army}
        campaignNotes={draft.campaignNotes} setCampaignNotes={(v) => setField("campaignNotes", v)} onFinish={jest.fn()} />
    );
  }
  render(<Harness />);
  await waitFor(() => expect(screen.getByRole("region", { name: "Zaraza" })).toBeTruthy());
  expect(service.getGameEvents).toHaveBeenCalledWith("c", "g");
});
