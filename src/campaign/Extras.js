import useRollDraft from "./useRollDraft";
import NumberInput from "./NumberInput";
import React, { useState } from "react";
import { livingCount } from "./effects";
import { campaignModelLimit } from "./company";
import { rosterModels } from "./recruiting";
import { companyLevel } from "./company";
import DiceInput from "./DiceInput";
import { modelCount, hasRule, log, validDice, sum, label } from "./rules";
import { mercenariesList } from "../Data.js/Mercenaries";
import { recruitTaxes } from "./trading";

export function RollNotebook({ post, update }) {
  const [dice, setDice] = useRollDraft(post, update, "notebook-dice", []),
    [count, setCount] = useRollDraft(post, update, "notebook-count", 1),
    [reason, setReason] = useRollDraft(post, update, "notebook-reason", "");
  return (
    <details className="campaign-card">
      <summary>Dodatkowy test / rzut z opisu zasady</summary>
      <label>
        Cel rzutu
        <input
          disabled={validDice(dice, count)}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Np. test WT w studni, K3 = K6/2 w górę"
        />
      </label>
      <label>
        Liczba kości K6
        <NumberInput
          type="number"
          min="1"
          max="12"
          disabled={validDice(dice, count)}
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
        disabled={!reason.trim()}
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
          <NumberInput
            type="number"
            value={gold}
            onChange={(e) => setGold(Math.trunc(Number(e.target.value)))}
          />
        </label>
        <label>
          Zmiana łupów
          <NumberInput
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
export function ExperiencedRecruits({ post, update, army }) {
  const [id, setId] = useState("");
  const groups = post.units.filter(
    (u) =>
      u.type === "Stronnik" &&
      !u.campaignModelStatus?.every((s) => s.dead) &&
      !hasRule(u, "Nieświadomy"),
  );
  const unit = groups.find((u) => u.uniqueId === id),
    exp = Number(unit?.exp) || 0,
    taxes = recruitTaxes(post, unit),
    [taxRolls, setTaxRolls] = useRollDraft(post, update, `join-tax:${id}`, {}),
    taxOk = taxes.every((t) => validDice(taxRolls[t.key] || [], t.dice)),
    tax = taxOk ? taxes.reduce((n, t) => n + sum(taxRolls[t.key]), 0) : 0,
    cost = (Number(unit?.cost) || 0) + exp * 2 + tax;
  const groupLimit = Math.min(5, unit?.number || 5);
  // The reason the button is off, so the player is never left guessing.
  const blocker = !unit
    ? ""
    : !post.recruitBudgetLocked
      ? "Najpierw rzuć i zatwierdź pulę PD rekrutów."
      : !taxOk
        ? "Rzuć na podatek za ekwipunek rekruta."
      : exp > (post.recruitBudget || 0)
        ? `Grupa ma ${exp} PD, a w puli zostało ${post.recruitBudget || 0} PD.`
        : cost > post.treasury
          ? `Brakuje ${cost - post.treasury} zk (w skarbcu ${post.treasury} zk).`
          : livingCount(unit) >= groupLimit
            ? `Grupa ma już maksymalną liczbę modeli (${groupLimit}).`
            : army && rosterModels(post) >= campaignModelLimit(army, post)
              ? `Kompania ma już limit ${campaignModelLimit(army, post)} modeli.`
              : "";
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
          {taxes.length > 0 && (
            <div className="campaign-join-tax">
              <p>Podatek za ekwipunek rekruta (Podatek):</p>
              {taxes.map((t) => (
                <DiceInput
                  key={t.key}
                  label={`Podatek: ${t.name} (cena podstawowa ${t.price} zk)`}
                  count={t.dice}
                  value={taxRolls[t.key] || []}
                  onChange={(v) => setTaxRolls({ ...taxRolls, [t.key]: v })}
                />
              ))}
            </div>
          )}
          <p>
            Pełny ekwipunek i dopłata za PD: {(Number(unit.cost) || 0) + exp * 2} zk
            {taxes.length > 0 && (taxOk ? ` + podatek ${tax} zk = ${cost} zk` : " + podatek (rzuć powyżej)")}.
          </p>
          <button
            className="button"
            disabled={!!blocker}
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
                  `Doświadczony ${label(u)}: ${cost} zk${tax ? ` (w tym podatek ${tax} zk: ${taxes.map((t) => `${t.name} ${(taxRolls[t.key] || []).join("+")}`).join(", ")})` : ""}, ${exp} PD puli.`,
                );
                p.rollDrafts = { ...p.rollDrafts, [`join-tax:${id}`]: {} };
              })
            }
          >
            Dołącz rekruta
          </button>
          {blocker && <p className="campaign-error">{blocker}</p>}
        </>
      )}
    </>
  );
}
export const wageUnits = (post) =>
  post.units.filter(
    (u) =>
      u.type === "Najemne Ostrze" &&
      livingCount(u) > 0 &&
      !u.campaignNewRecruit &&
      Array.from(
        { length: modelCount(u) },
        (_, i) => !u.battleAbsentModels?.[i],
      ).some(Boolean),
  );
export function Wages({ post, update }) {
  const mercs = wageUnits(post);
  const [banDice, setBanDice] = useRollDraft(post, update, "wage-refusal", {});
  // Nothing to pay: the section stays out of the way.
  if (!mercs.length) return null;
  return (
    <>
      <h3>Żołd Najemnych Ostrzy</h3>
      {mercs.length ? (
        mercs.map((u) => {
          const pay = Math.ceil(
            (u.pay ?? mercenariesList[u.unitName]?.pay ?? 0) *
              (post.effects?.wageHalf ? 0.5 : 1),
          );
          const settled = post.wages?.[u.uniqueId];
          return (
            <div className="campaign-card" key={u.uniqueId}>
              <strong>
                {label(u)} · {pay} zk
              </strong>
              {settled ? (
                <p>Rozliczono żołd.</p>
              ) : (
                <>
                  <button
                    className="button"
                    disabled={post.treasury < pay}
                    onClick={() =>
                      update((p) => {
                        const current = p.units.find(
                          (x) => x.uniqueId === u.uniqueId,
                        );
                        if (p.wages?.[u.uniqueId])
                          throw Error("Żołd już rozliczony.");
                        if (p.treasury < pay) throw Error("Za mało złota.");
                        p.treasury -= pay;
                        p.wages = { ...(p.wages || {}), [u.uniqueId]: "paid" };
                        if (current.campaignContract)
                          delete current.campaignContract.companyFree;
                        log(p, "wages", `${label(u)}: ${pay} zk żołdu.`);
                      })
                    }
                  >
                    Wypłać żołd
                  </button>
                  {u.campaignContract?.companyFree && (
                    <DiceInput
                      label={`Odmowa żołdu: czas niedostępności ${label(u)} (K3)`}
                      value={banDice[u.uniqueId] || []}
                      onChange={(dice) =>
                        setBanDice({ ...banDice, [u.uniqueId]: dice })
                      }
                    />
                  )}
                  <button
                    className="button button-secondary"
                    disabled={
                      u.campaignContract?.companyFree &&
                      !validDice(banDice[u.uniqueId], 1)
                    }
                    onClick={() =>
                      update((p) => {
                        if (u.campaignContract?.companyFree) {
                          if (!validDice(banDice[u.uniqueId], 1))
                            throw Error(
                              "Wykonaj rzut K3 na niedostępność najemnika.",
                            );
                          p.mercenaryBans = {
                            ...(p.mercenaryBans || {}),
                            [u.unitName]: Math.ceil(banDice[u.uniqueId][0] / 2),
                          };
                        }
                        p.units = p.units.filter(
                          (x) => x.uniqueId !== u.uniqueId,
                        );
                        p.wages = {
                          ...(p.wages || {}),
                          [u.uniqueId]: "dismissed",
                        };
                        log(
                          p,
                          "dismissal",
                          `${label(u)} opuszcza kompanię z własnym ekwipunkiem, bez wypłaty żołdu.`,
                        );
                      })
                    }
                  >
                    Odmów żołdu i odpraw
                  </button>
                </>
              )}
            </div>
          );
        })
      ) : (
        <p>Brak Najemnych Ostrzy wymagających żołdu za tę potyczkę.</p>
      )}
    </>
  );
}
export function RecruitBudget({ post, update }) {
  const level = companyLevel(post, "Weteran"),
    count = level >= 2 ? 3 : 2,
    rolls = level ? 2 : 1;
  return (
    <>
      <p>
        Pula PD dostępnych do rekrutacji doświadczonych stronników.{" "}
        {level ? "Weteran: wybierz jeden z dwóch wyników." : ""}
      </p>
      {Array.from({ length: rolls }, (_, i) => (
        <DiceInput
          key={i}
          label={
            i === 0
              ? "Dostępne PD rekrutów"
              : "Dostępne PD rekrutów, drugi wynik"
          }
          count={count}
          disabled={post.recruitBudgetLocked}
          value={post.recruitRolls?.[i] || []}
          onChange={(dice) =>
            update((p) => {
              p.recruitRolls = { ...(p.recruitRolls || {}), [i]: dice };
            })
          }
        />
      ))}
      {Array.from({ length: rolls }, (_, i) => (
        <button
          className="button"
          key={i}
          disabled={
            post.recruitBudgetLocked ||
            !Array.from({ length: rolls }, (_, k) =>
              validDice(post.recruitRolls?.[k], count),
            ).every(Boolean)
          }
          onClick={() =>
            update((p) => {
              if (p.recruitBudgetLocked) throw Error("Pula już zatwierdzona.");
              p.recruitBudget = sum(p.recruitRolls[i]);
              p.recruitBudgetLocked = true;
              log(
                p,
                "recruit-budget",
                `Dostępne PD: ${p.recruitBudget}. Wynik ${i + 1}.`,
              );
            })
          }
        >
          Zatwierdź pulę PD{rolls > 1 ? ` — wynik ${i + 1}` : ""}
        </button>
      ))}
    </>
  );
}
