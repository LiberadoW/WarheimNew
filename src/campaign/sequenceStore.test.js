import { canReopen, packDraft, packLastSequence, reopenSequence, unpack } from "./sequenceStore";
import * as R from "./rules";

test("a draft and the last sequence are kept as JSON text", () => {
  const battle = { id: "b1", post: { rollDrafts: { x: [[1, 2]] } } };
  expect(unpack(packDraft([{ uniqueId: "u" }], battle))).toEqual({ unitList: [{ uniqueId: "u" }], battle });
  expect(unpack("not json")).toBeNull();
});

test("the newest finished sequence reopens until another skirmish starts", () => {
  const before = { skarbiec: 10, campaign: { history: [{ id: "old" }], activeBattle: { id: "b1", stage: 11 } } };
  const last = packLastSequence([{ uniqueId: "u", exp: 3 }], before);
  const after = { skarbiec: 40, campaign: { history: [{ id: "old" }, { id: "b1" }], lastSequence: last } };
  expect(canReopen(after)).toBe(true);
  expect(canReopen({ ...after, campaign: { ...after.campaign, activeBattle: { id: "b2" } } })).toBe(false);
  expect(canReopen({ ...after, campaign: { ...after.campaign, history: [...after.campaign.history, { id: "b2" }] } })).toBe(false);
  const { unitList, notes } = reopenSequence(after);
  expect(unitList).toEqual([{ uniqueId: "u", exp: 3 }]);
  expect(notes.skarbiec).toBe(10);
  expect(notes.campaign.history).toEqual([{ id: "old" }]);
  expect(notes.campaign.activeBattle).toMatchObject({ id: "b1", stage: 11, reopened: true });
});

test("an advance can be undone and chosen again", () => {
  const unit = { uniqueId: "h", unitName: "Herszt", type: "Bohater", rules: ["Dowódca"], stats: { Początkowa: [4, 4, 4, 3, 3, 1, 4, 1, 8], Maksymalna: [5, 6, 6, 4, 4, 3, 6, 4, 9] } };
  const post = { units: [unit], advances: [{ id: "a", unitId: "h", resolved: false, rolls: [{ dice: [3, 4] }] }], journal: [] };
  const a = post.advances[0];
  R.snapshotAdvance(a, unit);
  R.changeStat(unit, 1, 1);
  R.addRule(unit, "Rezun");
  a.resolved = true;
  a.description = "WW +1";
  R.undoAdvance(post, "a");
  expect(R.currentStats(unit)[1]).toBe(4);
  expect(unit.rules).toEqual(["Dowódca"]);
  expect(a).toMatchObject({ resolved: false, rolls: [{ dice: [3, 4] }] });
  expect(a.undo).toBeUndefined();
});
