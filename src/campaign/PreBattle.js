import React from "react";
import * as R from "./rules";
import DiceInput from "./DiceInput";
export const oldWoundUnits = (units) =>
  units.filter(
    (u) =>
      (u.injuries || []).some((n) => R.baseName(n) === "stare wojenne rany") &&
      !u.battleAbsentModels?.[0],
  );
export default function PreBattle({ units, setUnits, battle, setBattle }) {
  const rolls = battle.preBattleRolls || {};
  const setRolls = (preBattleRolls) => setBattle({ ...battle, preBattleRolls });
  const pending = oldWoundUnits(units).filter(
    (u) => !battle.preBattle?.[u.uniqueId],
  );
  if (!pending.length) return null;
  return (
    <section className="campaign-card">
      <h3>Przed potyczką: stare wojenne rany</h3>
      {pending.map((u) => (
        <div key={u.uniqueId}>
          <DiceInput
            label={`Stare wojenne rany: ${R.label(u)}`}
            value={rolls[u.uniqueId] || []}
            onChange={(dice) => setRolls({ ...rolls, [u.uniqueId]: dice })}
          />
          <button
            className="button"
            disabled={!R.validDice(rolls[u.uniqueId], 1)}
            onClick={() => {
              const dice = rolls[u.uniqueId];
              if (dice[0] === 1)
                setUnits(
                  units.map((x) =>
                    x.uniqueId === u.uniqueId
                      ? {
                          ...x,
                          battleAbsentModels: Array.from(
                            { length: R.modelCount(x) },
                            () => true,
                          ),
                        }
                      : x,
                  ),
                );
              setBattle({
                ...battle,
                preBattle: {
                  ...(battle.preBattle || {}),
                  [u.uniqueId]: { dice, absent: dice[0] === 1 },
                },
              });
            }}
          >
            Zatwierdź udział: {R.label(u)}
          </button>
        </div>
      ))}
    </section>
  );
}
