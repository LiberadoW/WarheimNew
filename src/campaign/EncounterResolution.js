import React from "react";
import DiceInput from "./DiceInput";
import { encounterPlan } from "./encounters";
import { effectText } from "./effects";
export default function EncounterResolution({
  event,
  answers,
  post,
  army,
  onChange,
  disabled = false,
  plan: suppliedPlan,
}) {
  const plan = suppliedPlan || encounterPlan(event, answers, post, army);
  return (
    <section className="campaign-card">
      <h3>
        {event.key} · {event.name}
      </h3>
      <details>
        <summary>Opis z podręcznika · s. {event.page}</summary>
        <p>{event.text}</p>
      </details>
      {plan.inputs.map((input) =>
        input.type === "dice" ? (
          <DiceInput
            key={input.id}
            label={input.label}
            count={input.count}
            value={answers[input.id] || []}
            disabled={disabled}
            onChange={(value, source) =>
              onChange({
                ...answers,
                [input.id]: value,
                rollSources: {
                  ...(answers.rollSources || {}),
                  [input.id]: source,
                },
              })
            }
          />
        ) : input.type === "allocation" ? (
          <fieldset key={input.id} disabled={disabled}>
            <legend>{input.label}</legend>
            {input.options.map((o) => (
              <label key={o.value}>
                {o.label}
                <input
                  type="number"
                  min="0"
                  max={Math.min(input.total, o.max)}
                  value={answers[input.id]?.[o.value] || 0}
                  onChange={(e) =>
                    onChange({
                      ...answers,
                      [input.id]: {
                        ...(answers[input.id] || {}),
                        [o.value]: Math.max(
                          0,
                          Math.floor(Number(e.target.value)),
                        ),
                      },
                    })
                  }
                />
              </label>
            ))}
          </fieldset>
        ) : (
          <label key={input.id}>
            {input.label}
            <select
              disabled={disabled}
              value={answers[input.id] ?? ""}
              onChange={(e) =>
                onChange({ ...answers, [input.id]: e.target.value })
              }
            >
              <option value="">Wybierz</option>
              {input.options.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
        ),
      )}
      {plan.error && (
        <p role="alert" className="campaign-error">
          {plan.error}
        </p>
      )}
      {plan.ready && (
        <>
          <h4>Skutki do zastosowania</h4>
          {plan.effects.length ? (
            <ul>
              {plan.effects.map((effect, i) => (
                <li key={i}>
                  {effect.unitId
                    ? `${post.units.find((u) => u.uniqueId === effect.unitId)?.unitDisplayName || post.units.find((u) => u.uniqueId === effect.unitId)?.unitName}: `
                    : ""}
                  {effectText(effect)}
                </li>
              ))}
            </ul>
          ) : (
            <p>Zdarzenie nie zmienia zasobów kompanii.</p>
          )}
        </>
      )}
    </section>
  );
}
