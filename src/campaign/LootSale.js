import React, { useState } from "react";
import { companyLevel } from "./company";
import * as R from "./rules";

function LootSale({ battle, post, update, setBattle }) {
  const [quantity, setQuantity] = useState(0);
  const [modifier, setModifier] = useState(0);
  const models = post.units
    .filter((u) => !["Najemne Ostrze", "Postać Dramatu"].includes(u.type))
    .reduce(
      (n, u) =>
        n +
        R.modelCount(u) -
        (u.campaignModelStatus || []).filter((s) => s.dead).length,
      0,
    );
  const gold = R.income(
    quantity > 0 ? quantity + (companyLevel(post, "Rządcy") ? 1 : 0) : 0,
    models,
    Number(battle.players) || 2,
    Number(battle.totalSold) || 0,
    modifier +
      (post.effects?.incomeLevel || 0) -
      companyLevel(post, "Samowystarczalni"),
  );
  return (
    <>
      <p>
        Łupy w skarbcu: <strong>{post.loot}</strong> · liczba modeli: {models}.
        Sprzedaż możliwa raz po potyczce.
      </p>
      <div className="campaign-grid">
        <label>
          Sprzedawane łupy
          <input
            type="number"
            min="0"
            max={post.loot}
            disabled={post.lootSold}
            value={quantity}
            onChange={(e) =>
              setQuantity(
                Math.max(
                  0,
                  Math.min(post.loot, Math.floor(Number(e.target.value))),
                ),
              )
            }
          />
        </label>
        <label>
          Liczba graczy
          <input
            type="number"
            min="2"
            disabled={post.lootSold}
            value={battle.players}
            onChange={(e) =>
              setBattle({
                ...battle,
                players: Math.max(2, Number(e.target.value)),
              })
            }
          />
        </label>
        <label>
          Suma łupów sprzedanych przez wszystkich (w tym Twoje)
          <input
            type="number"
            min={quantity}
            disabled={post.lootSold}
            value={battle.totalSold}
            onChange={(e) =>
              setBattle({
                ...battle,
                totalSold: Math.max(0, Number(e.target.value)),
              })
            }
          />
        </label>
        <label>
          Modyfikator poziomu liczebności z zasad
          <input
            type="number"
            disabled={post.lootSold}
            value={modifier}
            onChange={(e) => setModifier(Number(e.target.value))}
          />
        </label>
      </div>
      <p>
        Przychód według tabeli i nadpodaży: <strong>{gold} zk</strong>.
      </p>
      <button
        className="button"
        disabled={
          post.lootSold || (quantity > 0 && battle.totalSold < quantity)
        }
        onClick={() =>
          update((p) => {
            p.loot -= quantity;
            p.treasury += gold;
            p.lootSold = true;
            R.log(
              p,
              "income",
              `Sprzedano ${quantity} łupów za ${gold} zk. Gracze: ${battle.players}, łączna sprzedaż: ${battle.totalSold}, modyfikator: ${modifier}.`,
            );
          })
        }
      >
        {quantity ? "Sprzedaj łupy" : "Zatwierdź bez sprzedaży"}
      </button>
    </>
  );
}

export default LootSale;
