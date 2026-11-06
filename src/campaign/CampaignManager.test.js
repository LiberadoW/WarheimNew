import React, { useState } from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CampaignManager from "./CampaignManager";
const unit = {
  uniqueId: "hero",
  unitName: "Herszt",
  unitDisplayName: "",
  type: "Bohater",
  selectedNumber: 1,
  number: 1,
  cost: 55,
  totalCost: 55,
  exp: 20,
  skills: [0],
  rules: ["Dowódca"],
  startingEquipment: ["Sztylet"],
  optionalEquipment: [],
  equipmentList: { Sztylet: [2, 0], Miecz: [10, 0] },
  stats: {
    Początkowa: [4, 4, 4, 3, 3, 2, 4, 1, 8],
    Maksymalna: [5, 6, 6, 4, 4, 3, 6, 4, 9],
  },
};
const setup = (finish = jest.fn().mockResolvedValue(undefined)) => {
  const state = {};
  function Harness() {
    const [units, setUnits] = useState([JSON.parse(JSON.stringify(unit))]);
    const [notes, setNotes] = useState({ skarbiec: 100 });
    state.units = units;
    state.notes = notes;
    return (
      <CampaignManager
        unitList={units}
        setUnitList={setUnits}
        army={{ name: "Gang przemytników", heroes: { Herszt: unit } }}
        campaignNotes={notes}
        setCampaignNotes={setNotes}
        onFinish={finish}
      />
    );
  }
  render(<Harness />);
  return { state, finish };
};
const click = (name) => fireEvent.click(screen.getByRole("button", { name }));
function toSummary() {
  click("Rozpocznij potyczkę");
  fireEvent.change(screen.getByLabelText("Nazwa potyczki"), {
    target: { value: "O most" },
  });
  click("Rozpocznij sekwencję po potyczce");
  click("Dalej: Doświadczenie i rozwój");
  click("Nalicz doświadczenie");
  click("Dalej: Punkty kampanii");
  click("Zatwierdź punkty kampanii");
  click("Dalej: Eksploracja");
  fireEvent.change(screen.getByLabelText("Eksploracja, kość 1"), {
    target: { value: "4" },
  });
  click("Zatwierdź pulę eksploracji");
  click("Zatwierdź eksplorację");
  click("Dalej: Sprzedaż łupów");
  click("Zatwierdź bez sprzedaży");
  click("Dalej: Doświadczeni stronnicy");
  click("Dalej: Handel i dostępność");
  click("Dalej: Postacie Dramatu");
  click("Dalej: Rekrutacja");
  click("Dalej: Podział ekwipunku");
  click("Dalej: Podsumowanie");
}
test("the complete sequence applies PD and loot once and records its history", async () => {
  const { state, finish } = setup();
  toSummary();
  expect(state.units[0].exp).toBe(20);
  click("Zapisz rozliczenie i zakończ potyczkę");
  await waitFor(() => expect(state.notes.campaign.activeBattle).toBeNull());
  expect(state.units[0].exp).toBe(21);
  expect(state.notes.kosztownosci).toBe(1);
  expect(state.notes.campaign.history).toHaveLength(1);
  expect(finish).toHaveBeenCalledTimes(1);
});
test("failed cloud save preserves draft, roster and history for retry", async () => {
  const finish = jest
    .fn()
    .mockRejectedValueOnce(new Error("offline"))
    .mockResolvedValue(undefined);
  const { state } = setup(finish);
  toSummary();
  click("Zapisz rozliczenie i zakończ potyczkę");
  await screen.findByRole("alert");
  expect(state.units[0].exp).toBe(20);
  expect(state.notes.campaign.activeBattle.post.expApplied).toBe(true);
  expect(state.notes.campaign.history).toHaveLength(0);
  click("Zapisz rozliczenie i zakończ potyczkę");
  await waitFor(() => expect(state.notes.campaign.history).toHaveLength(1));
  expect(state.units[0].exp).toBe(21);
});
test("an unfinished injury prevents leaving the injury step", () => {
  const state = {};
  function Harness() {
    const [units, setUnits] = useState([
      { ...unit, battleOutOfActionModels: [true] },
    ]);
    const [notes, setNotes] = useState({
      campaign: {
        activeBattle: {
          id: "a",
          stage: 1,
          gameName: "Test",
          post: {
            units,
            injuries: {},
            inventory: [],
            journal: [],
            advances: [],
          },
        },
      },
    });
    state.notes = notes;
    return (
      <CampaignManager
        unitList={units}
        setUnitList={setUnits}
        army={{ name: "Gang przemytników", heroes: {} }}
        campaignNotes={notes}
        setCampaignNotes={setNotes}
        onFinish={jest.fn()}
      />
    );
  }
  render(<Harness />);
  click("Dalej: Doświadczenie i rozwój");
  expect(screen.getByRole("alert").textContent).toMatch(/obrażenia/);
  expect(state.notes.campaign.activeBattle.stage).toBe(1);
});
