import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { webcrypto } from "crypto";
import { TextEncoder } from "util";
import { AuthContext } from "../Context/AuthContext";
import * as R from "../campaign/rules";

jest.mock("../Database/database", () => ({ db: {} }));
jest.mock("firebase/firestore", () => ({
  collection: jest.fn((db, name) => name),
  getDocs: jest.fn(),
  updateDoc: jest.fn(),
}));
jest.mock("../campaignHub/campaignService", () => ({
  getGameEvents: jest.fn(),
  watchGame: jest.fn(),
  updateGame: jest.fn(),
}));

beforeAll(() => {
  Object.defineProperty(window, "crypto", { value: webcrypto, configurable: true });
  global.TextEncoder = TextEncoder;
});

const { isAdminEmail } = require("./admin");
const AdminPage = require("./AdminPage").default;
const { getDocs, collection, updateDoc } = require("firebase/firestore");
const { getGameEvents, watchGame, updateGame } = require("../campaignHub/campaignService");
// CRA resets mock implementations before each test.
beforeEach(() => collection.mockImplementation((db, name) => name));

const page = (email) =>
  render(
    <AuthContext.Provider value={{ currentUser: { user: { uid: "x", email } } }}>
      <MemoryRouter>
        <AdminPage />
      </MemoryRouter>
    </AuthContext.Provider>,
  );

test("only the admin address passes, case and spaces ignored", async () => {
  expect(await isAdminEmail(" Wojtek.Szemik@gmail.com ")).toBe(true);
  expect(await isAdminEmail("ktos@gmail.com")).toBe(false);
  expect(await isAdminEmail(undefined)).toBe(false);
});

test("the admin sees every player's lists as folders", async () => {
  getDocs.mockImplementation((name) =>
    Promise.resolve({
      docs:
        name === "lists"
          ? [
              { id: "u1", data: () => ({ ownerName: "Kasia", lists: [{ armyName: "Cyrk", armyType: "Cyrkowcy z Ligii Ostermarku", armyList: [] }] }) },
              { id: "u2", data: () => ({ lists: [] }) },
            ]
          : [{ id: "c", data: () => ({ memberNames: { u2: "Tomek" } }) }],
    }),
  );
  page("wojtek.szemik@gmail.com");
  expect(await screen.findByText(/Kasia/)).not.toBeNull();
  expect(screen.getByText(/Tomek/)).not.toBeNull();
  fireEvent.click(screen.getByText(/Kasia/));
  expect(screen.getByText("Cyrk")).not.toBeNull();
});

test("anyone else is turned away", async () => {
  page("ktos@gmail.com");
  expect(await screen.findByText(/tylko dla administratora/)).not.toBeNull();
  expect(getDocs).not.toHaveBeenCalled();
});

test("a saved campaign sequence can be finished in a copy without syncing or writing to the account", async () => {
  const hero = {
    uniqueId: "hero", type: "Bohater", unitName: "Mecenas", selectedNumber: 1,
    rules: [], startingEquipment: [], optionalEquipment: [], equipmentList: {},
    stats: { Początkowa: [4, 4, 4, 3, 3, 1, 4, 1, 8] },
  };
  const units = [hero];
  const battle = R.beginPostBattle({
    ...R.newBattle(units), gameName: "Runda 2",
    campaignGame: { campaignId: "c", gameId: "g", owner: "u1" },
    lootSync: { mine: null, theirs: null },
  }, units, { skarbiec: 12 });
  battle.stage = 5;
  battle.post.expApplied = true;
  const list = {
    armyName: "Cyrk", armyType: "Cyrkowcy z Ligii Ostermarku", armyList: units,
    sequenceDraft: JSON.stringify({ unitList: units, battle }),
  };
  const original = JSON.stringify(list);
  getDocs.mockImplementation((name) => Promise.resolve({
    docs: name === "lists"
      ? [{ id: "u1", data: () => ({ ownerName: "Kasia", lists: [list] }) }]
      : [],
  }));
  page("wojtek.szemik@gmail.com");
  const openCopy = () => fireEvent.click(screen.getByRole("button", { name: "Otwórz w trybie diagnostycznym", hidden: true }));
  fireEvent.click(await screen.findByText(/Kasia/));
  openCopy();
  expect(screen.getByRole("heading", { name: "Tryb diagnostyczny" })).toBeTruthy();
  fireEvent.click(screen.getByRole("button", { name: "Bez sprzedaży łupów, dalej" }));
  fireEvent.click(screen.getByRole("button", { name: "Pomiń do podsumowania" }));
  fireEvent.click(screen.getByRole("button", { name: "Zapisz rozliczenie i zakończ potyczkę" }));
  expect(await screen.findByText(/Zapisano rozliczenie: Runda 2/)).toBeTruthy();
  expect(getGameEvents).not.toHaveBeenCalled();
  expect(watchGame).not.toHaveBeenCalled();
  expect(updateGame).not.toHaveBeenCalled();
  expect(updateDoc).not.toHaveBeenCalled();
  expect(JSON.stringify(list)).toBe(original);
  fireEvent.click(screen.getByRole("button", { name: "Wróć do rozpisek graczy" }));
  fireEvent.click(screen.getByText(/Kasia/));
  openCopy();
  expect(screen.getByRole("button", { name: "Bez sprzedaży łupów, dalej" })).toBeTruthy();
});
