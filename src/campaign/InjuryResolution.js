import React from "react";
import DiceInput from "./DiceInput";
import { validDice, k66, multipleInjury } from "./rules";
import mental from "./mental-injuries.json";
export default function InjuryResolution({ result, value, onChange }) {
  const d = value || {};
  const code = result.min || result.code;
  // Wielokrotnie zraniony: a corrected K3 trims the extra wounds to the new count.
  const secondary = (next) =>
    onChange(
      code === 16 && validDice(next, 1)
        ? {
            ...d,
            secondary: next,
            children: (d.children || []).slice(0, Math.ceil(next[0] / 2)),
          }
        : { ...d, secondary: next },
    );
  const hasSecondary =
    [16, 23, 25, 56].includes(code) || (code === 35 && !result.simple);
  const children = d.children || [];
  const child = (i, next) => {
    const list = [...children];
    list[i] = next;
    onChange({ ...d, children: list });
  };
  const multipleCount =
    code === 16 && validDice(d.secondary, 1)
      ? Math.ceil(d.secondary[0] / 2)
      : code === 65 &&
          d.arena === "loss" &&
          validDice(d.secondary, 1) &&
          d.secondary[0] <= 2
        ? 1
        : 0;
  const illness =
    code === 24 && validDice(d.mental, 2)
      ? mental.find((x) => x.code === k66(d.mental))
      : null;
  return (
    <div>
      {hasSecondary && (
        <DiceInput
          label={
            code === 16
              ? "Liczba ran K3 (K6/2 w górę)"
              : code === 35
                ? "Czas leczenia K3 (K6/2 w górę)"
                : code === 56
                  ? "Cel nienawiści"
                  : "Dodatkowy rzut K6"
          }
          value={d.secondary || []}
          onChange={secondary}
        />
      )}
      {code === 24 && (
        <>
          <DiceInput
            label="Choroba psychiczna K66"
            count={2}
            value={d.mental || []}
            onChange={(dice) => onChange({ ...d, mental: dice })}
          />
          {illness && (
            <>
              <h4>{illness.name}</h4>
              <p>{illness.text}</p>
            </>
          )}
        </>
      )}
      {code === 65 && (
        <>
          <p>
            Rozegraj walkę z gladiatorem według opisu (rzut na to, kto szarżuje,
            możesz zapisać w dodatkowych rzutach).
          </p>
          <label>
            Wynik walki
            <select
              value={d.arena || ""}
              onChange={(e) => onChange({ ...d, arena: e.target.value })}
            >
              <option value="">Wybierz</option>
              <option value="win">Bohater wygrał: +50 zk, +2 PD</option>
              <option value="loss">Bohater przegrał</option>
            </select>
          </label>
          {d.arena === "loss" && (
            <DiceInput
              label="Następstwa porażki na arenie"
              value={d.secondary || []}
              onChange={secondary}
            />
          )}
        </>
      )}
      {Array.from({ length: multipleCount }, (_, i) => {
        const node = children[i] || {};
        const sub = validDice(node.dice, 2) ? multipleInjury(node.dice) : null;
        return (
          <article className="campaign-card" key={i}>
            <DiceInput
              label={`Dodatkowa rana ${i + 1} K66`}
              count={2}
              value={node.dice || []}
              onChange={(dice) => child(i, { ...node, dice })}
            />
            {sub && (
              <>
                <h4>{sub.name}</h4>
                <p>{sub.text}</p>
                <InjuryResolution
                  result={sub}
                  value={node}
                  onChange={(next) => child(i, next)}
                />
              </>
            )}
          </article>
        );
      })}
      {[24, 56, 65].includes(code) && (
        <label>
          Rozstrzygnięte wybory / skutki zasady
          <textarea
            value={d.note || ""}
            onChange={(e) => onChange({ ...d, note: e.target.value })}
          />
        </label>
      )}
    </div>
  );
}
