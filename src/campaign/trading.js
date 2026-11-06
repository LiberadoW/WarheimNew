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
export function quotePrice(post, item, baseDice, discountRoll) {
  const base = R.priceRoll(item.price, baseDice).price,
    count = discountDice(post, item);
  if (count && !R.validDice(discountRoll, count))
    throw Error("Wykonaj rzut na zniżkę.");
  return Math.max(
    1,
    Math.ceil(base * (post.effects?.strigosDiscount ? 0.5 : 1)) -
      R.sum(discountRoll || []),
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
