import NumberInput from "./NumberInput";
import React from "react";
import * as R from "./rules";
import { companyChoices, selectCompanyAdvance } from "./company";

// Adds this skirmish's Determinacja, Gniew and Odporność (s. 418), capped at 40.
export function applyCampaignPoints(p, battle, notes) {
  if (p.campaignPointsApplied) return;
  const { suggested } = R.suggestCampaignPoints(battle, p);
  const points = p.pointsDraft || suggested;
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
}

function CampaignPoints({ battle, post, update, notes }) {
  const { suggested, out, count, khorne } = R.suggestCampaignPoints(
    battle,
    post,
  );
  const unmarkedChaos = (post.armyRules || []).some(
    (r) => R.normal(r) === "znak chaosu",
  );
  const points = post.pointsDraft || suggested;
  return (
    <>
      {unmarkedChaos && (
        <label className="campaign-check">
          <input
            type="checkbox"
            disabled={post.campaignPointsApplied}
            checked={!!post.khorne}
            onChange={(e) =>
              update((p) => {
                p.khorne = e.target.checked;
                delete p.pointsDraft;
              })
            }
          />
          Kompania naznaczona Znakiem Khorna
        </label>
      )}
      <details className="campaign-help">
        <summary>Skąd te liczby? (zasady, s. 418)</summary>
        <p>
          Aplikacja sama wpisała, ile punktów kompania zdobywa w tej potyczce.
          Możesz to poprawić, np. gdy zasada kompanii lub scenariusza mówi
          inaczej.
        </p>
        <ul>
          <li>Determinacja: +1 zawsze; zwycięzca +2 do 4. rundy, +1 w rundach 5–9.</li>
          <li>
            Gniew: WzA przeciwnika powyżej 25 / 50 / 75%
            {khorne
              ? ". Khorne: liczą się też własne WzA, odsetek ze wszystkich modeli obu kompanii."
              : "."}
          </li>
          <li>
            Odporność: własne WzA poniżej 75 / 50 / 25% modeli w grze (teraz{" "}
            {out}/{count}).
          </li>
        </ul>
      </details>
      <div className="campaign-grid campaign-points-grid">
        {Object.keys(suggested).map((k) => (
          <label key={k}>
            <span>
              {{ determinacja: "Determinacja", gniew: "Gniew", odpornosc: "Odporność" }[k]}{" "}
              +
            </span>
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
            <small className="campaign-points-total">
              {Number(notes[k]) || 0} →{" "}
              <strong>
                {Math.min(40, (Number(notes[k]) || 0) + (Number(points[k]) || 0))}
              </strong>
            </small>
          </label>
        ))}
      </div>
      {post.campaignPointsApplied && (
        <p className="campaign-done">✓ Punkty kampanii zatwierdzone</p>
      )}
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
