import { recordChaosGift, recordResult, recordTakedown, removeLogEntry } from "./campaignService";
import { arrayRemove, deleteField, doc, getDoc, increment, runTransaction, serverTimestamp, updateDoc } from "firebase/firestore";

jest.mock("../Database/database", () => ({ db: {} }));
jest.mock("firebase/firestore", () => {
  const names = ["arrayRemove", "arrayUnion", "collection", "deleteDoc", "deleteField", "getDocs",
    "increment", "onSnapshot", "query", "runTransaction", "setDoc", "where", "writeBatch"];
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
  runTransaction.mockImplementation((db, operation) => operation({ get: getDoc, update: updateDoc }));
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

const takedown = (id) => ({
  id, type: "takedown",
  killer: { owner: "a", unitId: "hero", counts: true },
  victim: { owner: "b", unitId: "target", index: 0 },
  eyeOfChaos: { hero: "Bohater", target: "Cel", held: [] },
});

test("the game result waits for all triggered Eye of Chaos rolls", async () => {
  const play = { log: [takedown("pending")] };
  getDoc.mockImplementation(docs({ players: ["a", "b"], play }, {}));
  await expect(recordResult("c1", "g1", { winner: "a" }, { uid: "a" })).rejects.toThrow(/Dary Chaosu/);
  expect(updateDoc).not.toHaveBeenCalled();
  play.chaosGifts = { pending: { dice: [3, 4], result: 7 } };
  await recordResult("c1", "g1", { winner: "a" }, { uid: "a" });
  expect(updateDoc).toHaveBeenCalledTimes(1);
});

function transactionFor(play) {
  const transaction = {
    get: jest.fn().mockResolvedValue({ data: () => ({ status: "playing", play }) }),
    update: jest.fn(),
  };
  runTransaction.mockImplementation((db, operation) => operation(transaction));
  return transaction;
}

test("persisted gifts are unique per hero and each takedown has only one result", async () => {
  const log = [takedown("previous"), takedown("pending")];
  const play = { log, chaosGifts: { previous: { dice: [2, 2], result: 4 } } };
  const transaction = transactionFor(play);
  await expect(recordChaosGift("c1", "g1", "pending", [1, 3])).rejects.toThrow(/ma już dar/);
  expect(transaction.update).not.toHaveBeenCalled();
  await recordChaosGift("c1", "g1", "pending", [3, 4]);
  expect(transaction.update).toHaveBeenCalledWith("campaigns/c1/games/g1", {
    "play.chaosGifts.pending": { dice: [3, 4], result: 7 },
  });
  play.chaosGifts.pending = { dice: [3, 4], result: 7 };
  await expect(recordChaosGift("c1", "g1", "pending", [3, 3])).rejects.toThrow(/już zapisany/);
  expect(transaction.update).toHaveBeenCalledTimes(1);
});

test("a second write cannot take out the same model, and undo removes its gift with the PD", async () => {
  const entry = takedown("taken");
  const play = { log: [entry], units: { b: { target: { out: { 0: true } } } } };
  const transaction = transactionFor(play);
  await expect(recordTakedown("c1", "g1", entry)).rejects.toThrow(/już wyłączony/);
  expect(transaction.update).not.toHaveBeenCalled();
  arrayRemove.mockReturnValue("remove takedown");
  deleteField.mockReturnValue("delete field");
  increment.mockReturnValue("decrement");
  await removeLogEntry("c1", "g1", entry);
  expect(increment).toHaveBeenCalledWith(-1);
  expect(transaction.update).toHaveBeenCalledWith("campaigns/c1/games/g1", {
    "play.log": "remove takedown",
    "play.units.b.target.out.0": "delete field",
    "play.units.a.hero.kills": "decrement",
    "play.chaosGifts.taken": "delete field",
  });
  play.log = [];
  await removeLogEntry("c1", "g1", entry);
  expect(transaction.update).toHaveBeenCalledTimes(1);
});
