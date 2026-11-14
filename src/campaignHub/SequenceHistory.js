import React from "react";

const RESULT = { win: "wygrana", loss: "porażka", draw: "remis" };

// A player's settled sequence for this game, read from the company they
// uploaded to the campaign (campaignNotes.campaign.history).
export const sequenceFor = (list, gameId) =>
  (list?.campaignNotes?.campaign?.history || []).find((h) => h.campaignGame?.gameId === gameId) || null;

function SequenceEntry({ name, entry }) {
  const s = entry.summary || {};
  const changes = (s.unitResults || [])
    .map((u) => {
      const hurt = (u.modelResults || []).filter((m) => m.status !== "aktywny").map((m) => `${m.modelLabel}: ${m.status}`);
      return { label: u.unitLabel, exp: u.gainedExp, hurt };
    })
    .filter((u) => u.exp || u.hurt.length);
  return (
    <details className="hub-details sequence-entry">
      <summary>
        {name}: {RESULT[entry.result] || "rozliczona"} · +{s.totalExpGained || 0} PD · skarbiec {entry.treasury ?? "?"} zk
        {entry.loot ? ` · ${entry.loot} łupów` : ""}
      </summary>
      {changes.length > 0 && (
        <ul className="sequence-units">
          {changes.map((u) => (
            <li key={u.label}>
              <strong>{u.label}</strong>
              {u.exp ? ` · +${u.exp} PD` : ""}
              {u.hurt.length ? ` · ${u.hurt.join("; ")}` : ""}
            </li>
          ))}
        </ul>
      )}
      {(entry.journal || []).length > 0 && (
        <details className="hub-details">
          <summary>Dziennik sekwencji ({entry.journal.length})</summary>
          <ol className="sequence-journal">
            {entry.journal.map((j, i) => (
              <li key={j.id || i}>{j.text}</li>
            ))}
          </ol>
        </details>
      )}
    </details>
  );
}

// Both players' sequences after the game: visible to everyone in the campaign.
export default function SequenceHistory({ game, sides }) {
  return (
    <section className="hub-card" aria-label="Sekwencje po potyczce">
      <h3>Sekwencje po potyczce</h3>
      {sides.map((s) => {
        const entry = sequenceFor(s.list, game.id);
        return entry ? (
          <SequenceEntry key={s.owner} name={s.name} entry={entry} />
        ) : (
          <p key={s.owner} className="hub-muted">
            {s.name}: {game.sequenceDone?.[s.owner] ? "rozliczona, rozpiska w kampanii nie jest jeszcze zaktualizowana." : "jeszcze nie rozliczona."}
          </p>
        );
      })}
    </section>
  );
}
