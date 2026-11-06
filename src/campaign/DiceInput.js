import React from "react";
import { roll, validDice } from "./rules";
export default function DiceInput({
  label = "Rzut",
  count = 1,
  value = [],
  onChange,
  disabled = false,
}) {
  return (
    <fieldset className="campaign-dice" disabled={disabled}>
      <legend>
        {label}
        {count === 2 ? " · 2K6" : ` · ${count}K6`}
      </legend>
      <div className="campaign-row">
        {Array.from({ length: count }, (_, i) => (
          <input
            key={i}
            type="number"
            min="1"
            max="6"
            step="1"
            aria-label={`${label}, kość ${i + 1}`}
            value={value[i] ?? ""}
            onChange={(e) => {
              const next = Array.from(
                { length: count },
                (_, j) => value[j] ?? "",
              );
              next[i] = e.target.value === "" ? "" : Number(e.target.value);
              onChange(next, "manual");
            }}
          />
        ))}
        <button
          type="button"
          className="button button-secondary"
          onClick={() => onChange(roll(count), "app")}
        >
          Rzuć
        </button>
        {validDice(value, count) && (
          <output>
            {value.join(" + ")} = {value.reduce((a, b) => a + b, 0)}
          </output>
        )}
      </div>
    </fieldset>
  );
}
