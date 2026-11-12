// Builds src/campaign/scenario-treasure.json: what each rulebook scenario's
// treasure markers (znaczniki kosztowności) give after the skirmish, read
// from the scenario texts in src/campaignHub/data/scenarios.json.
//   node scripts/build-scenario-treasure.js
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const data = JSON.parse(fs.readFileSync(path.join(root, "src/campaignHub/data/scenarios.json"), "utf8"));
const all = [...data.inside, ...data.outside, ...data.special];
const key = (s) => `${s.special ? "special" : s.area}:${s.code}:${s.name}`;
const sentence = (text, re) => (text.match(new RegExp(`[^.]*${re.source}[^.]*\\.`)) || [""])[0].trim();

// Chest tables (rozdział 11): the results that add one loot, and what the
// other results give. Rubies and gunpowder are applied; the legendary
// treasure of 'Pod łysym zbójem' is listed for the player.
const CHESTS = {
  Fajerwerki: { loot: [3, 6], other: { from: 1, to: 2, kind: "item", item: "Krasnoludzki proch", dice: "K3" } },
  "Grzmiąca góra": { loot: [3, 6], other: { from: 1, to: 2, kind: "gold", dice: "K6x15" } },
  "'Pod łysym zbójem'": { loot: [1, 5], other: { from: 6, to: 6, kind: "manual" } },
};

const out = {};
for (const s of all) {
  const text = s.sections.map((x) => x.text).join(" ").replace(/\s+/g, " ");
  const rule = {};
  if (/o \+1 za każdy znacznik kosztowności|o liczbę ewentualnych znaczników kosztowności/.test(text))
    rule.lootPerMarker = true;
  if (/\+1 PD za każdy znacznik kosztowności|\+1 Punkt Doświadczenia za każdy znacznik kosztowności/.test(text))
    rule.pdPerMarker = true;
  if (CHESTS[s.name]) rule.chest = CHESTS[s.name];
  if (/K3\+2/.test(text) && /Łup/.test(sentence(text, /K3\+2/)))
    rule.bonus = { dice: "K3+2", condition: sentence(text, /K3\+2/) };
  else if (/dodatkowe K3 Łupy/.test(text))
    rule.bonus = { dice: "K3", condition: sentence(text, /dodatkowe K3 Łupy/) };
  if (Object.keys(rule).length) out[key(s)] = { name: s.name, page: s.page, ...rule };
}
fs.writeFileSync(path.join(root, "src/campaign/scenario-treasure.json"), JSON.stringify(out, null, 1) + "\n");
console.log(Object.keys(out).length, "scenarios with treasure rules");
