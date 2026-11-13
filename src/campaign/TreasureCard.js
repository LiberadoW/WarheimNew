import React from "react";
import DiceInput from "./DiceInput";
import NumberInput from "./NumberInput";
import { lootWord, treasureState } from "./treasure";

// Exploration step: treasure markers and the scenario's reward, added to
// the loot together with the exploration (rozdział 11).
export default function TreasureCard({ battle, post, update }) {
  const s = treasureState(battle, post);
  if (!s) return null;
  const t = post.exploration?.treasure || {};
  const locked = !!post.explorationApplied;
  const set = (patch) =>
    update((p) => {
      p.exploration = {
        dice: [],
        encounter: {},
        ...(p.exploration || {}),
        treasure: { ...(p.exploration?.treasure || {}), ...patch },
      };
    });
  const listAt = (field, i, value) => {
    const next = [...(t[field] || [])];
    next[i] = value[0];
    set({ [field]: next });
  };
  const rule = s.rule;
  return (
    <section className="campaign-card" aria-label="Kosztowności ze scenariusza">
      <h3>Kosztowności i zdarzenia</h3>
      <p className="campaign-muted">
        {rule ? `${rule.name} (s. ${rule.page})` : "Scenariusz własny: sprawdź jego opis."}
        {rule?.pdPerMarker ? " · bohaterowie dostali +1 PD za każdy swój znacznik." : ""}
      </p>
      <label className="campaign-inline-field">
        Znaczniki kosztowności wyniesione z pola bitwy
        <NumberInput
          type="number"
          min="0"
          disabled={locked}
          value={s.markers}
          onChange={(e) => set({ markers: Math.max(0, Math.floor(Number(e.target.value))) })}
        />
      </label>
      {s.markers !== s.counted && (
        <p className="campaign-source">Na ekranie potyczki zapisano {s.counted}.</p>
      )}
      <label className="campaign-inline-field">
        Zdarzenia losowe w potyczce (+1 łup każde, s. 398)
        <NumberInput
          type="number"
          min="0"
          disabled={locked}
          value={s.events}
          onChange={(e) => set({ events: Math.max(0, Math.floor(Number(e.target.value))) })}
        />
      </label>
      {!rule && (
        <label className="campaign-inline-field">
          Łupy z kosztowności według scenariusza
          <NumberInput
            type="number"
            min="0"
            disabled={locked}
            value={Number.isInteger(t.manualLoot) ? t.manualLoot : s.markers}
            onChange={(e) => set({ manualLoot: Math.max(0, Math.floor(Number(e.target.value))) })}
          />
        </label>
      )}
      {rule?.chest &&
        Array.from({ length: s.markers }, (_, i) => {
          const d = (t.chest || [])[i];
          const [lo, hi] = rule.chest.loot;
          const other = d && !(d >= lo && d <= hi) ? rule.chest.other : null;
          return (
            <div key={i} className="campaign-treasure-chest">
              <DiceInput
                label={`Skrzynia ${i + 1}: K6 (${lo === hi ? lo : `${lo}–${hi}`} = +1 łup)`}
                value={d ? [d] : []}
                disabled={locked}
                onChange={(v) => listAt("chest", i, v)}
              />
              {other && other.kind !== "manual" && (
                <DiceInput
                  label={other.kind === "gold" ? `Rubin ${i + 1}: K6 × 15 zk` : `Krasnoludzki proch ${i + 1}: K3 porcje`}
                  value={(t.chestOther || [])[i] ? [(t.chestOther || [])[i]] : []}
                  disabled={locked}
                  onChange={(v) => listAt("chestOther", i, v)}
                />
              )}
            </div>
          );
        })}
      {rule?.bonus && (
        <>
          <label className="campaign-check">
            <input
              type="checkbox"
              disabled={locked}
              checked={!!t.bonusMet}
              onChange={(e) => set({ bonusMet: e.target.checked })}
            />
            Nagroda ze scenariusza ({rule.bonus.dice} łupy): {rule.bonus.condition}
          </label>
          {t.bonusMet && (
            <DiceInput
              label={`Nagroda: ${rule.bonus.dice}`}
              value={t.bonusDice || []}
              disabled={locked}
              onChange={(v) => set({ bonusDice: v })}
            />
          )}
        </>
      )}
      {s.manual.map((m) => (
        <p key={m} className="campaign-source">{m}</p>
      ))}
      <p className={s.missing ? "campaign-source" : "campaign-done"}>
        {s.missing ||
          `Razem: +${s.loot} ${lootWord(s.loot)}${s.gold ? `, +${s.gold} zk` : ""}${s.items.length ? `, ${s.items.map((i) => `${i.name} ×${i.quantity}`).join(", ")}` : ""}${locked ? " · doliczone" : " · doliczy się z eksploracją"}`}
      </p>
    </section>
  );
}
