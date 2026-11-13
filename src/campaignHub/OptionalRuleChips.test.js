import React from "react";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { OptionalRuleChips, pdBadge } from "./OptionalRulesPicker";

test("a rule chip opens the rule with what the app counts", () => {
  render(<OptionalRuleChips keys={["USZKODZENIE PANCERZA", "KRYTYCZNY PECH"]} />);
  fireEvent.click(screen.getByRole("button", { name: /Uszkodzenie pancerza/ }));
  const dialog = screen.getByRole("dialog");
  expect(within(dialog).getByText(/\+1 łup w eksploracji dolicza się sam/)).toBeTruthy();
  fireEvent.keyDown(document, { key: "Escape" });
  fireEvent.click(screen.getByRole("button", { name: /Krytyczny pech/ }));
  expect(within(screen.getByRole("dialog")).getByText(/aplikacja niczego tu nie liczy/)).toBeTruthy();
});

test("badges name the PD condition and the loot", () => {
  expect(pdBadge("NAGŁA ŚMIERĆ")).toBe("+1 PD: bohaterowie (6+ rund)");
  expect(pdBadge("USZKODZENIE PANCERZA")).toBe("+1 łup");
  expect(pdBadge("KRYTYCZNY PECH")).toBeNull();
});
