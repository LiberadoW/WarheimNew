import armies from "../Data.js/Armies";
import { currentStats, hasRule, isHero } from "../campaign/rules";

// Dary Chaosu (s. 46). The stats use the roster's characteristic order.
export const CHAOS_GIFTS = {
  2: { name: "Szaleństwo", rule: "Głupota" },
  3: { name: "Odporność", stat: 4, delta: 1, text: "+1 Wt (maks. 10)" },
  4: { name: "Krzepa rzeźnika", stat: 3, delta: 1, text: "+1 S (maks. 10)" },
  5: { name: "Burza ostrzy", stat: 7, delta: 1, text: "+1 A (maks. 10)" },
  6: { name: "Żelazna skóra", rule: "Żelazoskóry" },
  7: { name: "Nie kłopocz mnie, robaku…", text: "Brak efektu" },
  8: { name: "Płomienie Chaosu", rule: "Odporność na magię (3)" },
  9: { name: "Wódz hordy", stat: 8, delta: 1, text: "+1 CP (maks. 10)" },
  10: { name: "Strach", rule: "Strach" },
  11: { name: "Tarcza Boga", rule: "Magiczna ochrona (4+)" },
  12: { name: "Widzę cię, śmiertelniku…", stat: 8, delta: -1, rule: "Głupota", text: "−1 CP (min. 2) i Głupota" },
};

export function eyeOfChaos(killer, victim) {
  if (!killer || !victim || killer.owner === victim.owner || !isHero(killer.unit)) return null;
  if (!isHero(victim.unit) && !hasRule(victim.unit, "Duży cel") && !hasRule(victim.unit, "Wielkolud")) return null;
  const list = killer.side.list;
  const company = { rules: [...(armies[list?.armyType]?.armyRules || []), ...(list?.campaignNotes?.specialRules || [])] };
  if (!hasRule(killer.unit, "Oko Chaosu") && !hasRule(company, "Oko Chaosu")) return null;
  const held = (killer.unit.rules || [])
    .map((rule) => Number(/^Dar Chaosu\s*\((\d+)\)$/i.exec(rule)?.[1]))
    .filter((result) => CHAOS_GIFTS[result]);
  return { hero: killer.label, target: victim.label, held };
}

export const chaosTakedowns = (play) => (play?.log || []).filter((entry) => entry.type === "takedown" && entry.eyeOfChaos && entry.killer);
const sameHero = (entry, owner, id) => entry.killer.owner === owner && entry.killer.unitId === id;

export const alreadyHasGift = (play, entry, result) =>
  result !== 7 && (
    (entry.eyeOfChaos.held || []).includes(result) ||
    chaosTakedowns(play).some((other) =>
      other.id !== entry.id && sameHero(other, entry.killer.owner, entry.killer.unitId) &&
      play.chaosGifts?.[other.id]?.result === result,
    )
  );

// The game screen derives a display profile. The post-battle sequence keeps
// using the saved roster, so these effects expire with the potyczka.
export function withChaosGifts(unit, play, owner) {
  const gifts = chaosTakedowns(play)
    .filter((entry) => sameHero(entry, owner, unit.uniqueId))
    .map((entry) => CHAOS_GIFTS[play.chaosGifts?.[entry.id]?.result])
    .filter(Boolean);
  if (!gifts.length) return unit;
  const stats = [...currentStats(unit)];
  const rules = new Set(unit.rules || []);
  for (const gift of gifts) {
    if (gift.rule) rules.add(gift.rule);
    if (gift.stat !== undefined && Number.isFinite(stats[gift.stat])) {
      const value = stats[gift.stat] + gift.delta;
      stats[gift.stat] = gift.delta > 0 ? Math.min(10, value) : Math.max(2, value);
    }
  }
  return { ...unit, stats: { ...unit.stats, Aktualna: stats }, rules: [...rules] };
}
