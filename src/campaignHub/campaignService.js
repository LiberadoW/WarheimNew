// Shared campaigns in Firestore. Every read and write the campaign pages make
// goes through this file, so it can be checked against firestore.rules:
//
//   campaigns/{campaignId}            name, ownerId, inviteCode, members[], memberNames{}
//   campaigns/{campaignId}/lists/{uid}  one uploaded roster per member
//   campaigns/{campaignId}/games/{id}   pairings and results (one entry per game)
//   inviteCodes/{code}                campaignId, ownerId (lets players find a campaign)
import {
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  deleteField,
  doc,
  getDoc,
  getDocs,
  increment,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import { db } from "../Database/database";
import { normalizeRosterNames } from "../Data.js/RulebookNames";
import { companySnapshot, gameEvents } from "./gamePlay";

// No 0/O, 1/I/L: codes are read aloud and typed on phones.
const CODE_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

export const makeInviteCode = (random = Math.random) =>
  Array.from(
    { length: 6 },
    () => CODE_ALPHABET[Math.floor(random() * CODE_ALPHABET.length)],
  ).join("");

export const normalizeInviteCode = (code) =>
  String(code || "")
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "");

export const playerName = (user) =>
  user?.displayName || user?.email?.split("@")[0] || "Gracz";

const campaignRef = (campaignId) => doc(db, "campaigns", campaignId);

export async function createCampaign(name, user) {
  const ref = doc(collection(db, "campaigns"));
  // A clash is unlikely (31^6 codes); retry a few times to be sure.
  let inviteCode = makeInviteCode();
  for (let i = 0; i < 5; i += 1) {
    if (!(await getDoc(doc(db, "inviteCodes", inviteCode))).exists()) break;
    inviteCode = makeInviteCode();
  }
  const batch = writeBatch(db);
  batch.set(ref, {
    name: name.trim(),
    ownerId: user.uid,
    inviteCode,
    members: [user.uid],
    memberNames: { [user.uid]: playerName(user) },
    settings: { optionalRules: [] },
    createdAt: serverTimestamp(),
  });
  batch.set(doc(db, "inviteCodes", inviteCode), {
    campaignId: ref.id,
    ownerId: user.uid,
  });
  await batch.commit();
  return ref.id;
}

export async function joinCampaignByCode(code, user) {
  const normalized = normalizeInviteCode(code);
  const invite = await getDoc(doc(db, "inviteCodes", normalized));
  if (!invite.exists()) throw new Error("Nie znaleziono kampanii o tym kodzie.");
  const { campaignId } = invite.data();
  await updateDoc(campaignRef(campaignId), {
    members: arrayUnion(user.uid),
    [`memberNames.${user.uid}`]: playerName(user),
  });
  return campaignId;
}

export async function getMyCampaigns(uid) {
  const snapshot = await getDocs(
    query(collection(db, "campaigns"), where("members", "array-contains", uid)),
  );
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export const watchCampaign = (campaignId, onChange, onError) =>
  onSnapshot(
    campaignRef(campaignId),
    (d) => onChange(d.exists() ? { id: d.id, ...d.data() } : null),
    onError,
  );

export const watchCampaignLists = (campaignId, onChange, onError) =>
  onSnapshot(
    collection(db, "campaigns", campaignId, "lists"),
    (snapshot) =>
      onChange(
        Object.fromEntries(snapshot.docs.map((d) => [d.id, d.data()])),
      ),
    onError,
  );

export const watchCampaignGames = (campaignId, onChange, onError) =>
  onSnapshot(
    collection(db, "campaigns", campaignId, "games"),
    (snapshot) =>
      onChange(snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))),
    onError,
  );

// The player's saved lists ("Moje rozpiski") to choose an upload from.
export async function getMySavedLists(uid) {
  const saved = await getDoc(doc(db, "lists", uid));
  return saved.data()?.lists || [];
}

export async function uploadCampaignList(campaignId, user, savedList) {
  const list = normalizeRosterNames(savedList);
  await setDoc(doc(db, "campaigns", campaignId, "lists", user.uid), {
    uid: user.uid,
    playerName: playerName(user),
    armyType: list.armyType,
    armyName: list.armyName,
    armyList: list.armyList || [],
    campaignNotes: list.campaignNotes || {},
    totalCost: list.totalCost ?? null,
    prestige: list.prestige ?? null,
    uploadedAt: serverTimestamp(),
  });
}

// Owner removing a player, or a player leaving. The player's uploaded list
// goes with them; their games stay in the history.
export async function removeMember(campaignId, uid) {
  await deleteDoc(doc(db, "campaigns", campaignId, "lists", uid));
  await updateDoc(campaignRef(campaignId), {
    members: arrayRemove(uid),
    [`memberNames.${uid}`]: deleteField(),
  });
}

export async function deleteCampaign(campaign) {
  const [lists, games] = await Promise.all([
    getDocs(collection(db, "campaigns", campaign.id, "lists")),
    getDocs(collection(db, "campaigns", campaign.id, "games")),
  ]);
  const batch = writeBatch(db);
  lists.docs.forEach((d) => batch.delete(d.ref));
  games.docs.forEach((d) => batch.delete(d.ref));
  batch.delete(doc(db, "inviteCodes", campaign.inviteCode));
  batch.delete(campaignRef(campaign.id));
  await batch.commit();
}

// --- Rounds, pairings and games (organizer creates, players record) --------
const newGame = (round, players, optionalRules, bye = false) => ({
  round,
  players,
  bye,
  status: bye ? "bye" : "planned",
  scenario: null,
  optionalRules: [...optionalRules],
  result: null,
  createdAt: serverTimestamp(),
});

export async function createRound(campaign, round, pairs, bye) {
  const defaults = campaign.settings?.optionalRules || [];
  const batch = writeBatch(db);
  const games = collection(db, "campaigns", campaign.id, "games");
  pairs.forEach((players) => batch.set(doc(games), newGame(round, players, defaults)));
  if (bye) batch.set(doc(games), newGame(round, [bye], defaults, true));
  await batch.commit();
}

export async function addGame(campaign, round, players) {
  await setDoc(
    doc(collection(db, "campaigns", campaign.id, "games")),
    newGame(round, players, campaign.settings?.optionalRules || []),
  );
}

export const updateGame = (campaignId, gameId, changes) =>
  updateDoc(doc(db, "campaigns", campaignId, "games", gameId), changes);

// A player saved the post-battle sequence of this game: it is not offered again.
export const markSequenceDone = (campaignId, gameId, uid, entryId) =>
  updateGame(campaignId, gameId, {
    [`sequenceDone.${uid}`]: { at: serverTimestamp(), entryId: entryId || null },
  });

// The result also freezes both companies as they were before the fight, so
// each player's sequence sees the opponent's numbers from the game itself.
export async function recordResult(campaignId, gameId, result, user) {
  const game = (await getDoc(doc(db, "campaigns", campaignId, "games", gameId))).data() || {};
  const players = game.players || [];
  const lists = await Promise.all(
    players.map((uid) => getDoc(doc(db, "campaigns", campaignId, "lists", uid))),
  );
  // A result recorded again (after "Cofnij wynik") keeps the first models and
  // prestige: a player may have settled and re-uploaded in between.
  const before = Object.fromEntries(
    players.map((uid, i) => {
      const now = companySnapshot(lists[i].data(), game.play, uid);
      const first = game.before?.[uid];
      return [uid, first ? { ...now, models: first.models, prestige: first.prestige } : now];
    }),
  );
  return updateGame(campaignId, gameId, {
    status: "done",
    result: { ...result, recordedBy: user.uid },
    playedAt: serverTimestamp(),
    before,
  });
}

export const reopenGame = (campaignId, gameId) =>
  updateGame(campaignId, gameId, { status: "planned", result: null, playedAt: deleteField() });

export const deleteGame = (campaignId, gameId) =>
  deleteDoc(doc(db, "campaigns", campaignId, "games", gameId));

// --- Game screen: live state under game.play, one field per change --------
// The random events of a game, for a sequence started before they were
// passed along with the hand-off.
export const getGameEvents = async (campaignId, gameId) => {
  const game = (await getDoc(doc(db, "campaigns", campaignId, "games", gameId))).data();
  return game ? gameEvents(game.play) : null;
};

export const watchGame = (campaignId, gameId, onChange, onError) =>
  onSnapshot(
    doc(db, "campaigns", campaignId, "games", gameId),
    (d) => onChange(d.exists() ? { id: d.id, campaignId, ...d.data() } : null),
    onError,
  );

const unitPath = (owner, unitId) => `play.units.${owner}.${unitId}`;

export const setPlayRound = (campaignId, gameId, round) =>
  updateGame(campaignId, gameId, { "play.round": Math.max(1, round), status: "playing" });

// state: "in" | "out" | "absent" for one model, in a single write.
export const setModelState = (campaignId, gameId, owner, unitId, index, state) =>
  updateGame(campaignId, gameId, {
    [`${unitPath(owner, unitId)}.out.${index}`]: state === "out" ? true : deleteField(),
    [`${unitPath(owner, unitId)}.absent.${index}`]: state === "absent" ? true : deleteField(),
  });

// A caster's lore or first spells chosen before the game; the hand-off
// writes them to the saved company.
export const setUnitMagic = (campaignId, gameId, owner, unitId, patch) =>
  updateGame(
    campaignId,
    gameId,
    Object.fromEntries(Object.entries(patch).map(([k, v]) => [`${unitPath(owner, unitId)}.${k}`, v])),
  );

// USZKODZENIE PANCERZA: one model's damage, { steps, shield }.
export const setArmourDamage = (campaignId, gameId, owner, unitId, index, damage) =>
  updateGame(campaignId, gameId, {
    [`${unitPath(owner, unitId)}.armour.${index}`]:
      damage && (damage.steps > 0 || damage.shield) ? damage : deleteField(),
  });

export const changeCounter = (campaignId, gameId, owner, unitId, field, delta) =>
  updateGame(campaignId, gameId, { [`${unitPath(owner, unitId)}.${field}`]: increment(delta) });

const logId = () =>
  window.crypto?.randomUUID?.() || `log-${Date.now()}-${Math.random().toString(36).slice(2)}`;

// A model taken out of action, optionally by another model (which gets the
// kill). Both changes and the log line are written together.
export const recordTakedown = (campaignId, gameId, { victim, killer, round, text }) => {
  const entry = { id: logId(), type: "takedown", round, victim, killer: killer || null, text };
  const changes = {
    [`${unitPath(victim.owner, victim.unitId)}.out.${victim.index}`]: true,
    "play.log": arrayUnion(entry),
  };
  if (killer?.counts)
    changes[`${unitPath(killer.owner, killer.unitId)}.kills`] = increment(1);
  return updateGame(campaignId, gameId, changes);
};

export const addLogEntry = (campaignId, gameId, entry) =>
  updateGame(campaignId, gameId, { "play.log": arrayUnion({ id: logId(), ...entry }) });

// Removing a takedown also gives the model back and takes the kill away.
export const removeLogEntry = (campaignId, gameId, entry) => {
  const changes = { "play.log": arrayRemove(entry) };
  if (entry.type === "takedown") {
    changes[`${unitPath(entry.victim.owner, entry.victim.unitId)}.out.${entry.victim.index}`] = deleteField();
    if (entry.killer?.counts)
      changes[`${unitPath(entry.killer.owner, entry.killer.unitId)}.kills`] = increment(-1);
  }
  return updateGame(campaignId, gameId, changes);
};

export const updateCampaignSettings = (campaignId, settings) =>
  updateDoc(campaignRef(campaignId), { settings });

// Firestore says "Missing or insufficient permissions" for both a stale login
// and an outdated rule set; tell the player what to try.
export const describeError = (error) =>
  error?.code === "permission-denied"
    ? "Brak dostępu. Zaloguj się ponownie; jeśli to nie pomoże, sprawdź reguły Firestore."
    : error?.message || "Coś poszło nie tak.";
