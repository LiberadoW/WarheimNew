// Round pairings: everyone plays once per round, repeat opponents are
// avoided when possible, and with an odd number of players the one with the
// fewest byes so far sits out.

const pairKey = (a, b) => [a, b].sort().join("|");

export const playedPairs = (games) => {
  const counts = new Map();
  games
    .filter((g) => (g.players || []).length === 2)
    .forEach((g) => {
      const key = pairKey(...g.players);
      counts.set(key, (counts.get(key) || 0) + 1);
    });
  return counts;
};

const byeCounts = (games) => {
  const counts = new Map();
  games.filter((g) => g.bye).forEach((g) => counts.set(g.players[0], (counts.get(g.players[0]) || 0) + 1));
  return counts;
};

const shuffle = (list, random) => {
  const out = [...list];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
};

// Pairs neighbours in a shuffled order, each player with the first remaining
// one they've played least often.
const greedyPairs = (players, played) => {
  const left = [...players];
  const pairs = [];
  let repeats = 0;
  while (left.length >= 2) {
    const a = left.shift();
    let best = 0;
    left.forEach((b, i) => {
      if ((played.get(pairKey(a, b)) || 0) < (played.get(pairKey(a, left[best])) || 0)) best = i;
    });
    const [b] = left.splice(best, 1);
    repeats += played.get(pairKey(a, b)) || 0;
    pairs.push([a, b]);
  }
  return { pairs, repeats };
};

export const generatePairings = (players, games = [], random = Math.random, attempts = 200) => {
  if (players.length < 2) return { pairs: [], bye: players[0] || null, repeats: 0 };
  let pool = [...players];
  let bye = null;
  if (pool.length % 2 === 1) {
    const byes = byeCounts(games);
    const fewest = Math.min(...pool.map((p) => byes.get(p) || 0));
    const candidates = pool.filter((p) => (byes.get(p) || 0) === fewest);
    bye = candidates[Math.floor(random() * candidates.length)];
    pool = pool.filter((p) => p !== bye);
  }
  const played = playedPairs(games);
  let best = null;
  for (let i = 0; i < attempts; i++) {
    const result = greedyPairs(shuffle(pool, random), played);
    if (!best || result.repeats < best.repeats) best = result;
    if (best.repeats === 0) break;
  }
  return { ...best, bye };
};

export const nextRound = (games) =>
  games.reduce((max, g) => Math.max(max, Number(g.round) || 0), 0) + 1;
