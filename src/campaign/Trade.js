import React, { useState } from "react";
import DiceInput from "./DiceInput";
import Reference from "./Reference";
import {
  catalog,
  equipmentPermission,
  equipmentCapacity,
  normal,
  priceDiceCount,
  priceRoll,
  validDice,
  modelCount,
  buyItem,
  log,
  uid,
  sum,
  hasRule,
  eligibleHeroes,
} from "./rules";

export function AvailabilityPool({ post, update }) {
  const heroes = eligibleHeroes(post.units);
  return (
    <section>
      <h3>Pula wyników dostępności</h3>
      <p>
        Każdy uprawniony bohater daje jeden wynik 2K6. Wynik zużywasz na jeden
        rzadki przedmiot lub rekruta. Wyniki niewykorzystane przepadają.
      </p>
      {post.availability === null ? (
        <button
          className="button"
          onClick={() =>
            update((p) => {
              p.availability = heroes.map((u) => ({
                id: uid(),
                unitId: u.uniqueId,
                name: u.unitDisplayName || u.unitName,
                dice: [],
                total: 0,
                modifier: hasRule(u, "Ulicznik") ? 3 : 0,
                reason: hasRule(u, "Ulicznik") ? "Ulicznik" : "",
                used: false,
              }));
              log(p, "availability", "Utworzono pulę dostępności.");
            })
          }
        >
          Utwórz pulę ({heroes.length} bohaterów)
        </button>
      ) : (
        <div className="campaign-grid">
          {post.availability.map((token) => (
            <div className="campaign-card" key={token.id}>
              <strong>{token.name}</strong>
              <DiceInput
                label={`Dostępność: ${token.name}`}
                count={2}
                value={token.dice}
                disabled={token.used || token.locked}
                onChange={(dice, source) =>
                  update((p) => {
                    const t = p.availability.find((x) => x.id === token.id);
                    t.dice = dice;
                    t.source = source;
                    t.total = validDice(dice, 2)
                      ? sum(dice) + (Number(t.modifier) || 0)
                      : 0;
                  })
                }
              />
              <label>
                Modyfikator
                <input
                  type="number"
                  value={token.modifier}
                  disabled={token.used || token.locked}
                  onChange={(e) =>
                    update((p) => {
                      const t = p.availability.find((x) => x.id === token.id);
                      t.modifier = Number(e.target.value);
                      t.total = validDice(t.dice, 2)
                        ? sum(t.dice) + t.modifier
                        : 0;
                    })
                  }
                />
              </label>
              <label>
                Zasada / przedmiot uzasadniający modyfikator
                <input
                  value={token.reason}
                  disabled={token.used || token.locked}
                  onChange={(e) =>
                    update((p) => {
                      p.availability.find((x) => x.id === token.id).reason =
                        e.target.value;
                    })
                  }
                />
              </label>
              <p>
                Wynik: <strong>{token.total}</strong> ·{" "}
                {token.used
                  ? "wykorzystany"
                  : token.locked
                    ? "zatwierdzony"
                    : "niezatwierdzony"}
              </p>
              {!token.locked && (
                <button
                  className="button"
                  disabled={
                    !validDice(token.dice, 2) ||
                    (token.modifier !== 0 && !token.reason.trim())
                  }
                  onClick={() =>
                    update((p) => {
                      p.availability.find((x) => x.id === token.id).locked =
                        true;
                      log(
                        p,
                        "roll",
                        `Dostępność ${token.name}: ${token.dice.join("+")} ${token.modifier >= 0 ? "+" : ""}${token.modifier} = ${token.total}. ${token.reason}`,
                      );
                    })
                  }
                >
                  Zatwierdź wynik
                </button>
              )}
            </div>
          ))}
        </div>
      )}
      <Reference pages={[426]} />
    </section>
  );
}
function CatalogItem({ item, unit, post, update, armyName, toInventory }) {
  const [dice, setDice] = useState([]);
  const [token, setToken] = useState("");
  const key = `${item.id}:${toInventory ? "inventory" : unit?.uniqueId}`;
  const quote = post.quotes[key];
  const count = priceDiceCount(item.price);
  const reason = toInventory
    ? null
    : equipmentPermission(unit, item, armyName) ||
      equipmentCapacity(unit, item);
  const priceAllowed = /^(\d+\+)?(\d*K[236](X\d+)?|\d+)$/i.test(item.price);
  const tokens = (post.availability || []).filter(
    (t) => t.locked && !t.used && t.total >= item.availability,
  );
  return (
    <article className="campaign-item">
      <div className="campaign-row">
        <strong>{item.name}</strong>
        <span>{item.price} zk</span>
        <span> Dostępność: {item.availability || "powszechna"}</span>
      </div>
      <p className="campaign-source">
        {item.category} · podręcznik s. {item.page}
      </p>
      <details>
        <summary>Opis, zasady i ograniczenia</summary>
        <p>{item.text}</p>
      </details>
      {reason ? (
        <p className="campaign-muted">{reason}</p>
      ) : (
        <>
          {!quote || quote.used ? (
            <>
              {count > 0 && (
                <DiceInput
                  label={`Cena: ${item.name}`}
                  count={count}
                  value={dice}
                  onChange={setDice}
                />
              )}
              {item.availability > 0 && (
                <label>
                  Wynik dostępności
                  <select
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                  >
                    <option value="">Wybierz wynik</option>
                    {tokens.map((t) => (
                      <option value={t.id} key={t.id}>
                        {t.name}: {t.total}
                      </option>
                    ))}
                  </select>
                </label>
              )}
              <button
                className="button button-secondary"
                disabled={
                  !priceAllowed ||
                  (count > 0 && !validDice(dice, count)) ||
                  (item.availability > 0 && !token)
                }
                onClick={() =>
                  update((p) => {
                    const pricing = priceRoll(item.price, dice);
                    p.quotes[key] = {
                      id: uid(),
                      itemId: item.id,
                      price: pricing.price,
                      basePrice: Number(item.price.match(/^\d+/)?.[0] || 0),
                      dice,
                      tokenId: token,
                      used: false,
                    };
                    log(
                      p,
                      "price",
                      `${item.name}: ${pricing.price} zk (kości: ${dice.join(",") || "cena stała"})`,
                    );
                  })
                }
              >
                Ustal cenę
              </button>
              {!priceAllowed && (
                <p>Wybierz wariant ceny według opisu przedmiotu.</p>
              )}
            </>
          ) : (
            <div className="campaign-row">
              <strong>
                {quote.price} zk / model · razem{" "}
                {quote.price * (toInventory ? 1 : modelCount(unit))} zk
              </strong>
              <button
                className="button"
                disabled={
                  post.treasury <
                  quote.price * (toInventory ? 1 : modelCount(unit))
                }
                onClick={() =>
                  update((p) =>
                    buyItem(
                      p,
                      unit?.uniqueId,
                      item,
                      p.quotes[key],
                      armyName,
                      toInventory,
                    ),
                  )
                }
              >
                Kup {toInventory ? "do skarbca" : "dla postaci"}
              </button>
            </div>
          )}
        </>
      )}
    </article>
  );
}
export default function Trade({ post, update, army }) {
  const [unitId, setUnitId] = useState(
    post.units.find((u) => !u.campaignModelStatus?.every((s) => s.dead))
      ?.uniqueId || "",
  );
  const [category, setCategory] = useState("");
  const [query, setQuery] = useState("");
  const [all, setAll] = useState(false);
  const [inventory, setInventory] = useState(false);
  const unit = post.units.find((u) => u.uniqueId === unitId);
  const categories = [...new Set(catalog.map((i) => i.category))];
  const shown = catalog.filter(
    (i) =>
      (!category || i.category === category) &&
      normal(i.name).includes(normal(query)) &&
      (all || inventory || !equipmentPermission(unit, i, army.name)),
  );
  return (
    <>
      <AvailabilityPool post={post} update={update} />
      <h3>Handel · skarbiec: {post.treasury} zk</h3>
      <div className="campaign-grid">
        <label>
          Postać / grupa
          <select value={unitId} onChange={(e) => setUnitId(e.target.value)}>
            {post.units
              .filter((u) => !u.campaignModelStatus?.every((s) => s.dead))
              .map((u) => (
                <option key={u.uniqueId} value={u.uniqueId}>
                  {u.unitDisplayName || u.unitName}
                </option>
              ))}
          </select>
        </label>
        <label>
          Kategoria
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Wszystkie kategorie</option>
            {categories.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>
        <label>
          Szukaj przedmiotu
          <input value={query} onChange={(e) => setQuery(e.target.value)} />
        </label>
      </div>
      <div className="campaign-row">
        <label className="campaign-check">
          <input
            type="checkbox"
            checked={inventory}
            onChange={(e) => setInventory(e.target.checked)}
          />
          Kupuj do skarbca
        </label>
        <label className="campaign-check">
          <input
            type="checkbox"
            checked={all}
            onChange={(e) => setAll(e.target.checked)}
          />
          Pokaż również niedozwolone dla postaci
        </label>
      </div>
      <p className="campaign-muted">
        Dla grupy stronników kupowany jest komplet dla każdego modelu.
        Przedmioty poza listą można kupić do skarbca do późniejszego przydziału.
      </p>
      <div className="campaign-catalog">
        {shown.length ? (
          shown.map((item) => (
            <CatalogItem
              key={`${item.id}:${unitId}:${inventory}`}
              item={item}
              unit={unit}
              post={post}
              update={update}
              armyName={army.name}
              toInventory={inventory}
            />
          ))
        ) : (
          <p>Brak przedmiotów spełniających filtry.</p>
        )}
      </div>
    </>
  );
}
