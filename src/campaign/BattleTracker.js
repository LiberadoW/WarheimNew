import React from "react";
import * as R from "./rules";

// Compact, phone-friendly record of the skirmish itself: one card per unit with
// kills, scenario PD and the status of every model. It edits the same fields as
// the "Bitwa" tab of each unit card, so both views stay in sync.
export default function BattleTracker({ units, setUnits }) {
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
          onClick={() => edit(u.uniqueId, (x) => (x[field] = value - 1))}
        >
          −
        </button>
        <output aria-live="polite">{value}</output>
        <button
          type="button"
          aria-label={`${label}: ${R.label(u)} +1`}
          onClick={() => edit(u.uniqueId, (x) => (x[field] = value + 1))}
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
  return (
    <section className="campaign-tracker" aria-label="Przebieg potyczki">
      <h3>
        Przebieg potyczki <small>· WzA: {outTotal}</small>
      </h3>
      <p className="campaign-source">
        Dotknij modelu, aby oznaczyć go jako wyłączonego z akcji (WzA).
      </p>
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
                counter(u, "battleKills", "Pokonani wrogowie")}
              {R.canEarnExperience(u) &&
                counter(u, "battleExp", "PD ze scenariusza")}
            </div>
            <div className="campaign-tracker-models" role="group" aria-label={`Wyłączeni z akcji: ${R.label(u)}`}>
              {Array.from({ length: count }, (_, i) => {
                const status = u.campaignModelStatus?.[i] || {};
                const blocked = status.captured || (status.skip || 0) > 0;
                const absent = !!u.battleAbsentModels?.[i];
                const out = !!u.battleOutOfActionModels?.[i];
                const name = count > 1 ? `#${i + 1}` : "Model";
                return (
                  <button
                    key={i}
                    type="button"
                    aria-pressed={out}
                    className={out ? "is-out" : ""}
                    disabled={blocked || absent}
                    onClick={() =>
                      edit(u.uniqueId, (x) => {
                        x.battleOutOfActionModels[i] = !out;
                      })
                    }
                  >
                    <span>{name}</span>
                    <small>
                      {blocked
                        ? status.captured
                          ? "pojmany"
                          : `pauza ${status.skip}`
                        : absent
                          ? "nieobecny"
                          : out
                            ? "WzA"
                            : "w grze"}
                    </small>
                  </button>
                );
              })}
            </div>
            {Array.from({ length: count }).some(
              (_, i) =>
                !u.campaignModelStatus?.[i]?.captured &&
                !(u.campaignModelStatus?.[i]?.skip > 0),
            ) && (
              <details className="campaign-help campaign-tracker-absent">
                <summary>
                  Nieobecni na stole (
                  {(u.battleAbsentModels || []).filter(Boolean).length})
                </summary>
                <div className="campaign-chips">
                  {Array.from({ length: count }, (_, i) => {
                    const status = u.campaignModelStatus?.[i] || {};
                    if (status.captured || status.skip > 0) return null;
                    const name = count > 1 ? `#${i + 1}` : "Model";
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
              </details>
            )}
          </article>
        );
      })}
    </section>
  );
}
