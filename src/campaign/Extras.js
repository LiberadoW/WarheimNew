import React, { useState } from "react";
import DiceInput from "./DiceInput";
import {
  modelCount,
  heroDevelopment,
  hasRule,
  log,
  validDice,
  sum,
  label,
} from "./rules";
import { mercenariesList } from "../Data.js/Mercenaries";

export function RollNotebook({ post, update }) {
  const [dice, setDice] = useState([]),
    [count, setCount] = useState(1),
    [reason, setReason] = useState("");
  return (
    <details className="campaign-card">
      <summary>Dodatkowy test / rzut z opisu zasady</summary>
      <label>
        Cel rzutu
        <input
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Np. test WT w studni, K3 = K6/2 w górę"
        />
      </label>
      <label>
        Liczba kości K6
        <input
          type="number"
          min="1"
          max="12"
          value={count}
          onChange={(e) => {
            setCount(Math.max(1, Math.min(12, Number(e.target.value))));
            setDice([]);
          }}
        />
      </label>
      <DiceInput
        label={reason || "Dodatkowy rzut"}
        count={count}
        value={dice}
        onChange={setDice}
      />
      <button
        className="button"
        disabled={!validDice(dice, count) || !reason.trim()}
        onClick={() => {
          update((p) =>
            log(
              p,
              "roll",
              `${reason}: [${dice.join(", ")}], suma ${sum(dice)}`,
            ),
          );
          setDice([]);
        }}
      >
        Zapisz wynik w dzienniku
      </button>
    </details>
  );
}
export function EconomyAdjustment({ post, update }) {
  const [gold, setGold] = useState(0),
    [loot, setLoot] = useState(0),
    [reason, setReason] = useState("");
  return (
    <details className="campaign-card">
      <summary>Rozlicz żołd, nagrodę lub efekt zasady</summary>
      <label>
        Uzasadnienie
        <input value={reason} onChange={(e) => setReason(e.target.value)} />
      </label>
      <div className="campaign-grid">
        <label>
          Zmiana złota (ujemna = wydatek)
          <input
            type="number"
            value={gold}
            onChange={(e) => setGold(Math.trunc(Number(e.target.value)))}
          />
        </label>
        <label>
          Zmiana łupów
          <input
            type="number"
            value={loot}
            onChange={(e) => setLoot(Math.trunc(Number(e.target.value)))}
          />
        </label>
      </div>
      <button
        className="button"
        disabled={
          !reason.trim() ||
          (!gold && !loot) ||
          post.treasury + gold < 0 ||
          post.loot + loot < 0
        }
        onClick={() => {
          update((p) => {
            p.treasury += gold;
            p.loot += loot;
            log(
              p,
              "economy",
              `${reason}: ${gold >= 0 ? "+" : ""}${gold} zk, ${loot >= 0 ? "+" : ""}${loot} łupów.`,
            );
          });
          setGold(0);
          setLoot(0);
          setReason("");
        }}
      >
        Zastosuj i zapisz
      </button>
    </details>
  );
}
export function ExperiencedRecruits({ post, update }) {
  const [id, setId] = useState("");
  const groups = post.units.filter(
    (u) =>
      !heroDevelopment(u) &&
      !u.campaignModelStatus?.every((s) => s.dead) &&
      !hasRule(u, "Nieświadomy"),
  );
  const unit = groups.find((u) => u.uniqueId === id),
    exp = Number(unit?.exp) || 0,
    cost = (Number(unit?.cost) || 0) + exp * 2;
  return (
    <>
      <p>Pozostała pula PD: {post.recruitBudget || 0}</p>
      <label>
        Dołącz rekruta do istniejącej grupy
        <select value={id} onChange={(e) => setId(e.target.value)}>
          <option value="">Wybierz grupę</option>
          {groups.map((u) => (
            <option key={u.uniqueId} value={u.uniqueId}>
              {label(u)} · {u.exp || 0} PD
            </option>
          ))}
        </select>
      </label>
      {unit && (
        <>
          <p>Pełny ekwipunek i dopłata za PD: {cost} zk.</p>
          <button
            className="button"
            disabled={
              !post.recruitBudgetLocked ||
              exp > (post.recruitBudget || 0) ||
              cost > post.treasury ||
              modelCount(unit) >= Math.min(5, unit.number || 5)
            }
            onClick={() =>
              update((p) => {
                const u = p.units.find((x) => x.uniqueId === id);
                p.treasury -= cost;
                p.recruitBudget -= exp;
                u.selectedNumber = modelCount(u) + 1;
                u.totalCost = u.cost * u.selectedNumber;
                u.campaignModelStatus = [
                  ...(u.campaignModelStatus ||
                    Array.from({ length: u.selectedNumber - 1 }, () => ({}))),
                  {},
                ];
                log(
                  p,
                  "recruitment",
                  `Doświadczony ${label(u)}: ${cost} zk, ${exp} PD puli.`,
                );
              })
            }
          >
            Dołącz rekruta
          </button>
        </>
      )}
    </>
  );
}
export function Wages({ post, update }) {
  const mercs = post.units.filter((u) => mercenariesList[u.unitName]);
  return (
    <>
      <h3>Żołd Najemnych Ostrzy</h3>
      {mercs.length ? (
        mercs.map((u) => {
          const pay = mercenariesList[u.unitName].pay || 0;
          const paid = post.wages?.[u.uniqueId];
          return (
            <div className="campaign-card" key={u.uniqueId}>
              <strong>
                {label(u)} · {pay} zk
              </strong>
              <button
                className="button"
                disabled={paid || post.treasury < pay}
                onClick={() =>
                  update((p) => {
                    p.treasury -= pay;
                    p.wages = { ...(p.wages || {}), [u.uniqueId]: true };
                    log(p, "wages", `${label(u)}: ${pay} zk żołdu.`);
                  })
                }
              >
                {paid ? "Wypłacono" : "Wypłać żołd"}
              </button>
            </div>
          );
        })
      ) : (
        <p>Brak Najemnych Ostrzy wymagających żołdu.</p>
      )}
    </>
  );
}
