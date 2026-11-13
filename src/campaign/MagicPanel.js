import React, { useEffect, useState } from "react";
import RulesModal from "../Components/RulesModal";
import DiceInput from "./DiceInput";
import {
  LEVEL_NAMES,
  loreChoices,
  loreMissingInBuilder,
  dicePools,
  firstSpellOptions,
  isCaster,
  isPriest,
  knownSpells,
  loreOf,
  mageLevel,
  masteryText,
  maxPowerDice,
  needsLoreChoice,
  spellList,
} from "./spells";
import "../styles/CampaignHub.css";

const nameOf = (u) => u.unitDisplayName || u.unitName;
const spellModal = (unit, s) => ({
  title: s.name,
  sections: [
    {
      title: `${s.lore || loreOf(unit) || "Zaklęcie"} · ${s.from === s.to ? s.from : `${s.from}–${s.to}`}`,
      entries: [
        {
          name: [s.cast, s.mastery ? `opanowane: ${masteryText(unit)}` : ""].filter(Boolean).join(" · ") || s.name,
          text: s.text,
        },
      ],
    },
  ],
});

// First spell or prayer of a caster who knows none yet (s. 550 / 590): K6
// rolled, typed or picked from the list; the rolled one or the allowed swap.
function FirstSpell({ unit, onAssign }) {
  const [dice, setDice] = useState([]);
  const [picked, setPicked] = useState("");
  const lore = loreOf(unit);
  const roll = picked ? Number(picked) : dice[0] || null;
  const options = roll ? firstSpellOptions(unit, roll) : [];
  const first = spellList(lore).filter((s) => s.from <= 6);
  return (
    <div className="magic-first">
      <p className="hub-muted">
        {isPriest(unit) ? "Pierwsza modlitwa" : "Pierwsze zaklęcie"}: rzut K6 na liście
        {isPriest(unit) ? " modlitw (można zamienić na pierwszą modlitwę)" : " magii powszechnej (można zamienić na 7. zaklęcie tradycji)"}.
      </p>
      <div className="magic-first-row">
        <DiceInput label={`Rzut: ${nameOf(unit)}`} count={1} value={dice} onChange={(d) => { setPicked(""); setDice(d); }} />
        <label className="hub-field">
          albo wynik
          <select value={picked} onChange={(e) => { setDice([]); setPicked(e.target.value); }}>
            <option value="">Wybierz</option>
            {first.map((s) => (
              <option key={s.key} value={s.from}>
                {s.from === s.to ? s.from : `${s.from}–${s.to}`} · {s.name}
              </option>
            ))}
          </select>
        </label>
      </div>
      {options.length > 0 && (
        <div className="hub-actions">
          {options.map((s) => (
            <button key={s.key} type="button" className="button button-small" onClick={() => onAssign({ learnedSpells: [s.key] })}>
              Weź: {s.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// Dice the player taps off as they are used during the magic phase.
function Pips({ label, total, used, onToggle }) {
  return (
    <div className="magic-pips" role="group" aria-label={label}>
      <span>{label}</span>
      <div>
        {Array.from({ length: total }, (_, i) => (
          <button
            key={i}
            type="button"
            className={i < used ? "is-used" : ""}
            aria-pressed={i < used}
            aria-label={`${label}: kostka ${i + 1}`}
            onClick={() => onToggle(i < used ? i : i + 1)}
          />
        ))}
      </div>
      <small>{total - used}/{total}</small>
    </div>
  );
}

// Casters, their spells and the company's dice for the magic phase.
// `onAssign(unitId, patch)` saves a lore or spells (omit for read-only);
// `storageKey` keeps the used dice on this device.
export default function MagicPanel({ units = [], isActive, onAssign, storageKey, title = "Magia i modlitwy" }) {
  const casters = units.filter(isCaster);
  const [modal, setModal] = useState(null);
  const key = storageKey ? `warheim:magic:${storageKey}` : null;
  const [used, setUsed] = useState(() => {
    try {
      return (key && JSON.parse(localStorage.getItem(key))) || {};
    } catch {
      return {};
    }
  });
  useEffect(() => {
    try {
      if (key) localStorage.setItem(key, JSON.stringify(used));
    } catch {
      // Private mode: the marks simply do not survive a reload.
    }
  }, [key, used]);
  if (!casters.length) return null;
  const pools = dicePools(units, isActive);
  const mark = (id, n) => setUsed({ ...used, [id]: n });
  const extra = Number(used.extraPower) || 0;
  const extraDispel = Number(used.extraDispel) || 0;

  return (
    <section className="hub-card magic-panel" aria-label="Magia i modlitwy">
      <h3>{title}</h3>
      {casters.map((u) => {
        const spells = knownSpells(u);
        const lore = loreOf(u);
        return (
          <article key={u.uniqueId} className="magic-caster">
            <div className="hub-card-head">
              <strong>{nameOf(u)}</strong>
              <span className="hub-muted">
                {isPriest(u) ? "Duchowny" : `Mag ${LEVEL_NAMES[mageLevel(u)]} poziomu · do ${maxPowerDice(u)} kostek mocy na zaklęcie`}
              </span>
            </div>
            {lore && <p className="hub-muted">{lore}</p>}
            {needsLoreChoice(u) && onAssign && (
              <label className="hub-field">
                Tradycja magii
                <select value="" onChange={(e) => e.target.value && onAssign(u.uniqueId, { magicLore: e.target.value })}>
                  <option value="">Wybierz tradycję</option>
                  {loreChoices(u).map((l) => (
                    <option key={l}>{l}</option>
                  ))}
                </select>
              </label>
            )}
            {spells.length > 0 ? (
              <div className="roster-unit-rules">
                {spells.map((s) => (
                  <button key={s.key} type="button" className="roster-rule is-gear" onClick={() => setModal(spellModal(u, s))}>
                    {s.name}
                    <small>
                      {[s.lore && s.lore !== lore ? s.lore : "", s.cast.replace(/^RZUCON[YE] NA /i, "moc ").toLowerCase(), s.mastery ? `+${s.mastery}` : ""].filter(Boolean).join(" · ")}
                    </small>
                  </button>
                ))}
              </div>
            ) : lore && onAssign ? (
              <FirstSpell unit={u} onAssign={(patch) => onAssign(u.uniqueId, patch)} />
            ) : (
              <p className="hub-muted">
                {lore
                  ? "Nie zna jeszcze zaklęć: wylosuj je w kreatorze przed pierwszą grą."
                  : loreMissingInBuilder(u)
                    ? "Tradycja magii nie jest wybrana: zaznacz ją w kreatorze, w ekwipunku postaci."
                    : needsLoreChoice(u)
                      ? "Wybierz tradycję magii."
                      : "Nie rozpoznano tradycji magii tej postaci."}
              </p>
            )}
            {lore && (
              <details className="hub-details">
                <summary>Pełna lista: {lore}</summary>
                <ul className="magic-list">
                  {spellList(lore).map((s) => (
                    <li key={s.key}>
                      <button type="button" className="campaign-link-button magic-list-item" onClick={() => setModal(spellModal(u, s))}>
                        <span>{s.from === s.to ? s.from : `${s.from}–${s.to}`}</span> {s.name}
                        <small>{s.cast.toLowerCase()}</small>
                      </button>
                    </li>
                  ))}
                </ul>
              </details>
            )}
          </article>
        );
      })}
      <div className="magic-dice">
        <h4>Kostki w fazie magii</h4>
        {pools.mages.map((m) => (
          <Pips key={m.id} label={`Moc: ${m.label}`} total={m.n} used={Math.min(m.n, used[m.id] || 0)} onToggle={(n) => mark(m.id, n)} />
        ))}
        {pools.mages.length > 0 && (
          <Pips label="Moc: pula kompanii" total={pools.pool + extra} used={Math.min(pools.pool + extra, used.pool || 0)} onToggle={(n) => mark("pool", n)} />
        )}
        <Pips label="Rozproszenie" total={pools.dispelTotal + extraDispel} used={Math.min(pools.dispelTotal + extraDispel, used.dispel || 0)} onToggle={(n) => mark("dispel", n)} />
        {pools.priests.length > 0 && (
          <p className="hub-muted">Duchowni nie używają kostek mocy: odmawiają do dwóch różnych modlitw na turę (poziom mocy 5).</p>
        )}
        <details className="hub-details">
          <summary>Skąd te kostki? Dodatkowe z przedmiotów (s. 550)</summary>
          <div className="magic-extra">
          <label className="hub-field hub-field-inline">
            Dodatkowe kostki mocy
            <input type="number" min="0" inputMode="numeric" value={extra} onChange={(e) => mark("extraPower", Math.max(0, Number(e.target.value) || 0))} />
          </label>
          <label className="hub-field hub-field-inline">
            Dodatkowe rozproszenia
            <input type="number" min="0" inputMode="numeric" value={extraDispel} onChange={(e) => mark("extraDispel", Math.max(0, Number(e.target.value) || 0))} />
          </label>
        </div>

          <ul className="magic-list">
            {pools.mages.map((m) => (
              <li key={m.id}>{m.label}: {m.n} własne, najwyżej {m.max} na jedno zaklęcie</li>
            ))}
            {pools.mages.length > 0 && <li>Pula kompanii: 1 kostka dla dowolnego maga (+ przedmioty i zasady)</li>}
            {pools.dispel.map((d) => (
              <li key={d.label}>Rozproszenie, {d.label}: +{d.n}</li>
            ))}
            <li>Model, który ucieka, jest oszołomiony, powalony lub poza stołem, nie generuje kostek.</li>
          </ul>
        </details>
        <button type="button" className="button button-secondary button-small" onClick={() => setUsed({ extraPower: used.extraPower, extraDispel: used.extraDispel })}>
          Nowa faza magii: odznacz kostki
        </button>
      </div>
      {modal && <RulesModal title={modal.title} sections={modal.sections} onClose={() => setModal(null)} />}
    </section>
  );
}

// Builder, before the first game (s. 550 / 590): casters recruited without a
// spell choose their lore if needed and take their first spell or prayer.
// The result is stored on the unit, like a rolled stigma.
export function FirstSpellsPanel({ unitList, setUnitList }) {
  const pending = unitList.filter((u) => isCaster(u) && !(u.learnedSpells || []).length);
  if (!pending.length) return null;
  const assign = (id, patch) =>
    setUnitList(unitList.map((u) => (u.uniqueId === id ? { ...u, ...patch } : u)));
  return (
    <section className="stigmata-panel" aria-label="Zaklęcia przed pierwszą grą">
      <h3>Zaklęcia i modlitwy przed pierwszą grą</h3>
      <p>
        Magowie losują pierwsze zaklęcie (K6, magia powszechna, można zamienić na
        7. zaklęcie tradycji), duchowni pierwszą modlitwę (K6, można zamienić na
        pierwszą modlitwę). Wynik zapisuje się w karcie postaci.
      </p>
      {pending.map((u) => (
        <article className="stigma-row" key={u.uniqueId}>
          <div className="stigma-row-head">
            <strong>{nameOf(u)}</strong>
            <small>{loreOf(u) || (loreMissingInBuilder(u) ? "tradycja: wybierz w ekwipunku" : "wybierz tradycję")}</small>
          </div>
          {needsLoreChoice(u) && (
            <label className="hub-field">
              Tradycja magii
              <select value="" onChange={(e) => e.target.value && assign(u.uniqueId, { magicLore: e.target.value })}>
                <option value="">Wybierz tradycję</option>
                {loreChoices(u).map((l) => (
                  <option key={l}>{l}</option>
                ))}
              </select>
            </label>
          )}
          {loreOf(u) ? (
            <FirstSpell unit={u} onAssign={(patch) => assign(u.uniqueId, patch)} />
          ) : (
            !needsLoreChoice(u) && (
              <p className="stigma-error">
                {loreMissingInBuilder(u)
                  ? "Najpierw zaznacz tradycję magii w ekwipunku postaci (lista jednostek obok)."
                  : "Nie rozpoznano tradycji magii tej postaci."}
              </p>
            )
          )}
        </article>
      ))}
    </section>
  );
}
