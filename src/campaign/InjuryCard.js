import React from "react";
import { companyInjuryModifier } from "./company";
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
    ? R.injuryResult(
        task.unit,
        draft.dice,
        companyInjuryModifier(post, task.unit),
      )
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
              : R.INJURY_TABLES[kind]}
          </p>
          {companyInjuryModifier(post, task.unit) > 0 && (
            <p>Konsyliarze: +1 do wyniku K6.</p>
          )}
          <DiceInput
            label="Obrażenia"
            count={count}
            value={draft.dice}
            onChange={(dice, source) => setDraft({ dice, source })}
          />
          {result &&
            (post.activeFutureEffects || []).some(
              (e) => e.key === "injuryRerollAll",
            ) &&
            !draft.rerolled && (
              <>
                <DiceInput
                  label="Przerzut obrażeń: pomoc medyka"
                  count={count}
                  value={draft.rerollDice || []}
                  onChange={(dice) => setDraft({ rerollDice: dice })}
                />
                <button
                  className="button"
                  disabled={!R.validDice(draft.rerollDice, count)}
                  onClick={() =>
                    setDraft({
                      dice: draft.rerollDice,
                      originalDice: draft.dice,
                      rerolled: true,
                      secondary: [],
                      children: [],
                      mental: [],
                    })
                  }
                >
                  Zastosuj przerzut obrażeń
                </button>
              </>
            )}
          {result && (
            <>
              <h3>
                {result.simple ? `K6: ${result.roll}` : `K66: ${result.code}`} ·{" "}
                {result.name}
              </h3>
              <p>{result.text}</p>
              <InjuryResolution
                result={result}
                value={draft}
                onChange={setDraft}
              />
              {R.wzaSanityRequired(post, task) && (
                <DiceInput
                  label="Obłęd za WzA (K3)"
                  value={draft.obled || []}
                  onChange={(obled) => setDraft({ obled })}
                />
              )}
              <button
                className="button"
                disabled={
                  R.wzaSanityRequired(post, task) &&
                  !R.validDice(draft.obled, 1)
                }
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
