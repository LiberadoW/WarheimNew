import NumberInput from "./NumberInput";
import React from "react";
import { explorationRules } from "./company";
import * as R from "./rules";
import DiceInput from "./DiceInput";
import EncounterResolution from "./EncounterResolution";
import { CraftReservations } from "./Crafting";
import AdvanceCard from "./Advancement";
import { encounterPlan } from "./encounters";
import { applyEffects } from "./effects";
import { explorationAuto, explorationAutoTotals } from "./auto-rules";

// Polish plural: 1 uprawniony bohater, 2–4 uprawnieni bohaterowie,
// 0 and 5+ uprawnionych bohaterów.
export const eligibleHeroesLabel = (n) =>
  n === 1
    ? "1 uprawniony bohater"
    : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 12 || n % 100 > 14)
      ? `${n} uprawnieni bohaterowie`
      : `${n} uprawnionych bohaterów`;

export default function Exploration({
  battle,
  post,
  update,
  army = { name: "", heroes: {} },
}) {
  const privileges = explorationRules(battle, post),
    eligible = privileges.heroes,
    count = privileges.count;
  const e = post.exploration || {
    dice: [],
    modifierReason: "",
    note: "",
    encounter: {},
  };
  const diceCount = e.countOverride ?? count;
  const kept = e.dice
    .filter((_, i) => !(e.discarded || []).includes(i))
    .sort((a, b) => a - b)
    .slice(privileges.discardLowest);
  const auto = explorationAuto(battle, post);
  const autoTotals = explorationAutoTotals(
    auto,
    e.autoRolls || {},
    e.autoSigns || {},
    e.thieves || {},
  );
  const autoReason = auto.rerolls.map((r) => r.source).join(", ");
  const rerollReason = e.rerollReason ?? autoReason;
  const autoRerolls = auto.rerolls.reduce((n, r) => n + r.count, 0);
  const sumModifier =
    privileges.totalModifier +
    (Number(e.totalModifier) || 0) +
    (autoTotals?.sum || 0);
  const result = R.validDice(e.dice, diceCount)
    ? R.explorationResult(kept, battle.area, sumModifier)
    : null;
  const plan = result?.best
    ? encounterPlan(result.best, e.encounter || {}, post, army)
    : { ready: true, effects: [] };
  const set = (patch) =>
    update((p) => {
      p.exploration = { ...e, ...patch };
    });
  return (
    <>
      <CraftReservations post={post} update={update} />
      <p>
        {eligibleHeroesLabel(eligible.length)}
        {battle.result === "win" ? " +1 za zwycięstwo" : ""} · pula podstawowa:{" "}
        {count} K6.
      </p>
      {!!privileges.discardLowest && (
        <p>
          Efekt poprzedniej eksploracji: +{privileges.discardLowest} kość,
          automatycznie odrzuć najniższe wyniki.
        </p>
      )}
      {!!privileges.totalModifier && (
        <p>Chciwość: +{privileges.totalModifier} do sumy.</p>
      )}
      <details>
        <summary>Modyfikatory puli i odrzucanie kości</summary>
        <label>
          Zasada / przedmiot
          <input
            disabled={post.explorationApplied || e.locked}
            value={e.modifierReason || ""}
            onChange={(ev) => set({ modifierReason: ev.target.value })}
          />
        </label>
        <label>
          Liczba rzucanych kości
          <NumberInput
            type="number"
            min="0"
            max="12"
            disabled={
              post.explorationApplied || e.locked || R.validDice(e.dice, diceCount) || !e.modifierReason?.trim()
            }
            value={diceCount}
            onChange={(ev) =>
              set({
                countOverride: Math.max(
                  0,
                  Math.min(12, Math.trunc(Number(ev.target.value))),
                ),
                dice: [],
                discarded: [],
              })
            }
          />
        </label>
        <label>
          Modyfikator sumy łupów
          <NumberInput
            type="number"
            value={e.totalModifier || 0}
            disabled={
              post.explorationApplied || e.locked || !e.modifierReason?.trim()
            }
            onChange={(ev) =>
              set({ totalModifier: Math.trunc(Number(ev.target.value)) })
            }
          />
        </label>
        {e.dice.map((d, i) => (
          <label key={i} className="campaign-check">
            <input
              type="checkbox"
              disabled={
                post.explorationApplied || e.locked || !e.modifierReason?.trim()
              }
              checked={(e.discarded || []).includes(i)}
              onChange={(ev) =>
                set({
                  discarded: ev.target.checked
                    ? [...(e.discarded || []), i]
                    : (e.discarded || []).filter((x) => x !== i),
                })
              }
            />
            Odrzuć kość {i + 1}: {d}
          </label>
        ))}
      </details>
      {(auto.bonuses.length ||
        auto.thieves.length ||
        auto.robbers.length ||
        auto.tables.length) > 0 && (
        <section className="campaign-card">
          <h3>Zasady kompanii w eksploracji</h3>
          {auto.bonuses.map((b) => (
            <div key={b.key}>
              <DiceInput
                label={`${b.label}: K3 (wynik K6 ÷ 2${b.best ? ", liczy się najwyższa" : ""})`}
                count={b.dice}
                value={e.autoRolls?.[b.key] || []}
                disabled={post.explorationApplied}
                onChange={(dice) =>
                  set({ autoRolls: { ...(e.autoRolls || {}), [b.key]: dice } })
                }
              />
              {b.signed && (
                <div className="campaign-row" role="group" aria-label={`${b.label}: kierunek`}>
                  {[1, -1].map((sign) => (
                    <button
                      key={sign}
                      type="button"
                      className={`button ${e.autoSigns?.[b.key] === sign ? "" : "button-secondary"}`}
                      disabled={post.explorationApplied}
                      aria-pressed={e.autoSigns?.[b.key] === sign}
                      onClick={() =>
                        set({ autoSigns: { ...(e.autoSigns || {}), [b.key]: sign } })
                      }
                    >
                      {sign > 0 ? "Dodaj K3" : "Odejmij K3"}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
          {auto.thieves.map((t) => (
            <label className="campaign-check" key={t.unitId}>
              <input
                type="checkbox"
                disabled={post.explorationApplied}
                checked={e.thieves?.[t.unitId] ?? t.kills > 0}
                onChange={(ev) =>
                  set({ thieves: { ...(e.thieves || {}), [t.unitId]: ev.target.checked } })
                }
              />
              Złodziej: {t.label} wyłączył wroga z akcji (+1 łup)
            </label>
          ))}
          {auto.robbers.map((r) => (
            <DiceInput
              key={r.key}
              label={`${r.label}: 1 = jeden łup mniej`}
              count={1}
              value={e.autoRolls?.[r.key] || []}
              disabled={post.explorationApplied}
              onChange={(dice) =>
                set({ autoRolls: { ...(e.autoRolls || {}), [r.key]: dice } })
              }
            />
          ))}
          {auto.tables.map((t) => (
            <p className="campaign-source" key={t}>
              {t}: przed eksploracją rzuć K6 na tabelę z opisu zasady i zapisz
              efekt w narzędziach.
            </p>
          ))}
          {autoTotals ? (
            <p className="campaign-done">
              Suma: {autoTotals.sum >= 0 ? "+" : ""}
              {autoTotals.sum}
              {autoTotals.loot ? ` · łupy ${autoTotals.loot > 0 ? "+" : ""}${autoTotals.loot}` : ""}
            </p>
          ) : (
            <p className="campaign-source">Wykonaj wszystkie rzuty z zasad.</p>
          )}
        </section>
      )}
      <DiceInput
        label="Eksploracja"
        count={diceCount}
        value={e.dice}
        disabled={post.explorationApplied || e.locked}
        onChange={(dice, source) => set({ dice, source, encounter: {} })}
      />
      {result && !e.locked && (
        <button
          className="button"
          onClick={() => set({ locked: true, originalDice: [...e.dice] })}
        >
          Zatwierdź pulę eksploracji
        </button>
      )}
      {result && e.locked && (
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
          {!post.explorationApplied && (
            <details>
              <summary>Przerzuty z zasad</summary>
              <label>
                Źródło prawa do przerzutu (uprawnienia z zasad / ekwipunku)
                <input
                  value={rerollReason || ""}
                  onChange={(ev) => set({ rerollReason: ev.target.value })}
                />
              </label>
              {!!(privileges.rerolls + autoRerolls) && (
                <p>
                  Przerzuty z zasad dostępne dla {privileges.rerolls + autoRerolls}{" "}
                  kości{autoReason ? ` (${autoReason})` : ""}. Każdą kość
                  można przerzucić raz.
                </p>
              )}
              {e.dice.map((d, i) => (
                <DiceInput
                  key={i}
                  label={`Przerzut kości ${i + 1} (było ${d})`}
                  value={e.pendingRerolls?.[i] || []}
                  disabled={
                    !rerollReason?.trim() || (e.rerolled || []).includes(i)
                  }
                  onChange={(dice, source) =>
                    set({
                      pendingRerolls: {
                        ...(e.pendingRerolls || {}),
                        [i]: dice,
                      },
                      rerollSource: source,
                    })
                  }
                />
              ))}
              <p>
                Zmiana wyniku o ±1 wymaga wskazania uprawnienia. Zapisujemy ją
                oddzielnie od przerzutu.
              </p>
              {e.dice.map((d, i) => (
                <div className="campaign-row" key={`adjust-${i}`}>
                  <span>
                    Kość {i + 1}: {d}
                  </span>
                  {[-1, 1].map((delta) => (
                    <button
                      key={delta}
                      className="button button-secondary"
                      disabled={
                        !rerollReason?.trim() ||
                        (e.adjusted || []).includes(i) ||
                        d + delta < 1 ||
                        d + delta > 6
                      }
                      onClick={() => {
                        const dice = [...e.dice];
                        dice[i] += delta;
                        set({
                          dice,
                          adjusted: [...(e.adjusted || []), i],
                          encounter: {},
                        });
                      }}
                    >
                      {delta > 0 ? "+1" : "−1"}
                    </button>
                  ))}
                </div>
              ))}
              {e.dice.map(
                (_, i) =>
                  R.validDice(e.pendingRerolls?.[i], 1) &&
                  !(e.rerolled || []).includes(i) && (
                    <button
                      key={i}
                      className="button"
                      onClick={() => {
                        const dice = [...e.dice];
                        dice[i] = e.pendingRerolls[i][0];
                        set({
                          dice,
                          rerolled: [...(e.rerolled || []), i],
                          encounter: {},
                        });
                      }}
                    >
                      Zastosuj przerzut kości {i + 1}
                    </button>
                  ),
              )}
            </details>
          )}
          {result.best && (
            <EncounterResolution
              event={result.best}
              answers={e.encounter || {}}
              post={post}
              army={army}
              disabled={post.explorationApplied}
              onChange={(encounter) => set({ encounter })}
            />
          )}
          <label>
            Notatki eksploracji
            <textarea
              disabled={post.explorationApplied}
              value={e.note || ""}
              onChange={(ev) => set({ note: ev.target.value })}
            />
          </label>
          {post.explorationApplied ? (
            <p className="campaign-done">
              ✓ Eksploracja zatwierdzona · +
              {Math.max(0, result.loot + (autoTotals?.loot || 0))} łupów
            </p>
          ) : (
          <button
            className="button"
            disabled={post.explorationApplied || !plan.ready || !autoTotals}
            onClick={() =>
              update((p) => {
                if (p.explorationApplied)
                  throw Error("Eksploracja została już rozliczona.");
                if (result.best) {
                  const validated = encounterPlan(
                    result.best,
                    p.exploration.encounter || {},
                    p,
                    army,
                  );
                  if (!validated.ready)
                    throw Error(
                      validated.error ||
                        "Uzupełnij wszystkie wybory zdarzenia.",
                    );
                  applyEffects(p, validated.effects, result.best.name, army);
                }
                if (!autoTotals)
                  throw Error("Wykonaj rzuty z zasad kompanii.");
                p.loot += Math.max(0, result.loot + autoTotals.loot);
                p.explorationApplied = true;
                R.log(
                  p,
                  "exploration",
                  `Eksploracja: ${e.dice.join(", ")}. ${result.best?.name || "Bez powtórzeń"}. Łupy z puli: ${result.loot}${autoTotals?.loot ? ` (${autoTotals.loot > 0 ? "+" : ""}${autoTotals.loot} z zasad)` : ""}${autoTotals?.sum ? `; suma ${autoTotals.sum > 0 ? "+" : ""}${autoTotals.sum} z zasad` : ""}. ${e.note || ""}`,
                  {
                    dice: e.dice,
                    originalDice: e.originalDice,
                    encounter: e.encounter || {},
                  },
                );
              })
            }
          >
            Zatwierdź eksplorację
          </button>
          )}
        </>
      )}
      {post.advances
        .filter((a) => !a.resolved)
        .map((a) => (
          <AdvanceCard
            key={a.id}
            advance={a}
            unit={post.units.find((u) => u.uniqueId === a.unitId)}
            post={post}
            army={army}
            update={update}
          />
        ))}
    </>
  );
}
