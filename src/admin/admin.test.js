import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { webcrypto } from "crypto";
import { TextEncoder } from "util";
import { AuthContext } from "../Context/AuthContext";

jest.mock("../Database/database", () => ({ db: {} }));
jest.mock("firebase/firestore", () => ({ collection: jest.fn((db, name) => name), getDocs: jest.fn() }));

beforeAll(() => {
  Object.defineProperty(window, "crypto", { value: webcrypto, configurable: true });
  global.TextEncoder = TextEncoder;
});

const { isAdminEmail } = require("./admin");
const AdminPage = require("./AdminPage").default;
const { getDocs, collection } = require("firebase/firestore");
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
});
