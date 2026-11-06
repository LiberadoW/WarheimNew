import React, { useState } from "react";
import * as R from "./rules";

const checkLabel = (text, value, onChange) => (
  <label className="campaign-check">
    <input
      type="checkbox"
      checked={!!value}
      onChange={(e) => onChange(e.target.checked)}
    />
    {text}
  </label>
);
function UnitAdjustments({ post, update }) {
  const [id, setId] = useState(post.units[0]?.uniqueId || "");
  const [rule, setRule] = useState("");
  const [note, setNote] = useState("");
  const unit = post.units.find((u) => u.uniqueId === id);
  if (!unit) return null;
  return (
    <details className="campaign-card">
      <summary>Korekty postaci: rany, współczynniki, zasady</summary>
      <label>
        Postać
        <select value={id} onChange={(e) => setId(e.target.value)}>
          {post.units.map((u) => (
            <option value={u.uniqueId} key={u.uniqueId}>
              {R.label(u)}
            </option>
          ))}
        </select>
      </label>
      <label>
        Uzasadnienie zmiany / wynik z tabeli
        <input value={note} onChange={(e) => setNote(e.target.value)} />
      </label>
      <div className="campaign-row">
        {R.STATS.map((name, i) => (
          <div key={name}>
            <span>
              {name}: {R.currentStats(unit)[i]}
            </span>
            <div>
              <button
                disabled={!note.trim()}
                onClick={() =>
                  update((p) => {
                    R.changeStat(
                      p.units.find((u) => u.uniqueId === id),
                      i,
                      -1,
                    );
                    R.log(
                      p,
                      "adjustment",
                      `${R.label(unit)}: ${name} -1 · ${note}`,
                    );
                  })
                }
              >
                −
              </button>
              <button
                disabled={!note.trim()}
                onClick={() =>
                  update((p) => {
                    R.changeStat(
                      p.units.find((u) => u.uniqueId === id),
                      i,
                      1,
                    );
                    R.log(
                      p,
                      "adjustment",
                      `${R.label(unit)}: ${name} +1 · ${note}`,
                    );
                  })
                }
              >
                +
              </button>
            </div>
          </div>
        ))}
      </div>
      <label>
        Nowa zasada
        <input value={rule} onChange={(e) => setRule(e.target.value)} />
      </label>
      <button
        className="button"
        disabled={!rule.trim() || !note.trim()}
        onClick={() => {
          update((p) => {
            R.addRule(
              p.units.find((u) => u.uniqueId === id),
              rule.trim(),
            );
            R.log(p, "rule", `${R.label(unit)}: ${rule} · ${note}`);
          });
          setRule("");
        }}
      >
        Dodaj zasadę
      </button>
      <label>
        Opuszczone kolejne potyczki
        <input
          type="number"
          min="0"
          value={unit.campaignModelStatus?.[0]?.skip || 0}
          onChange={(e) =>
            update((p) => {
              const u = p.units.find((x) => x.uniqueId === id);
              u.campaignModelStatus = u.campaignModelStatus || [{}];
              u.campaignModelStatus[0] = {
                ...u.campaignModelStatus[0],
                skip: Math.max(0, Number(e.target.value)),
              };
              R.log(
                p,
                "adjustment",
                `${R.label(u)}: pauza ${e.target.value}. ${note}`,
              );
            })
          }
        />
      </label>
      {checkLabel(
        "Pojmany",
        unit.campaignModelStatus?.[0]?.captured,
        (checked) =>
          update((p) => {
            const u = p.units.find((x) => x.uniqueId === id);
            u.campaignModelStatus = u.campaignModelStatus || [{}];
            u.campaignModelStatus[0] = {
              ...u.campaignModelStatus[0],
              captured: checked,
            };
            R.log(
              p,
              "adjustment",
              `${R.label(u)}: pojmany ${checked}. ${note}`,
            );
          }),
      )}
    </details>
  );
}

export default UnitAdjustments;
