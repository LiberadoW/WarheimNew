import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import armies from "../Data.js/Armies";
import { createUnit } from "../Functions/createUnit";
import RosterView from "./RosterView";
import { countModels, groupRoster, plural, summarizeUnit } from "./roster";
import { makeInviteCode, normalizeInviteCode, playerName } from "./campaignService";
import { getShortEquipment } from "../Functions/displayEquipment";

const heroes = armies["Cyrkowcy z Ligii Ostermarku"].heroes;
const unit = (name, extra = {}) => ({ ...createUnit(heroes, name), ...extra });

describe("roster summary", () => {
  test("uses current stats, lasting injuries and the custom name", () => {
    const szarlatan = unit("Szarlatan", {
      unitDisplayName: "Fryc",
      stats: { ...heroes.Szarlatan.stats, Aktualna: [4, 2, 3, 3, 2, 1, 3, 1, 7] },
      injuries: ["Rana dłoni", "Powrót do zdrowia"],
      exp: 9,
    });
    const summary = summarizeUnit(szarlatan);
    expect(summary.name).toBe("Fryc");
    expect(summary.profile).toBe("Szarlatan");
    expect(summary.stats).toEqual([4, 2, 3, 3, 2, 1, 3, 1, 7]);
    expect(summary.injuries).toEqual(["Rana dłoni"]);
    expect(summary.exp).toBe(9);
  });

  test("groups units by type and counts models", () => {
    const list = [
      unit("Cyrkowiec", { selectedNumber: 3 }),
      unit("Mecenas"),
      unit("Ogr"),
    ];
    expect(groupRoster(list).map((g) => g.title)).toEqual(["Bohaterowie", "Stronnicy"]);
    expect(countModels(list)).toBe(5);
  });

  test("short equipment counts duplicates and names armour", () => {
    expect(
      getShortEquipment({
        startingEquipment: ["Sztylet"],
        optionalEquipment: ["Pistolet", "Pistolet", "Lekki"],
      }),
    ).toEqual(["Sztylet", "Pistolet ×2", "Lekki pancerz"]);
  });
});

describe("invite codes and names", () => {
  test("codes are 6 unambiguous characters", () => {
    const code = makeInviteCode();
    expect(code).toMatch(/^[A-HJ-NP-Z2-9]{6}$/);
    expect(makeInviteCode(() => 0)).toBe("AAAAAA");
  });

  test("typed codes are cleaned up", () => {
    expect(normalizeInviteCode(" k7w-3qx ")).toBe("K7W3QX");
    expect(normalizeInviteCode(undefined)).toBe("");
  });

  test("player name falls back to the e-mail", () => {
    expect(playerName({ displayName: "Wojtek" })).toBe("Wojtek");
    expect(playerName({ email: "gracz@example.com" })).toBe("gracz");
  });
});

test("Polish plurals", () => {
  expect([1, 2, 4, 5, 12, 22, 25].map((n) => plural(n, "gracz", "gracze", "graczy"))).toEqual([
    "1 gracz",
    "2 gracze",
    "4 gracze",
    "5 graczy",
    "12 graczy",
    "22 gracze",
    "25 graczy",
  ]);
});

test("roster view shows stats, equipment and rule texts", () => {
  render(<RosterView armyList={[unit("Mecenas")]} title="Rozpiska" />);
  expect(screen.getByText("Mecenas")).not.toBeNull();
  expect(screen.getByText(/Sztylet/)).not.toBeNull();
  fireEvent.click(screen.getByRole("button", { name: "Dowódca" }));
  expect(screen.getByRole("dialog")).not.toBeNull();
});
