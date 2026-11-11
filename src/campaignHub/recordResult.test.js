import { recordResult } from "./campaignService";
import { doc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore";

jest.mock("../Database/database", () => ({ db: {} }));
jest.mock("firebase/firestore", () => {
  const names = ["arrayRemove", "arrayUnion", "collection", "deleteDoc", "deleteField", "getDocs",
    "increment", "onSnapshot", "query", "setDoc", "where", "writeBatch"];
  return {
    ...Object.fromEntries(names.map((n) => [n, jest.fn()])),
    doc: jest.fn((db, ...path) => path.join("/")),
    getDoc: jest.fn(),
    updateDoc: jest.fn(() => Promise.resolve()),
    serverTimestamp: jest.fn(() => "now"),
  };
});

const model = (uniqueId, selectedNumber = 1) => ({ uniqueId, unitName: "X", type: "Stronnik", selectedNumber });
const docs = (game, lists) => (path) => {
  const data = path.endsWith("/games/g1") ? game : lists[path.split("/").pop()];
  return Promise.resolve({ data: () => data });
};

// CRA resets mock implementations before each test.
beforeEach(() => {
  doc.mockImplementation((db, ...path) => path.join("/"));
  updateDoc.mockImplementation(() => Promise.resolve());
  serverTimestamp.mockImplementation(() => "now");
});

test("recording a result freezes both companies before anyone settles", async () => {
  getDoc.mockImplementation(docs(
    { players: ["a", "b"], play: { units: { b: { y: { out: { 1: true } } } } } },
    { a: { armyList: [model("x")], prestige: 50 }, b: { armyList: [model("y", 3)], prestige: 70 } },
  ));
  await recordResult("c1", "g1", { winner: "a" }, { uid: "a" });
  expect(updateDoc.mock.calls[0][1].before).toEqual({
    a: { models: 1, out: 0, prestige: 50 },
    b: { models: 3, out: 1, prestige: 70 },
  });
});

test("a result recorded again keeps the first prestige and models", async () => {
  getDoc.mockImplementation(docs(
    { players: ["a", "b"], before: { a: { models: 1, out: 0, prestige: 50 }, b: { models: 3, out: 0, prestige: 70 } },
      play: { units: { b: { y: { out: { 0: true } } } } } },
    // B settled meanwhile: a model died and prestige changed.
    { a: { armyList: [model("x")], prestige: 50 }, b: { armyList: [model("y", 2)], prestige: 40 } },
  ));
  await recordResult("c1", "g1", { winner: "b" }, { uid: "b" });
  expect(updateDoc.mock.calls[0][1].before.b).toEqual({ models: 3, out: 1, prestige: 70 });
});
