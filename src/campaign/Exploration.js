import React from "react";
import * as R from "./rules";
import DiceInput from "./DiceInput";

function Exploration({ battle, post, update }) {
  const eligible = R.eligibleHeroes(post.units);
  const count = Math.min(
    6,
    eligible.length + (battle.result === "win" ? 1 : 0),
  );
  const e = post.exploration || { dice: [], modifierReason: "", note: "" };
  const diceCount = e.countOverride ?? count;
  const kept = e.dice.filter((_, i) => !(e.discarded || []).includes(i));
  const result = R.validDice(e.dice, diceCount)
    ? R.explorationResult(kept, battle.area)
    : null;
  return (
    <>
      <p>
        {eligible.length} uprawnionych bohaterów
        {battle.result === "win" ? " +1 za zwycięstwo" : ""} · pula podstawowa:{" "}
        {count} K6 (maks. 6).
      </p>
      <details>
        <summary>Modyfikatory puli, przerzuty i odrzucanie kości</summary>
        <label>
          Zasada / przedmiot
          <input
            disabled={post.explorationApplied}
            value={e.modifierReason || ""}
            onChange={(ev) =>
              update((p) => {
                p.exploration = { ...e, modifierReason: ev.target.value };
              })
            }
          />
        </label>
        <label>
          Liczba rzucanych kości (po modyfikatorach)
          <input
            type="number"
            min="0"
            max="12"
            disabled={post.explorationApplied || !e.modifierReason?.trim()}
            value={diceCount}
            onChange={(ev) =>
              update((p) => {
                p.exploration = {
                  ...e,
                  countOverride: Math.max(
                    0,
                    Math.min(12, Math.trunc(Number(ev.target.value))),
                  ),
                  dice: [],
                  discarded: [],
                };
              })
            }
          />
        </label>
        {e.dice.map((d, i) => (
          <label key={i} className="campaign-check">
            <input
              type="checkbox"
              disabled={post.explorationApplied || !e.modifierReason?.trim()}
              checked={(e.discarded || []).includes(i)}
              onChange={(ev) =>
                update((p) => {
                  p.exploration = {
                    ...e,
                    discarded: ev.target.checked
                      ? [...(e.discarded || []), i]
                      : (e.discarded || []).filter((x) => x !== i),
                  };
                })
              }
            />
            Odrzuć kość {i + 1}: {d}
          </label>
        ))}
      </details>
      <DiceInput
        label="Eksploracja"
        count={diceCount}
        value={e.dice}
        disabled={post.explorationApplied}
        onChange={(dice, source) =>
          update((p) => {
            p.exploration = { ...e, dice, source };
          })
        }
      />
      {result && (
        <>
          <p>
            Suma: <strong>{result.total}</strong> · znalezione łupy:{" "}
            <strong>{result.loot}</strong>
          </p>
          <h3>Wyrzucone powtórzenia</h3>
          {result.matches.length ? (
            result.matches.map((m, i) => (
              <p key={m.key}>
                {m.key} ·{" "}
                {
                  R.exploration.find(
                    (x) => x.key === m.key && x.area === battle.area,
                  )?.name
                }
                {i === 0 ? " · wynik obowiązujący" : ""}
              </p>
            ))
          ) : (
            <p>Brak powtórzeń.</p>
          )}
          {result.best && (
            <article className="campaign-card">
              <h3>{result.best.name}</h3>
              <p>{result.best.text}</p>
              <p className="campaign-source">
                Podręcznik s. {result.best.page}
              </p>
              <p>
                Rozstrzygnij opisane testy i wybory. Znaleziska oraz zmiany
                zapisz w poniższym rozliczeniu; dodatkowe przedmioty dodasz w
                podziale ekwipunku.
              </p>
            </article>
          )}
          <label>
            Wyniki przerzutów, modyfikatorów i zdarzenia
            <textarea
              disabled={post.explorationApplied}
              value={e.note}
              onChange={(ev) =>
                update((p) => {
                  p.exploration = { ...e, note: ev.target.value };
                })
              }
            />
          </label>
          <div className="campaign-grid">
            <label>
              Dodatkowe złote korony ze zdarzenia
              <input
                type="number"
                min="0"
                disabled={post.explorationApplied}
                value={e.gold || 0}
                onChange={(ev) =>
                  update((p) => {
                    p.exploration = {
                      ...e,
                      gold: Math.max(0, Number(ev.target.value)),
                    };
                  })
                }
              />
            </label>
            <label>
              Dodatkowe łupy ze zdarzenia
              <input
                type="number"
                min="0"
                disabled={post.explorationApplied}
                value={e.bonusLoot || 0}
                onChange={(ev) =>
                  update((p) => {
                    p.exploration = {
                      ...e,
                      bonusLoot: Math.max(0, Number(ev.target.value)),
                    };
                  })
                }
              />
            </label>
          </div>
          <button
            className="button"
            disabled={
              post.explorationApplied || (!!result.best && !e.note.trim())
            }
            onClick={() =>
              update((p) => {
                p.loot += result.loot + (e.bonusLoot || 0);
                p.treasury += e.gold || 0;
                p.explorationApplied = true;
                R.log(
                  p,
                  "exploration",
                  `Eksploracja: ${e.dice.join(", ")}. Odrzucone indeksy: ${(e.discarded || []).join(",")}. ${e.modifierReason || ""}. ${result.best?.name || "Bez powtórzeń"}. Łupy: ${result.loot + (e.bonusLoot || 0)}, złoto: ${e.gold || 0}. ${e.note}`,
                );
              })
            }
          >
            Zatwierdź eksplorację
          </button>
        </>
      )}
    </>
  );
}

export default Exploration;
