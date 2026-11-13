import table from "./scenario-treasure.json";
import * as R from "./rules";

// Znaczniki kosztowności (rozdział 11). Each unit records the markers it
// ended the skirmish with (battleTreasure); the scenario's text decides what
// they give. scenario-treasure.json is built by scripts/build-scenario-treasure.js.

export const treasureRules = (battle) => table[battle?.scenarioRecord?.key] || null;
export const markerCount = (units = []) =>
  units.reduce((n, u) => n + Math.max(0, Number(u.battleTreasure) || 0), 0);
const k3 = (die) => Math.ceil(die / 2);
// Polish plural: 1 łup, 2–4 łupy (not 12–14), otherwise łupów.
export const lootWord = (n) => {
  const a = Math.abs(n);
  if (a === 1) return "łup";
  return a % 10 >= 2 && a % 10 <= 4 && (a % 100 < 12 || a % 100 > 14) ? "łupy" : "łupów";
};
const roll = (expression, die) =>
  expression === "K3+2" ? k3(die) + 2 : expression === "K3" ? k3(die) : expression === "K6x15" ? die * 15 : die;

// "+1 PD za każdy znacznik kosztowności, z którym zakończył rozgrywkę":
// heroes only, added as a named source when the sequence starts.
export function addTreasurePd(post, battle) {
  if (!treasureRules(battle)?.pdPerMarker) return;
  post.units.forEach((u) => {
    const n = Math.max(0, Number(u.battleTreasure) || 0);
    if (n && R.isHero(u)) R.addBattleExp(u, n, "Znaczniki kosztowności");
  });
}

// What the markers and the scenario's reward add in the exploration phase,
// and which dice or answers are still missing.
// ZDARZENIA LOSOWE (s. 398): +1 loot in the exploration for every random
// event of the skirmish, for each player's company. Counted from the
// shared game's log (battle.randomEvents) or the play-mode battle log.
export const eventCount = (battle) =>
  Number.isInteger(battle?.randomEvents)
    ? battle.randomEvents
    : (battle?.log || []).filter((e) => /^Zdarzenie losowe/.test(e.text || "")).length;

export function treasureState(battle, post) {
  const rule = treasureRules(battle);
  const t = post.exploration?.treasure || {};
  const counted = markerCount(post.units);
  const countedEvents = eventCount(battle);
  if (!rule && !counted && !countedEvents && !Number.isInteger(t.events)) return null;
  const markers = Number.isInteger(t.markers) ? t.markers : counted;
  const events = Number.isInteger(t.events) ? t.events : countedEvents;
  const out = { rule, counted, markers, countedEvents, events, loot: 0, gold: 0, items: [], manual: [], missing: "", lines: [] };
  const need = (text) => {
    if (!out.missing) out.missing = text;
  };
  if (events) {
    out.loot += events;
    out.lines.push(`Zdarzenia losowe (${events}): +${events} ${lootWord(events)}`);
  }
  if (!rule && !markers && !Number.isInteger(t.manualLoot)) return out;
  if (!rule) {
    // A custom scenario: the player reads their own rules.
    const loot = Number.isInteger(t.manualLoot) ? t.manualLoot : markers;
    out.loot += loot;
    out.lines.push(`Scenariusz własny: +${loot} ${lootWord(loot)} za kosztowności`);
    return out;
  }
  if (rule.lootPerMarker && markers) {
    out.loot += markers;
    out.lines.push(`${markers} × znacznik kosztowności: +${markers} ${lootWord(markers)}`);
  }
  if (rule.chest && markers) {
    const dice = t.chest || [];
    for (let i = 0; i < markers; i++) {
      const d = dice[i];
      if (!R.validDice([d], 1)) {
        need("Rzuć K6 za każdy znacznik kosztowności.");
        continue;
      }
      const [lo, hi] = rule.chest.loot;
      if (d >= lo && d <= hi) {
        out.loot += 1;
        out.lines.push(`Znacznik ${i + 1} (K6: ${d}): +1 łup`);
        continue;
      }
      const other = rule.chest.other;
      if (other.kind === "manual") {
        out.manual.push(`Znacznik ${i + 1} (K6: ${d}): legendarny skarb, rozlicz według tabeli scenariusza (s. ${rule.page}).`);
        continue;
      }
      const extra = (t.chestOther || [])[i];
      if (!R.validDice([extra], 1)) {
        need(other.kind === "gold" ? "Rzuć na wartość rubinu (K6 × 15 zk)." : "Rzuć K3 na porcje krasnoludzkiego prochu.");
        continue;
      }
      const value = roll(other.dice, extra);
      if (other.kind === "gold") {
        out.gold += value;
        out.lines.push(`Znacznik ${i + 1} (K6: ${d}): rubin za ${value} zk`);
      } else {
        out.items.push({ name: other.item, quantity: value });
        out.lines.push(`Znacznik ${i + 1} (K6: ${d}): ${other.item} ×${value}`);
      }
    }
  }
  if (rule.bonus && t.bonusMet) {
    const d = (t.bonusDice || [])[0];
    if (!R.validDice([d], 1)) need(`Rzuć ${rule.bonus.dice} na nagrodę ze scenariusza.`);
    else {
      const value = roll(rule.bonus.dice, d);
      out.loot += value;
      out.lines.push(`Nagroda ze scenariusza (${rule.bonus.dice}, K6: ${d}): +${value} ${lootWord(value)}`);
    }
  }
  return out;
}

export function applyTreasure(post, battle) {
  const s = treasureState(battle, post);
  if (!s) return;
  if (s.missing) throw Error(s.missing);
  post.loot += s.loot;
  post.treasury += s.gold;
  s.items.forEach((i) => R.storeItem(post, i.name, i.quantity));
  if (s.lines.length || s.manual.length)
    R.log(post, "treasure", `Kosztowności: ${[...s.lines, ...s.manual].join("; ")}.`);
}
