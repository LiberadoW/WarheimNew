import React, { useState } from "react";
import DiceInput from "../campaign/DiceInput";
import { sum, validDice } from "../campaign/rules";
import { alreadyHasGift, CHAOS_GIFTS, chaosTakedowns } from "./chaosGifts";

function ChaosGift({ entry, play, canEdit, onSave }) {
  const [dice, setDice] = useState([]);
  const saved = play.chaosGifts?.[entry.id];
  const result = saved?.result ?? (validDice(dice, 2) ? sum(dice) : null);
  const gift = CHAOS_GIFTS[result];
  const repeat = !saved && gift && alreadyHasGift(play, entry, result);
  return (
    <article className="game-unit">
      <strong>{entry.eyeOfChaos.hero}</strong>
      <p className="hub-muted">R{entry.round} · Wyłącza z akcji: {entry.eyeOfChaos.target}</p>
      {!saved && canEdit && <DiceInput label="Dary Chaosu" count={2} value={dice} onChange={setDice} />}
      {gift && <p>{result} · <strong>{gift.name}</strong> · {gift.text || gift.rule}</p>}
      {saved && <p className="hub-muted">Rzut: {saved.dice.join(" + ")}</p>}
      {!saved && !canEdit && <p className="hub-muted">Oczekuje na rzut 2K6.</p>}
      {!saved && canEdit && repeat && (
        <>
          <p>Bohater ma już ten dar. Rzuć ponownie.</p>
          <button type="button" className="button button-secondary" onClick={() => setDice([])}>Rzuć ponownie</button>
        </>
      )}
      {!saved && canEdit && gift && !repeat && (
        <button type="button" className="button" onClick={() => onSave(entry.id, dice)}>Zapisz wynik Darów Chaosu</button>
      )}
    </article>
  );
}

export default function ChaosGiftsPanel({ play, canEdit, onSave }) {
  const entries = chaosTakedowns(play);
  if (!entries.length) return null;
  return (
    <section className="hub-card" aria-label="Oko Chaosu">
      <h3>Oko Chaosu</h3>
      <p className="hub-muted">Dary działają do końca tej potyczki.</p>
      {entries.map((entry) => <ChaosGift key={entry.id} entry={entry} play={play} canEdit={canEdit} onSave={onSave} />)}
    </section>
  );
}
