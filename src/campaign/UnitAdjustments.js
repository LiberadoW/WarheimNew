import NumberInput from "./NumberInput";
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
  const [removeRule, setRemoveRule] = useState("");
  const [model, setModel] = useState(0);
  const [role, setRole] = useState("");
  const unit = post.units.find((u) => u.uniqueId === id);
  if (!unit) return null;
  // A group of henchmen: pause, capture and removal concern one model.
  const count = R.modelCount(unit);
  const m = Math.min(model, count - 1);
  const who = count > 1 ? `${R.label(unit)} #${m + 1}` : R.label(unit);
  const status = unit.campaignModelStatus?.[m] || {};
  const roles = R.commandRoles(unit);
  const setStatus = (patch, text) =>
    update((p) => {
      const u = p.units.find((x) => x.uniqueId === id);
      u.campaignModelStatus = Array.from({ length: R.modelCount(u) }, (_, i) => ({
        ...(u.campaignModelStatus?.[i] || {}),
        ...(i === m ? patch : {}),
      }));
      R.log(p, "adjustment", `${who}: ${text}. ${note}`);
    });
  return (
    <details className="campaign-card">
      <summary>Korekty postaci: rany, współczynniki, zasady</summary>
      <label>
        Postać
        <select
          value={id}
          onChange={(e) => {
            setId(e.target.value);
            setModel(0);
            setRole("");
          }}
        >
          {post.units.map((u) => (
            <option value={u.uniqueId} key={u.uniqueId}>
              {R.label(u)}
              {R.modelCount(u) > 1 ? ` (${R.modelCount(u)} modeli)` : ""}
            </option>
          ))}
        </select>
      </label>
      {count > 1 && (
        <label>
          Model w grupie (pauza, pojmanie, usunięcie)
          <select value={m} onChange={(e) => setModel(Number(e.target.value))}>
            {Array.from({ length: count }, (_, i) => {
              const s = unit.campaignModelStatus?.[i] || {};
              const notes = [s.dead && "martwy", s.skip > 0 && `pauza ${s.skip}`, s.captured && "pojmany"].filter(Boolean);
              return (
                <option key={i} value={i}>
                  #{i + 1}
                  {notes.length ? ` · ${notes.join(", ")}` : ""}
                </option>
              );
            })}
          </select>
        </label>
      )}
      {count > 1 && (
        <p className="campaign-muted">
          Współczynniki i zasady są wspólne dla całej grupy (jeden profil stronników).
        </p>
      )}
      <label>
        Uzasadnienie zmiany / wynik z tabeli
        <input value={note} onChange={(e) => setNote(e.target.value)} />
      </label>
      <div className="campaign-stats">
        {R.STATS.map((name, i) => (
          <div className="campaign-stat" key={name}>
            <span>
              {name}: {R.currentStats(unit)[i]}
            </span>
            <div>
              <button
                aria-label={`Zmniejsz ${name}`}
                disabled={!note.trim() || !Number.isFinite(Number(R.currentStats(unit)[i]))}
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
                aria-label={`Zwiększ ${name}`}
                disabled={!note.trim() || !Number.isFinite(Number(R.currentStats(unit)[i]))}
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
        Usuń zasadę / utraconą umiejętność
        <select
          value={removeRule}
          onChange={(e) => setRemoveRule(e.target.value)}
        >
          <option value="">Wybierz</option>
          {(unit.rules || []).map((n) => (
            <option key={n}>{n}</option>
          ))}
        </select>
      </label>
      <button
        className="button button-secondary"
        disabled={!note.trim() || !removeRule}
        onClick={() => {
          update((p) => {
            const u = p.units.find((u) => u.uniqueId === id);
            for (const field of ["rules", "baseRules", "newRules"])
              if (u[field]) u[field] = u[field].filter((n) => n !== removeRule);
            u.mentalIllnesses = (u.mentalIllnesses || []).filter(
              (m) => m.name !== removeRule,
            );
            R.log(
              p,
              "rule-loss",
              `${R.label(u)}: usunięto ${removeRule}. ${note}`,
            );
          });
          setRemoveRule("");
        }}
      >
        Usuń wskazaną zasadę
      </button>
      <button
        className="button button-secondary"
        disabled={!note.trim()}
        onClick={() => {
          update((p) => {
            p.units = p.units.filter((u) => u.uniqueId !== id);
            for (const a of p.advances.filter(
              (a) => a.unitId === id && !a.resolved,
            )) {
              a.resolved = true;
              a.description = "Postać opuściła kompanię";
            }
            R.log(
              p,
              "dismissal",
              `${R.label(unit)} opuszcza kompanię z posiadanym ekwipunkiem. ${note}`,
            );
          });
          setId(post.units.find((u) => u.uniqueId !== id)?.uniqueId || "");
        }}
      >
        {count > 1 ? "Usuń całą grupę z kompanii (z ekwipunkiem)" : "Usuń postać z kompanii (z ekwipunkiem)"}
      </button>
      <label>
        Opuszczone kolejne potyczki{count > 1 ? ` (model #${m + 1})` : ""}
        <NumberInput
          type="number"
          min="0"
          value={status.skip || 0}
          onChange={(e) => setStatus({ skip: Math.max(0, Number(e.target.value)) }, `pauza ${e.target.value}`)}
        />
      </label>
      {checkLabel(
        count > 1 ? `Pojmany (model #${m + 1})` : "Pojmany",
        status.captured,
        (checked) => setStatus({ captured: checked }, `pojmany ${checked}`),
      )}
      {count > 1 && (
        <>
          {roles.length > 1 && (
            <label>
              Który to model
              <select value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="">Wybierz</option>
                {roles.map((r) => (
                  <option key={r}>{r}</option>
                ))}
              </select>
            </label>
          )}
          <button
            className="button button-secondary"
            disabled={!note.trim() || (roles.length > 1 && !role)}
            onClick={() => {
              update((p) => {
                const left = R.removeGroupModel(p, id, m, role || null);
                R.log(p, "dismissal", `${who}${left ? ` (${left.toLowerCase()})` : ""} opuszcza grupę. ${note}`);
              });
              setModel(0);
              setRole("");
            }}
          >
            Usuń model #{m + 1} z grupy
          </button>
        </>
      )}
    </details>
  );
}

export default UnitAdjustments;
