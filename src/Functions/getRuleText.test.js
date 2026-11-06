import armies from "../Data.js/Armies";
import { mercenariesList } from "../Data.js/Mercenaries";
import { pdfRules } from "../Data.js/PdfRules";
import {
  getArmyRulesSummary,
  getEquipmentRules,
  getRuleText,
  getWeaponRuleNames,
} from "./getRuleText";

const collectUnitRules = () => {
  const rules = new Set();
  const walk = (value) => {
    if (!value || typeof value !== "object") return;
    if (Array.isArray(value.rules) && value.stats) {
      value.rules.forEach((rule) => rules.add(rule));
    }
    Object.values(value).forEach(walk);
  };
  Object.values(armies).forEach(walk);
  walk(mercenariesList);
  return [...rules];
};

describe("getRuleText", () => {
  test("finds warheimer texts regardless of case and parameters", () => {
    expect(getRuleText("Mistrz miecza")).toMatch(/MISTRZ MIECZA/);
    expect(getRuleText("Rozproszenie magii (2)")).toMatch(/ROZPROSZENIE MAGII/);
    expect(getRuleText("Duchowny (modlitwy do Ranalda)")).not.toBe("");
    expect(getRuleText("Odporność na magię (1)")).not.toBe("");
  });

  test("uses the psychology chapter instead of a cross-reference", () => {
    expect(getRuleText("Strach")).not.toMatch(/Zobacz ROZDZIAŁ 7/);
    expect(getRuleText("Strach")).toMatch(/test STRACHU/);
  });

  test("every unit rule in every band has a text", () => {
    // Unit rules the PDF gives no text for. Keep this list short and explicit.
    const withoutText = [];
    const missing = collectUnitRules().filter(
      (rule) => !getRuleText(rule) && !withoutText.includes(rule),
    );
    expect(missing).toEqual([]);
  });

  test("prefers the rulebook PDF texts", () => {
    expect(getRuleText("Mistrz miecza")).toBe(pdfRules["Mistrz miecza"]);
    expect(getRuleText("Męczennik")).toMatch(/Kostkę Męczeństwa/);
    expect(getRuleText("Żywy święty")).toMatch(/EGZORCYSTA/);
    expect(getRuleText("Za mną!")).toMatch(/ZIMNOKRWISTY/);
  });

  test("folds sub-sections into their parent rule", () => {
    expect(getRuleText("Barwy wojenne")).toMatch(/SZACHOWNICA:/);
    expect(getRuleText("Przymiot")).toMatch(/DZIERZBA:/);
    expect(getRuleText("Zwoje skryby")).toMatch(/TABELA ZWOJÓW SKRYBY/);
  });

  test("gives each stigma combination its own text", () => {
    const both = getRuleText("Stygmaty Nurgla (odór, rój much)");
    expect(both).toMatch(/^ODÓR/);
    expect(both).toMatch(/RÓJ MUCH/);
    expect(getRuleText("Stygmaty Nurgla (odór)")).not.toMatch(/RÓJ MUCH/);
    expect(getRuleText("Stygmat Khorna (kolczasty ogon)")).toMatch(
      /KOLCZASTY OGON/,
    );
  });

  test("has texts for rules defined outside chapter 8", () => {
    [
      "Konny",
      "Towarzysz Graala",
      "Ślubowanie",
      "Mistrzowie koni",
      "Magia Krwi",
      "Parowóz",
      "Żelazny Demon",
      "Strachulce",
      "Magiczna ochrona (6+)",
      "Duża dźgacz",
    ].forEach((rule) =>
      expect(Object.values(pdfRules)).toContain(getRuleText(rule)),
    );
  });

  test("leaves no glued words from the PDF extraction", () => {
    const glued = Object.values(pdfRules).join(" ").match(/\S{30,}/g) || [];
    expect(glued).toEqual([]);
  });
});

describe("weapon rules", () => {
  test("splits weapon rule strings into known rules", () => {
    expect(
      getWeaponRuleNames(
        "drzewcowa, limitowany (3); styl defensywny: ogłuszający, +2 do Ochrony Pancerza",
      ),
    ).toEqual(["Drzewcowa", "Limitowany (3)", "Ogłuszający"]);
  });

  test("lists rules granted by a unit's equipment", () => {
    const unit = {
      rules: [],
      startingEquipment: ["Halabarda"],
      optionalEquipment: ["Gwiazda zaranna"],
    };
    const rules = getEquipmentRules(unit);
    expect(rules["Drzewcowa"]).toEqual(["Halabarda"]);
    expect(rules["Przebicie pancerza"]).toEqual(["Gwiazda zaranna"]);
  });

  test("summarises rules for the printed roster", () => {
    const summary = getArmyRulesSummary([
      {
        rules: ["Dowódca", "Zasadzka"],
        startingEquipment: ["Sztylet", "Halabarda"],
        optionalEquipment: [],
      },
      {
        rules: ["Zasadzka"],
        startingEquipment: ["Halabarda"],
        optionalEquipment: [],
      },
    ]);
    expect(summary.unitRules).toEqual(["Dowódca", "Zasadzka"]);
    expect(summary.equipment).toEqual(["Halabarda", "Sztylet"]);
    expect(summary.equipmentRules.map(({ rule }) => rule)).toContain(
      "Drzewcowa",
    );
  });
});
