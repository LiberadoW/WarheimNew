import NumberInput from "./NumberInput";
import React from "react";
import { companyLevel } from "./company";
import * as R from "./rules";
import DiceInput from "./DiceInput";
import useRollDraft from "./useRollDraft";
import { lootSaleAuto } from "./auto-rules";

// The sale as the draft stands: quantity, income and the rules applied.
// Shared by the step screen and the sequence's main button.
export function lootQuote(battle, post) {
  const auto = lootSaleAuto(post);
  const cpTest = post.rollDrafts?.["spendthrift-cp"] ?? [];
  const cpRolled = R.validDice(cpTest, 2);
  const cpPassed = cpRolled && R.sum(cpTest) <= auto.leaderCp;
  // Rozrzutność: a failed CP test forces the sale of all loot.
  const forceAll = auto.spendthrift && cpRolled && !cpPassed;
  const quantity = forceAll ? post.loot : Number(post.lootDraft?.quantity) || 0;
  const modifier = Number(post.lootDraft?.modifier) || 0;
  const models = post.units
    .filter((u) => !["Najemne Ostrze", "Postać Dramatu"].includes(u.type))
    .reduce(
      (n, u) =>
        n +
        R.modelCount(u) -
        (u.campaignModelStatus || []).filter((s) => s.dead).length,
      0,
    ) + auto.gluttons;
  const ruleLevels =
    -auto.economists + (auto.spendthrift && cpRolled ? 1 : 0);
  // Nadpodaż uses everyone's sales; the player enters only the others' loot.
  const others = Math.max(0, Number(battle.othersSold) || 0);
  const totalSold = quantity + others;
  const players = Math.max(2, Number(battle.players) || 2);
  const gold = R.income(
    quantity > 0
      ? quantity + (companyLevel(post, "Rządcy") ? 1 : 0) + auto.extraLoot
      : 0,
    models,
    players,
    totalSold,
    modifier +
      ruleLevels +
      (post.effects?.incomeLevel || 0) -
      companyLevel(post, "Samowystarczalni"),
  );
  const notes = [
    auto.gluttons && `Przepastne trzewia: +${auto.gluttons} do liczby modeli`,
    auto.economists && `Ekonom: −${auto.economists} poziom liczebności`,
    auto.revelators.length && `Rewelator: +${auto.revelators.length} łup przy sprzedaży`,
    auto.wagon && "Wóz przemytniczy: +1 łup przy sprzedaży",
    companyLevel(post, "Rządcy") && "Rządcy: +1 łup przy sprzedaży",
  ].filter(Boolean);
  return {
    auto,
    cpTest,
    cpRolled,
    cpPassed,
    // The leader's CP test must be rolled before anything is sold.
    needsCp: auto.spendthrift && !!auto.leader && !cpRolled,
    forceAll,
    quantity,
    modifier,
    models,
    others,
    totalSold,
    players,
    gold,
    notes,
  };
}

export function applyLootSale(p, battle) {
  if (p.lootSold) throw Error("Łupy zostały już sprzedane w tej sekwencji.");
  const q = lootQuote(battle, p);
  if (q.needsCp) throw Error("Rzuć test CP dowódcy (Rozrzutność).");
  p.loot -= q.quantity;
  p.treasury += q.gold;
  p.lootSold = true;
  R.log(
    p,
    "income",
    `Sprzedano ${q.quantity} łupów za ${q.gold} zk. Gracze: ${q.players}, łączna sprzedaż: ${q.totalSold}, modyfikator: ${q.modifier}${q.notes.length ? `; ${q.notes.join("; ")}` : ""}${q.auto.spendthrift && q.cpRolled ? `; Rozrzutność: test CP ${R.sum(q.cpTest)} vs ${q.auto.leaderCp}` : ""}.`,
  );
}

function LootSale({ battle, post, update, setBattle }) {
  // Draft values live in the saved battle, so a reload or step change keeps them.
  const [cpTest, setCpTest] = useRollDraft(post, update, "spendthrift-cp");
  const {
    auto,
    cpRolled,
    cpPassed,
    forceAll,
    quantity,
    modifier,
    models,
    others,
    totalSold,
    players,
    gold,
    notes,
  } = lootQuote(battle, post);
  const setDraft = (patch) =>
    update((p) => {
      p.lootDraft = { quantity, modifier, ...p.lootDraft, ...patch };
    });
  const setQuantity = (value) => setDraft({ quantity: value });
  const setModifier = (value) => setDraft({ modifier: value });
  const step = (value) => setQuantity(Math.max(0, Math.min(post.loot, value)));
  return (
    <>
      {!!notes.length && (
        <ul className="campaign-auto-rules" aria-label="Zasady liczone automatycznie">
          {notes.map((n) => (
            <li key={n}>{n}</li>
          ))}
        </ul>
      )}
      {auto.spendthrift && (
        <section className="campaign-card">
          <h3>Rozrzutność: test CP dowódcy</h3>
          {!auto.leader ? (
            <p>Brak żyjącego dowódcy.</p>
          ) : (
            <>
              <DiceInput
                label={`Test CP ${R.label(auto.leader)} (CP ${auto.leaderCp})`}
                count={2}
                value={cpTest}
                onChange={setCpTest}
                disabled={post.lootSold}
              />
              {cpRolled && (
                <p className={cpPassed ? "campaign-done" : "campaign-error"}>
                  {cpPassed
                    ? "Test udany: liczba modeli o jeden poziom większa."
                    : "Test nieudany: poziom liczebności +1 i trzeba sprzedać wszystkie łupy."}
                </p>
              )}
            </>
          )}
        </section>
      )}
      <div className="campaign-sale">
        <div className="campaign-sale-qty">
          <span>Sprzedajesz łupów</span>
          <div className="campaign-stepper">
            <button
              type="button"
              aria-label="Mniej łupów"
              disabled={post.lootSold || forceAll || quantity <= 0}
              onClick={() => step(quantity - 1)}
            >
              −
            </button>
            <NumberInput
              aria-label="Sprzedawane łupy"
              type="number"
              min="0"
              max={post.loot}
              disabled={post.lootSold || forceAll}
              value={quantity}
              onChange={(e) => step(Math.floor(Number(e.target.value)))}
            />
            <button
              type="button"
              aria-label="Więcej łupów"
              disabled={post.lootSold || forceAll || quantity >= post.loot}
              onClick={() => step(quantity + 1)}
            >
              +
            </button>
          </div>
          <small>z {post.loot} w skarbcu · {models} modeli w kompanii</small>
        </div>
        <div className="campaign-sale-result">
          <span>Przychód</span>
          <strong>{gold} zk</strong>
        </div>
      </div>
      <details className="campaign-help">
        <summary>
          Nadpodaż: {players} graczy, łącznie {totalSold} łupów
          {modifier ? ` · modyfikator ${modifier}` : ""}
        </summary>
        <div className="campaign-grid">
          <label>
            Liczba graczy
            <NumberInput
              type="number"
              min="2"
              disabled={post.lootSold}
              value={players}
              onChange={(e) =>
                setBattle({ ...battle, players: Math.max(2, Number(e.target.value)) })
              }
            />
          </label>
          <label>
            Łupy sprzedane przez pozostałych graczy
            <NumberInput
              type="number"
              min="0"
              disabled={post.lootSold}
              value={others}
              onChange={(e) =>
                setBattle({ ...battle, othersSold: Math.max(0, Number(e.target.value)) })
              }
            />
          </label>
          <label>
            Modyfikator poziomu liczebności z zasad
            <NumberInput
              type="number"
              disabled={post.lootSold}
              value={modifier}
              onChange={(e) => setModifier(Number(e.target.value))}
            />
          </label>
        </div>
      </details>
      {post.lootSold && (
        <p className="campaign-done">✓ Sprzedaż łupów rozliczona</p>
      )}
    </>
  );
}

export default LootSale;
