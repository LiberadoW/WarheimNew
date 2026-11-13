import * as R from "./rules";
import { hadEvent } from "./gameEvents";
import { taxDice } from "./trading";

// WĘDROWNY HANDLARZ (zdarzenie losowe 46, „Wewnątrz murów”, s. 402): after the
// game the winner may buy these items for half the price from chapter 14;
// the merchant has K3 of each. Any poison or potion is on offer too.
const OFFER = [
  ["Warkocz czosnku", "Warkocz czosnku"],
  ["Hełm", "Hełm"],
  ["Kusza", "Kusza"],
  ["Latarnia sztormowa", "Latarnia sztormowa"],
  ["Lina z hakiem", "Lina & hak"],
  ["Maczuga", "Buława/maczuga/młot bojowy"],
  ["Mapa", "Mapy"],
  ["Miecz", "Miecz"],
  ["Młot bojowy", "Buława/maczuga/młot bojowy"],
  ["Pistolet", "Pistolet (strzelanie)"],
  ["Pistolet pojedynkowy", "Pistolet pojedynkowy (strzelanie)"],
  ["Święta relikwia", "Święta relikwia"],
  ["Sztylet", "Sztylet"],
  ["Psia łapka", "Psia łapka"],
  ["Topór bojowy", "Topór bojowy / nadziak"],
  ["Woda błogosławiona", "Woda błogosławiona"],
];
const byName = (name) => R.catalog.find((i) => i.name === name) || null;
export const MERCHANT_POTIONS = R.catalog.filter(
  (i) => i.category === "Trucizny, mikstury i narkotyki" && /\((trucizna|mikstura)\)/i.test(i.name),
);

export const merchantVisits = (battle) => hadEvent(battle, 46, "inside") && battle?.result === "win";

// The goods on offer: the fixed list and the poisons or potions picked.
export const merchantOffer = (post) => [
  ...OFFER.map(([label, name]) => ({ key: label, label, item: byName(name) })).filter((o) => o.item),
  ...(post.merchant?.potions || [])
    .map((id) => R.catalog.find((i) => i.id === id))
    .filter(Boolean)
    .map((item) => ({ key: item.id, label: item.name, item })),
];

const ensure = (post) => {
  post.merchant = { stock: {}, potions: [], ...(post.merchant || {}) };
  return post.merchant;
};
export const addMerchantPotion = (post, id) => {
  const m = ensure(post);
  if (!MERCHANT_POTIONS.some((i) => i.id === id)) throw Error("Wybierz truciznę albo miksturę.");
  if (!m.potions.includes(id)) m.potions = [...m.potions, id];
};
// K3 of each item, from a K6.
export const setMerchantStock = (post, key, die) => {
  if (!R.validDice([die], 1)) throw Error("Rzuć K6 (K3) na zapas.");
  const m = ensure(post);
  if (m.stock[key] != null) throw Error("Zapas tego przedmiotu jest już ustalony.");
  m.stock[key] = Math.ceil(die / 2);
};

// Half the price (rolled for a price with dice), plus PODATEK on that half:
// the merchant's price is what the company pays for the item.
export const merchantQuote = (post, item, priceDice = [], taxRoll = []) => {
  const base = R.priceRoll(item.price, priceDice).price;
  const tax = taxDice(post, Math.ceil(base / 2));
  if (tax && !R.validDice(taxRoll, tax)) throw Error("Wykonaj rzut na podatek.");
  return { base, half: Math.ceil(base / 2), tax: tax ? R.sum(taxRoll) : 0, price: Math.ceil(base / 2) + (tax ? R.sum(taxRoll) : 0) };
};

export function buyFromMerchant(post, key, { priceDice = [], taxRoll = [] } = {}) {
  const offer = merchantOffer(post).find((o) => o.key === key);
  if (!offer) throw Error("Handlarz nie ma tego przedmiotu.");
  const m = ensure(post);
  if (m.stock[key] == null) throw Error("Najpierw ustal zapas (K3).");
  if (m.stock[key] < 1) throw Error("Handlarz nie ma już tego przedmiotu.");
  const q = merchantQuote(post, offer.item, priceDice, taxRoll);
  if (post.treasury < q.price) throw Error("Za mało złotych koron w skarbcu.");
  post.treasury -= q.price;
  m.stock[key] -= 1;
  R.storeItem(post, offer.item.name, 1, { catalogId: offer.item.id, basePrice: q.base });
  R.log(
    post,
    "purchase",
    `Wędrowny handlarz: ${offer.label} za ${q.price} zk (połowa ${q.base} zk${q.tax ? `, podatek ${q.tax} zk` : ""}) → skarbiec`,
    { catalogId: offer.item.id },
  );
}
