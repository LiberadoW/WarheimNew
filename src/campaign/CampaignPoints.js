import NumberInput from "./NumberInput";
import React from "react";
import * as R from "./rules";
import { companyChoices, selectCompanyAdvance } from "./company";

function CampaignPoints({ battle, post, update, notes }) {
  const out = post.units.reduce(
    (n, u) => n + (u.battleOutOfActionModels || []).filter(Boolean).length,
    0,
  );
  const count = post.units.reduce((n, u) => n + R.modelCount(u), 0);
  const suggested = {
    determinacja:
      1 +
      (battle.result === "win"
        ? battle.round < 4
          ? 2
          : battle.round >= 5 && battle.round <= 9
            ? 1
            : 0
        : 0),
    gniew: battle.opponentModels
      ? battle.opponentOut / battle.opponentModels > 0.75
        ? 3
        : battle.opponentOut / battle.opponentModels > 0.5
          ? 2
          : battle.opponentOut / battle.opponentModels > 0.25
            ? 1
            : 0
      : 0,
    odpornosc:
      out / count < 0.25
        ? 3
        : out / count < 0.5
          ? 2
          : out / count < 0.75
            ? 1
            : 0,
  };
  const points = post.pointsDraft || suggested;
  return (
    <>
      <p>
        Propozycja wynika z wyniku potyczki i odsetka strat. Uwzględnij wyjątki
        z zasad kompanii.
      </p>
      <div className="campaign-grid">
        {Object.keys(suggested).map((k) => (
          <label key={k}>
            {{ determinacja: "Determinacja", gniew: "Gniew", odpornosc: "Odporność" }[k]} · było {Number(notes[k]) || 0}
            <NumberInput
              type="number"
              min="0"
              max="40"
              disabled={post.campaignPointsApplied}
              value={points[k]}
              onChange={(e) =>
                update((p) => {
                  p.pointsDraft = {
                    ...points,
                    [k]: Math.max(0, Math.floor(Number(e.target.value))),
                  };
                })
              }
            />
          </label>
        ))}
      </div>
      <button
        className="button"
        disabled={post.campaignPointsApplied}
        onClick={() =>
          update((p) => {
            p.campaignPoints = Object.fromEntries(
              Object.keys(suggested).map((k) => [
                k,
                Math.min(40, (Number(notes[k]) || 0) + points[k]),
              ]),
            );
            p.campaignPointsApplied = true;
            R.log(
              p,
              "campaign-points",
              Object.keys(points)
                .map((k) => `${k}: +${points[k]}`)
                .join(", "),
            );
          })
        }
      >
        Zatwierdź punkty kampanii
      </button>
      {companyChoices(post, notes).map((choice) => (
        <section
          className="campaign-card"
          key={`${choice.track}:${choice.threshold}`}
        >
          <h3>
            {choice.track}: {choice.threshold} punktów
          </h3>
          {choice.selected ? (
            <p>Wybrano: {choice.selected.name}</p>
          ) : (
            choice.options.map((entry) => (
              <article key={entry.id}>
                <h4>{entry.name}</h4>
                <p>{entry.text}</p>
                <button
                  className="button"
                  onClick={() =>
                    update((p) => selectCompanyAdvance(p, notes, entry.id))
                  }
                >
                  Wybierz: {entry.name}
                </button>
              </article>
            ))
          )}
        </section>
      ))}
    </>
  );
}

export default CampaignPoints;
