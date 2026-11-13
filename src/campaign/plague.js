import * as R from "./rules";

// ZARAZA (zdarzenie losowe 61, „Wewnątrz murów”, s. 404): after the skirmish
// every model present when the plague victims appeared takes a WT test.
// A failed test: K6, 1 = dead (as MARTWY), 2–5 = misses the next game,
// 6 = recovery. Demons, ethereal, forest spirits, war machines, undead and
// the possessed are spared.
const IMMUNE = ["demon", "istota eteryczna", "leśny duch", "machina wojenna", "nieumarły", "opętany"];
export const isImmune = (unit) =>
  (unit.rules || []).some((r) => IMMUNE.some((name) => String(r).toLowerCase().startsWith(name)));

// The game's events (battle.events from a campaign game) or the play-mode log.
export const hadPlague = (battle) =>
  (battle?.events || []).some((e) => e.area === "inside" && Number(e.code) === 61) ||
  (battle?.log || []).some((e) => /^Zdarzenie losowe \(61\): Zaraza/.test(e.text || ""));

const modelName = (u, i) => (R.modelCount(u) > 1 ? `${R.label(u)} #${i + 1}` : R.label(u));

export const plagueTasks = (post, battle) =>
  hadPlague(battle)
    ? post.units.flatMap((u) =>
        isImmune(u)
          ? []
          : Array.from({ length: R.modelCount(u) }, (_, i) => ({
              unitId: u.uniqueId,
              index: i,
              key: `${u.uniqueId}:${i}`,
              unit: u,
              label: modelName(u, i),
            })).filter(
              (t) =>
                post.plague?.[t.key] ||
                (!u.battleAbsentModels?.[t.index] &&
                  !u.campaignModelStatus?.[t.index]?.dead &&
                  !u.campaignModelStatus?.[t.index]?.captured),
            ),
      )
    : [];

// The app's convention for a characteristic test on K6: 1 passes, 6 fails.
export const failsToughness = (unit, die) => die === 6 || (die !== 1 && die > R.currentStats(unit)[4]);

const EFFECT = (d) => (d === 1 ? "dead" : d === 6 ? "recovered" : "skip");
export const PLAGUE_TEXT = {
  absent: "nie było go na stole, gdy pojawiła się zaraza",
  passed: "zdał test WT",
  dead: "umiera na zarazę (jak MARTWY)",
  skip: "choruje, opuszcza następną potyczkę",
  recovered: "choruje, ale wraca do zdrowia",
};

// { absent } or { test: [d], effect: [d] }.
export function applyPlague(post, task, { absent = false, test = [], effect = [] } = {}) {
  post.plague = post.plague || {};
  if (post.plague[task.key]) throw Error("Zarazę tego modelu już rozstrzygnięto.");
  const unit = post.units.find((u) => u.uniqueId === task.unitId);
  const before = { ...(unit.campaignModelStatus?.[task.index] || {}) };
  let result = "absent";
  if (!absent) {
    if (!R.validDice(test, 1)) throw Error(`Wykonaj test WT: ${task.label}.`);
    result = "passed";
    if (failsToughness(unit, test[0])) {
      if (!R.validDice(effect, 1)) throw Error(`Rzuć K6 na skutki zarazy: ${task.label}.`);
      result = EFFECT(effect[0]);
    }
  }
  const status = { ...before };
  if (result === "dead") status.dead = true;
  if (result === "skip") status.skip = Math.max(Number(status.skip) || 0, 1);
  unit.campaignModelStatus = Array.from({ length: R.modelCount(unit) }, (_, i) =>
    i === task.index ? status : { ...(unit.campaignModelStatus?.[i] || {}) },
  );
  if (result === "dead" && unit.type === "Postać Dramatu")
    post.deadDrama = [...new Set([...(post.deadDrama || []), unit.dramaId || unit.unitName])];
  // A dead hero leaves an availability pool drawn up already (unused token).
  let token = null;
  if (result === "dead" && task.index === 0 && post.availability) {
    token = post.availability.find((t) => t.unitId === unit.uniqueId && !t.used) || null;
    if (token) post.availability = post.availability.filter((t) => t !== token);
  }
  post.plague[task.key] = { result, test, effect, before, label: task.label, ...(token ? { token } : {}) };
  if (result !== "absent")
    R.log(post, "injury", `Zaraza: ${task.label} ${PLAGUE_TEXT[result]}${test.length ? ` (WT K6: ${test[0]}${effect.length && result !== "passed" ? `, skutek K6: ${effect[0]}` : ""})` : ""}.`, { unitId: unit.uniqueId });
}

export function undoPlague(post, task) {
  const done = post.plague?.[task.key];
  if (!done) return;
  const unit = post.units.find((u) => u.uniqueId === task.unitId);
  unit.campaignModelStatus = Array.from({ length: R.modelCount(unit) }, (_, i) =>
    i === task.index ? { ...done.before } : { ...(unit.campaignModelStatus?.[i] || {}) },
  );
  if (done.token && post.availability) post.availability = [...post.availability, done.token];
  delete post.plague[task.key];
}
