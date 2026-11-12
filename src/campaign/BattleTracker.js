import React from "react";
import * as R from "./rules";

// Compact, phone-friendly record of the skirmish itself: one card per unit with
// kills, scenario PD and the status of every model. It edits the same fields as
// the "Bitwa" tab of each unit card, so both views stay in sync.
// What a counter change means for the battle log (onLog is optional).
const LOG_TEXT = {
  battleKills: (name, d) => (d > 0 ? `${name} wyłącza wroga z akcji` : `${name}: cofnięto wyłączenie wroga`),
  battleExp: (name, d) => `${name}: ${d > 0 ? "+1" : "−1"} dodatkowe PD`,
  battleTreasure: (name, d) => (d > 0 ? `${name} zdobywa znacznik kosztowności` : `${name} traci znacznik kosztowności`),
};

export default function BattleTracker({ units, setUnits, onLog }) {
  const edit = (id, fn) =>
    setUnits(
      units.map((u) => {
        if (u.uniqueId !== id) return u;
        const next = {
          ...u,
          battleOutOfActionModels: Array.from(
            { length: R.modelCount(u) },
            (_, i) => !!u.battleOutOfActionModels?.[i],
          ),
          battleAbsentModels: Array.from(
            { length: R.modelCount(u) },
            (_, i) => !!u.battleAbsentModels?.[i],
          ),
        };
        fn(next);
        return next;
      }),
    );
  const counter = (u, field, label) => {
    const value = Math.max(0, Number(u[field]) || 0);
    return (
      <div className="campaign-tracker-counter">
        <span>{label}</span>
        <button
          type="button"
          aria-label={`${label}: ${R.label(u)} −1`}
          disabled={!value}
          onClick={() => {
            edit(u.uniqueId, (x) => (x[field] = value - 1));
            onLog?.(LOG_TEXT[field]?.(R.label(u), -1));
          }}
        >
          −
        </button>
        <output aria-live="polite">{value}</output>
        <button
          type="button"
          aria-label={`${label}: ${R.label(u)} +1`}
          onClick={() => {
            edit(u.uniqueId, (x) => (x[field] = value + 1));
            onLog?.(LOG_TEXT[field]?.(R.label(u), 1));
          }}
        >
          +
        </button>
      </div>
    );
  };
  const outTotal = units.reduce(
    (n, u) => n + (u.battleOutOfActionModels || []).filter(Boolean).length,
    0,
  );
  // Models that can sit out a game: not captured and not resting.
  const absentCandidates = units
    .map((u) => ({
      u,
      indices: Array.from({ length: R.modelCount(u) }, (_, i) => i).filter(
        (i) =>
          !u.campaignModelStatus?.[i]?.captured &&
          !(u.campaignModelStatus?.[i]?.skip > 0),
      ),
    }))
    .filter((x) => x.indices.length);
  return (
    <section className="campaign-tracker" aria-label="Przebieg potyczki">
      <h3>
        Przebieg potyczki <small>· WzA: {outTotal}</small>
      </h3>
      <p className="campaign-source">Dotknij modelu, aby oznaczyć go jako WzA.</p>
      {units.map((u) => {
        const count = R.modelCount(u);
        return (
          <article className="campaign-tracker-unit" key={u.uniqueId}>
            <div className="campaign-tracker-head">
              <strong>{R.label(u)}</strong>
              <small>
                {u.type}
                {count > 1 ? ` · ${count} modele` : ""} · {u.exp || 0} PD
              </small>
            </div>
            <div className="campaign-tracker-counters">
              {u.type === "Bohater" &&
                counter(u, "battleKills", "Wrogowie WzA")}
              {R.canEarnExperience(u) &&
                counter(u, "battleExp", "Dodatkowe PD")}
              {counter(u, "battleTreasure", "Kosztowności")}
            </div>
            <div className="campaign-tracker-models" role="group" aria-label={`Wyłączeni z akcji: ${R.label(u)}`}>
              {Array.from({ length: count }, (_, i) => {
                const status = u.campaignModelStatus?.[i] || {};
                const blocked = status.captured || (status.skip || 0) > 0;
                const absent = !!u.battleAbsentModels?.[i];
                const out = !!u.battleOutOfActionModels?.[i];
                const name = count > 1 ? `#${i + 1}` : "Model";
                const state = blocked
                  ? status.captured
                    ? "pojmany"
                    : `pauza ${status.skip}`
                  : absent
                    ? "nieobecny"
                    : out
                      ? "WzA"
                      : "w grze";
                return (
                  <button
                    key={i}
                    type="button"
                    aria-pressed={out}
                    className={`${out ? "is-out" : ""}${count === 1 ? " is-single" : ""}`}
                    title={blocked || absent ? undefined : out ? "Dotknij: z powrotem w grze" : "Dotknij: wyłączony z akcji"}
                    disabled={blocked || absent}
                    onClick={() => {
                      edit(u.uniqueId, (x) => {
                        x.battleOutOfActionModels[i] = !out;
                      });
                      onLog?.(`${R.label(u)}${count > 1 ? ` ${name}` : ""}: ${out ? "wraca do gry" : "wyłączony z akcji"}`);
                    }}
                  >
                    {count > 1 ? (
                      <>
                        <span>{name}</span>
                        <small>{state}</small>
                      </>
                    ) : (
                      <span>
                        <i className={`fa-solid ${out ? "fa-skull" : blocked || absent ? "fa-ban" : "fa-shield-halved"}`} aria-hidden="true"></i>{" "}
                        {state === "w grze" ? "W grze" : state.charAt(0).toUpperCase() + state.slice(1)}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </article>
        );
      })}
      {absentCandidates.length > 0 && (
        <details className="campaign-help campaign-tracker-absent">
          <summary>
            Nieobecni na stole (
            {units.reduce(
              (n, u) => n + (u.battleAbsentModels || []).filter(Boolean).length,
              0,
            )}
            )
          </summary>
          {absentCandidates.map(({ u, indices }) => (
            <div className="campaign-absent-row" key={u.uniqueId}>
              <span>{R.label(u)}</span>
              <div className="campaign-chips">
                {indices.map((i) => {
                  const name = R.modelCount(u) > 1 ? `#${i + 1}` : "Model";
                  return (
                    <label className="campaign-chip-toggle" key={i}>
                      <input
                        type="checkbox"
                        aria-label={`Nieobecny: ${R.label(u)} ${name}`}
                        checked={!!u.battleAbsentModels?.[i]}
                        onChange={(e) =>
                          edit(u.uniqueId, (x) => {
                            x.battleAbsentModels[i] = e.target.checked;
                            if (e.target.checked)
                              x.battleOutOfActionModels[i] = false;
                          })
                        }
                      />
                      <span>{name}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
        </details>
      )}
    </section>
  );
}
