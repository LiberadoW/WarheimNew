// The game screen's state, stored on the game document as `play`:
//   play.round                                  current round
//   play.units[ownerUid][unitId] = { out: {i: true}, absent: {i: true}, kills, extraPd }
//   play.log = [{ id, round, type, ... }]       what happened, newest last
// Maps (not arrays) keep every model's status a separate Firestore field, so
// both players can record at the same time.
import randomEvents from "./data/randomEvents.json";
import { OPTIONAL_RULE_PD } from "./scenarios";
import * as R from "../campaign/rules";

export const modelCount = (unit) => R.modelCount(unit);
export const isHero = (unit) => R.isHero(unit);
export const isMage = (unit) => R.isHero(unit) && R.hasRule(unit, "Mag");

export const unitPlay = (play, owner, unitId) => play?.units?.[owner]?.[unitId] || {};

// Models already missing before the game (resting after an injury, captured).
export const unavailable = (unit, i) =>
  (unit.campaignModelStatus?.[i]?.skip || 0) > 0 || !!unit.campaignModelStatus?.[i]?.captured;

export const modelState = (play, owner, unit, i) => {
  if (unavailable(unit, i)) return "unavailable";
  const p = unitPlay(play, owner, unit.uniqueId);
  if (p.absent?.[i]) return "absent";
  if (p.out?.[i]) return "out";
  return "in";
};

export const modelLabel = (unit, i) =>
  modelCount(unit) > 1 ? `${R.label(unit)} #${i + 1}` : R.label(unit);

// Every model of a company, for the kill form's selects.
export const companyModels = (armyList = [], owner) =>
  armyList.flatMap((unit) =>
    Array.from({ length: modelCount(unit) }, (_, i) => ({
      key: `${owner}|${unit.uniqueId}|${i}`,
      owner,
      unitId: unit.uniqueId,
      index: i,
      label: modelLabel(unit, i),
      unit,
    })),
  );

export const parseModelKey = (key) => {
  const [owner, unitId, index] = String(key).split("|");
  return { owner, unitId, index: Number(index) };
};

export const countOut = (play, owner, armyList = []) =>
  armyList.reduce(
    (n, unit) =>
      n + Array.from({ length: modelCount(unit) }, (_, i) => modelState(play, owner, unit, i) === "out").filter(Boolean).length,
    0,
  );

// --- Optional-rule PD --------------------------------------------------------
// A rule's company PD applies when it was used; Nagła śmierć also needs 6+ rounds.
export const activePdRules = (optionalRules = [], rounds = 0) =>
  optionalRules.filter((key) => {
    const bonus = OPTIONAL_RULE_PD[key];
    return bonus && (!bonus.minRounds || rounds >= bonus.minRounds);
  });

export const ruleBonusFor = (unit, optionalRules, rounds) =>
  activePdRules(optionalRules, rounds).reduce((n, key) => {
    const { who, pd } = OPTIONAL_RULE_PD[key];
    return n + ((who === "heroes" ? isHero(unit) : isMage(unit)) ? pd : 0);
  }, 0);

// Every rulebook scenario gives "+1 za zwycięstwo" to the winning company's
// DOWÓDCA (chapter 11, all 67 scenarios). Custom scenarios are left to the players.
export const winBonusFor = (unit, game, owner) =>
  game?.scenario?.key && game?.result?.winner === owner && R.hasRule(unit, "Dowódca") ? 1 : 0;

// What a company earned in this game, before injuries and the post-battle
// sequence (which adds the +1 for surviving).
export const pdSummary = (armyList = [], play, owner, game) =>
  armyList
    .filter((unit) => R.canEarnExperience(unit))
    .map((unit) => {
      const p = unitPlay(play, owner, unit.uniqueId);
      const kills = isHero(unit) ? Number(p.kills) || 0 : 0;
      const extra = Number(p.extraPd) || 0;
      const rules = ruleBonusFor(unit, game?.optionalRules, play?.round || 0);
      const win = winBonusFor(unit, game, owner);
      return { unitId: unit.uniqueId, label: R.label(unit), kills, extra, rules, win, total: kills + extra + rules + win };
    })
    .filter((row) => row.total > 0);

// --- Zdarzenia losowe -------------------------------------------------------
export const randomEventFor = (area, code) =>
  (randomEvents[area] || []).find((e) => code >= e.code && code <= (e.max || e.code)) || null;

// --- Hand-off to the player's own post-battle sequence --------------------
// Units of the player's saved company with this game's battle fields filled
// in, and the battle record the play view starts from.
export const toBattle = ({ savedList, play, owner, game, opponentName, opponentList, campaignName }) => {
  const units = R.clone(savedList.armyList || []).map((unit) => {
    const p = unitPlay(play, owner, unit.uniqueId);
    const n = modelCount(unit);
    // Named sources first, so the experience step can show them; what the
    // players added on the game screen stays the typed part.
    const parts = [
      ...activePdRules(game.optionalRules, play?.round || 0)
        .filter((key) => ruleBonusFor(unit, [key], play?.round || 0))
        .map((key) => ({ label: key.charAt(0) + key.slice(1).toLowerCase(), pd: ruleBonusFor(unit, [key], play?.round || 0) })),
      ...(winBonusFor(unit, game, owner) ? [{ label: "Zwycięstwo (DOWÓDCA)", pd: 1 }] : []),
    ];
    return {
      ...unit,
      battleExp:
        (Number(p.extraPd) || 0) +
        ruleBonusFor(unit, game.optionalRules, play?.round || 0) +
        winBonusFor(unit, game, owner),
      battleExpParts: parts,
      battleKills: isHero(unit) ? Number(p.kills) || 0 : 0,
      battleObled: 0,
      battlePacts: 0,
      battleOutOfActionModels: Array.from({ length: n }, (_, i) => !!p.out?.[i]),
      battleAbsentModels: Array.from({ length: n }, (_, i) => !!p.absent?.[i] || unavailable(unit, i)),
    };
  });
  const winner = game.result?.winner;
  const battle = {
    ...R.newBattle(units),
    gameName: [campaignName, game.round && `runda ${game.round}`].filter(Boolean).join(" · "),
    opponent: opponentName || "",
    scenario: game.scenario?.name || "",
    area: game.scenario?.area || "inside",
    scenarioRecord: game.scenario || null,
    result: winner === "draw" ? "draw" : winner === owner ? "win" : winner ? "loss" : "loss",
    round: Math.max(1, play?.round || 1),
    opponentModels: (opponentList?.armyList || []).reduce((n, u) => n + modelCount(u), 0),
    opponentOut: countOut(play, game.players.find((p) => p !== owner), opponentList?.armyList),
    opponentPrestige: Number(opponentList?.prestige) || 0,
    campaignGame: { campaignId: game.campaignId || null, gameId: game.id || null },
  };
  return { units, battle };
};
