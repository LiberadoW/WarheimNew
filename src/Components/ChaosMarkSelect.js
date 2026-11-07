import React from "react";
import armies from "../Data.js/Armies";
import {
  CHAOS_MARKS,
  chaosMark,
  needsChaosMark,
  remarkUnits,
} from "../Functions/chaosMark";

// Chosen once, before recruiting: it decides spell lores and allowed demons.
export default function ChaosMarkSelect({
  army,
  campaignNotes,
  setCampaignNotes,
  unitList,
  setUnitList,
}) {
  const raw = armies[army?.name];
  if (!needsChaosMark(raw)) return null;
  const current = chaosMark(campaignNotes.chaosMark);
  const change = (key) => {
    if (key === campaignNotes.chaosMark) return;
    if (
      unitList.length &&
      !window.confirm(
        "Zmiana Mrocznej Potęgi zmieni dziedzinę magii i dostępne demony. Kontynuować?",
      )
    )
      return;
    setCampaignNotes((notes) => ({ ...notes, chaosMark: key }));
    setUnitList(remarkUnits(unitList, raw, key));
  };
  return (
    <div className={`chaos-mark${current ? "" : " chaos-mark-required"}`}>
      <label>
        <span>Znak Chaosu</span>
        <select
          value={current?.key || ""}
          onChange={(e) => change(e.target.value)}
          aria-describedby="chaos-mark-hint"
        >
          <option value="" disabled>
            Wybierz Mroczną Potęgę…
          </option>
          {CHAOS_MARKS.map((m) => (
            <option key={m.key} value={m.key}>
              {m.name} ({m.god})
            </option>
          ))}
        </select>
      </label>
      <p id="chaos-mark-hint">
        {current
          ? [
              current.lore ? `Magia: ${current.lore}` : "Mag: Demonolog",
              `Demon: ${current.demon}`,
              current.hatred,
            ]
              .filter(Boolean)
              .join(" · ")
          : "Wybierz przed rekrutacją: od tego zależą czary i dostępne demony."}
      </p>
    </div>
  );
}
