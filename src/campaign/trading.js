import * as R from "./rules";
import { companyLevel } from "./company";
export const chemicalKind = (item) =>
  /\(trucizna\)/i.test(item.name)
    ? "poison"
    : /\((mikstura|\s*narkotyk\s*)\)/i.test(item.name)
      ? "alchemy"
      : null;
export function discountDice(post, item) {
  const kind = chemicalKind(item);
  return (
    (Number(post.effects?.allDiscountDice) || 0) +
    (item.category === "Zwierzęta"
      ? Number(post.effects?.animalDiscountDice) || 0
      : 0) +
    (kind
      ? companyLevel(post, kind === "poison" ? "Truciciele" : "Alchemicy")
      : 0)
  );
}
// Pancerz dla WIELKOLUDA (rozdział 14): koszt pancerza x2. Plain body armour has
// dedicated "(dla wielkoluda)" catalog entries; other body armour is doubled.
const BODY_ARMOUR = /pancerz|zbroja/i;
export const giantArmour = (unit, item) =>
  !!unit &&
  R.hasRule(unit, "Wielkolud") &&
  item.category === "Tarcza i pancerz" &&
  BODY_ARMOUR.test(item.name) &&
  !/dla wielkoluda/i.test(item.name);
export const giantArmourBlocked = (unit, item) =>
  giantArmour(unit, item) && /^(lekki|średni|ciężki) pancerz$/i.test(item.name.trim())
    ? `Wielkolud kupuje „${item.name} (dla wielkoluda)” – koszt x2.`
    : null;
// PODATEK (s. 48): +K6 do 20 zk ceny podstawowej, +2K6 do 50 zk, +3K6 powyżej.
export const hasTax = (post) =>
  (post.armyRules || []).some((r) => R.baseName(r) === "podatek");
export const taxDice = (post, basePrice) =>
  !hasTax(post) || basePrice == null
    ? 0
    : basePrice <= 20
      ? 1
      : basePrice <= 50
        ? 2
        : 3;
export const basePriceOf = (item, baseDice, unit) => {
  try {
    const price = R.priceRoll(item.price, baseDice).price;
    return giantArmour(unit, item) ? price * 2 : price;
  } catch {
    return null;
  }
};
export function quotePrice(post, item, baseDice, discountRoll, extra = {}) {
  const base = basePriceOf(item, baseDice, extra.unit),
    count = discountDice(post, item),
    tax = taxDice(post, base);
  if (base == null) throw Error("Ustal cenę przedmiotu.");
  if (count && !R.validDice(discountRoll, count))
    throw Error("Wykonaj rzut na zniżkę.");
  if (tax && !R.validDice(extra.taxRoll, tax))
    throw Error("Wykonaj rzut na podatek.");
  return (
    Math.max(
      1,
      Math.ceil(base * (post.effects?.strigosDiscount ? 0.5 : 1)) -
        R.sum(discountRoll || []),
    ) + (tax ? R.sum(extra.taxRoll) : 0)
  );
}
export function settleStrigos(post, dice) {
  if (!post.effects?.strigosTheftPending || post.tradeClosed)
    throw Error("Brak oczekującego handlu ze Strigosem.");
  if (!R.validDice(dice, 1))
    throw Error("Wykonaj rzut K6 po zakończeniu handlu.");
  if (dice[0] >= 5) {
    post.treasury = 0;
    post.loot = 0;
  }
  post.tradeClosed = true;
  post.effects.strigosTheftPending = false;
  R.log(
    post,
    "strigos",
    `Zakończenie handlu z taborytami: ${dice[0]}. ${dice[0] >= 5 ? "Kradzież: utrata całego złota i łupów." : "Bez kradzieży."}`,
  );
}
