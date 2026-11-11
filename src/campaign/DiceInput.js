import React, { useEffect, useRef, useState } from "react";
import { roll, validDice } from "./rules";
export default function DiceInput({
  label = "Rzut",
  count = 1,
  value = [],
  onChange,
  disabled = false,
  // The app rolled these dice elsewhere (e.g. "roll all"): keep them locked.
  rolled = false,
}) {
  const [appRolled, setAppRolled] = useState(validDice(value, count));
  const used = useRef(appRolled);
  useEffect(() => {
    if (!value.some((die) => die !== "" && die != null)) {
      used.current = false;
      setAppRolled(false);
    } else if (rolled && validDice(value, count)) {
      used.current = true;
      setAppRolled(true);
    }
  }, [value, rolled, count]);
  const complete = validDice(value, count);
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
            disabled={appRolled}
            min="1"
            max="6"
            step="1"
            aria-label={`${label}, kość ${i + 1}`}
            value={value[i] ?? ""}
            onChange={(e) => {
              if (appRolled || disabled) return;
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
          disabled={disabled || appRolled || complete}
          onClick={() => {
            if (used.current || disabled || complete) return;
            used.current = true;
            setAppRolled(true);
            onChange(roll(count), "app");
          }}
        >
          {appRolled || complete ? "Wynik zapisany" : "Rzuć"}
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
