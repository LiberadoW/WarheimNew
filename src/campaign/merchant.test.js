import React, { useState } from "react";
import { render, screen, fireEvent, within } from "@testing-library/react";
import MerchantCard from "./MerchantCard";
import { MERCHANT_POTIONS, addMerchantPotion, buyFromMerchant, merchantOffer, merchantVisits, setMerchantStock } from "./merchant";

const post = (extra = {}) => ({ units: [], armyRules: [], treasury: 100, inventory: [], journal: [], ...extra });

test("the merchant comes to the winner after event 46 inside the walls", () => {
  expect(merchantVisits({ result: "win", events: [{ code: 46, area: "inside" }] })).toBe(true);
  expect(merchantVisits({ result: "loss", events: [{ code: 46, area: "inside" }] })).toBe(false);
  expect(merchantVisits({ result: "win", log: [{ text: "Zdarzenie losowe (46): Wędrowny handlarz" }] })).toBe(true);
  expect(merchantVisits({ result: "win", events: [{ code: 46, area: "outside" }] })).toBe(false);
});

test("the whole list is on offer; poisons and potions can be added, drugs not", () => {
  const p = post();
  expect(merchantOffer(p).map((o) => o.label)).toHaveLength(16);
  expect(MERCHANT_POTIONS.every((i) => /\((trucizna|mikstura)\)/.test(i.name))).toBe(true);
  addMerchantPotion(p, MERCHANT_POTIONS[0].id);
  expect(merchantOffer(p)).toHaveLength(17);
});

test("half price, K3 stock, Podatek and the item lands in the stash", () => {
  const p = post({ armyRules: ["Podatek"] });
  expect(() => buyFromMerchant(p, "Kusza")).toThrow(/zapas/);
  setMerchantStock(p, "Kusza", 2); // K3 = 1
  expect(() => buyFromMerchant(p, "Kusza")).toThrow(/podatek/);
  expect(() => buyFromMerchant(p, "Kusza", { taxRoll: [2, 3] })).toThrow(/podatek/); // 13 zk → K6, not 2K6
  buyFromMerchant(p, "Kusza", { taxRoll: [4] }); // 25 → 13 + K6 tax
  expect(p.treasury).toBe(100 - 13 - 4);
  expect(p.inventory[0]).toMatchObject({ name: "Kusza", quantity: 1, basePrice: 25 });
  expect(() => buyFromMerchant(p, "Kusza", { taxRoll: [1, 1] })).toThrow(/nie ma już/);
  setMerchantStock(p, "Święta relikwia", 6); // K3 = 3
  // 50+2K6 = 52: half 26 → 2K6 tax (21–50 zk).
  buyFromMerchant(p, "Święta relikwia", { priceDice: [1, 1], taxRoll: [1, 1] });
  expect(p.treasury).toBe(83 - 28);
});

test("the card rolls the stock and buys at half price", () => {
  let latest;
  function Harness() {
    const [p, setP] = useState(post({ treasury: 50 }));
    latest = p;
    const update = (fn) => setP((cur) => { const c = JSON.parse(JSON.stringify(cur)); fn(c); return c; });
    return <MerchantCard post={p} update={update} />;
  }
  render(<Harness />);
  fireEvent.click(screen.getByRole("button", { name: /Rzuć zapasy/ }));
  expect(Object.keys(latest.merchant.stock)).toHaveLength(16);
  const miecz = within(screen.getByText("Miecz").closest("li"));
  fireEvent.click(miecz.getByRole("button", { name: "Kup za 5 zk" })); // Miecz 10 → 5
  expect(latest.treasury).toBe(45);
  expect(latest.inventory.map((i) => i.name)).toEqual(["Miecz"]);
});
