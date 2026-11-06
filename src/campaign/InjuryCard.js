import React from "react";
import * as R from "./rules";
import DiceInput from "./DiceInput";
import InjuryResolution from "./InjuryResolution";

function InjuryCard({ task, post, update }) {
  const saved = post.injuries[task.key];
  const draft = post.injuryDrafts?.[task.key] || {
    dice: [],
    secondary: [],
    note: "",
    resolved: false,
  };
  const kind = R.injuryKind(task.unit);
  const count = kind === "hero" ? 2 : 1;
  const result = R.validDice(draft.dice, count)
    ? R.injuryResult(task.unit, draft.dice)
    : null;
  const setDraft = (change) =>
    update((p) => {
      p.injuryDrafts = p.injuryDrafts || {};
      p.injuryDrafts[task.key] = { ...draft, ...change };
    });
  return (
    <article className="campaign-card">
      <h3>
        {R.label(task.unit)} #{task.index + 1}
      </h3>
      {saved ? (
        <p>
          Rozstrzygnięto: <strong>{saved.result}</strong>
          {saved.status.dead
            ? " · poległy"
            : saved.status.captured
              ? " · pojmany"
              : saved.status.skip
                ? ` · pauza: ${saved.status.skip}`
                : ""}
        </p>
      ) : (
        <>
          <p className="campaign-muted">
            {kind === "hero"
              ? "Tabela poważnych ran K66 (pierwsza kość: dziesiątki)."
              : `Tabela K6: ${kind}.`}
          </p>
          <DiceInput
            label="Obrażenia"
            count={count}
            value={draft.dice}
            onChange={(dice, source) => setDraft({ dice, source })}
          />
          {result && (
            <>
              <h3>
                {result.code} · {result.name}
              </h3>
              <p>{result.text}</p>
              <InjuryResolution
                result={result}
                value={draft}
                onChange={setDraft}
              />
              <button
                className="button"
                onClick={() =>
                  update((p) => R.applyInjury(p, task, result, draft))
                }
              >
                Zastosuj obrażenia
              </button>
            </>
          )}
        </>
      )}
    </article>
  );
}

export default InjuryCard;
