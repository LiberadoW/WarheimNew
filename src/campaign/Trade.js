import NumberInput from "./NumberInput";
import React, { useState } from "react";
import { companyLevel } from "./company";
import {
  discountDice,
  quotePrice,
  chemicalKind,
  settleStrigos,
} from "./trading";
import DiceInput from "./DiceInput";
import Reference from "./Reference";
import {
  catalog,
  equipmentPermission,
  equipmentCapacity,
  normal,
  priceDiceCount,
  validDice,
  modelCount,
  buyItem,
  log,
  uid,
  sum,
  hasRule,
  eligibleHeroes,
  availabilityValue,
} from "./rules";

export function AvailabilityPool({ post, update }) {
  const heroes = eligibleHeroes(post.units).filter(
    (u) => !hasRule(u, "Anoreksja"),
  );
  const [reroll, setReroll] = useState([]),
    [selected, setSelected] = useState("");
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
                <NumberInput
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
      {post.availability && (
        <>
          <label>
            Wynik do modyfikacji zasadą kompanii
            <select
              value={selected}
              onChange={(e) => {
                setSelected(e.target.value);
                setReroll([]);
              }}
            >
              <option value="">Wybierz</option>
              {post.availability
                .filter((t) => t.locked && !t.used)
                .map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}: {t.total}
                  </option>
                ))}
            </select>
          </label>
          {[
            ["Kontakty handlowe", "contacts", ""],
            ["Alchemicy", "alchemy", "alchemyBonus"],
            ["Truciciele", "poison", "poisonBonus"],
          ].map(
            ([name, key, field]) =>
              companyLevel(post, name) > 0 && (
                <button
                  className="button"
                  key={key}
                  disabled={!selected || post.availabilityBonuses?.[key]}
                  onClick={() =>
                    update((p) => {
                      if (p.availabilityBonuses?.[key])
                        throw Error("Premia została już przydzielona.");
                      const t = p.availability.find((t) => t.id === selected);
                      if (!t?.locked || t.used)
                        throw Error("Ten wynik jest niedostępny.");
                      const bonus = companyLevel(p, name);
                      if (field) t[field] = bonus;
                      else {
                        t.modifier += bonus;
                        t.total += bonus;
                      }
                      p.availabilityBonuses = {
                        ...(p.availabilityBonuses || {}),
                        [key]: selected,
                      };
                      log(
                        p,
                        "availability",
                        `${name}: +${bonus} do wyniku ${t.name}${field ? " przy zakupie odpowiednich specyfików" : ""}.`,
                      );
                    })
                  }
                >
                  {name}: przydziel +{companyLevel(post, name)}
                </button>
              ),
          )}
          {companyLevel(post, "Obrotność") > 0 &&
            !post.availabilityRerolled && (
              <>
                <DiceInput
                  label="Obrotność: nowy wynik dostępności"
                  count={2}
                  value={reroll}
                  onChange={setReroll}
                />
                <button
                  className="button"
                  disabled={!selected || !validDice(reroll, 2)}
                  onClick={() =>
                    update((p) => {
                      if (p.availabilityRerolled)
                        throw Error("Przerzut już wykorzystano.");
                      const t = p.availability.find((t) => t.id === selected);
                      if (!t?.locked || t.used)
                        throw Error("Ten wynik jest niedostępny.");
                      t.originalDice = t.dice;
                      t.dice = reroll;
                      t.total = sum(reroll) + t.modifier;
                      p.availabilityRerolled = true;
                      log(
                        p,
                        "availability",
                        `Obrotność: ${t.name}, ${reroll.join("+")} + ${t.modifier} = ${t.total}.`,
                      );
                    })
                  }
                >
                  Zastosuj przerzut dostępności
                </button>
              </>
            )}
        </>
      )}
      <Reference pages={[426]} />
    </section>
  );
}
function CatalogItem({ item, unit, post, update, armyName, toInventory }) {
  const [dice, setDice] = useState([]);
  const [token, setToken] = useState("");
  const [discountRoll, setDiscountRoll] = useState([]);
  const discounts = discountDice(post, item);
  const key = `${item.id}:${toInventory ? "inventory" : unit?.uniqueId}`;
  const quote = post.quotes[key];
  const count = priceDiceCount(item.price);
  const reason = toInventory
    ? null
    : equipmentPermission(unit, item, armyName) ||
      equipmentCapacity(unit, item);
  const priceAllowed = /^(\d+\+)?(\d*K[236](X\d+)?|\d+)$/i.test(item.price);
  const tokens = (post.availability || []).filter(
    (t) =>
      t.locked && !t.used && availabilityValue(t, item) >= item.availability,
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
              {discounts > 0 && (
                <DiceInput
                  label={`Zniżka: ${item.name}`}
                  count={discounts}
                  value={discountRoll}
                  onChange={setDiscountRoll}
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
                        {t.name}: {availabilityValue(t, item)}
                      </option>
                    ))}
                  </select>
                </label>
              )}
              <button
                className="button button-secondary"
                disabled={
                  !priceAllowed ||
                  (discounts > 0 && !validDice(discountRoll, discounts)) ||
                  (count > 0 && !validDice(dice, count)) ||
                  (item.availability > 0 && !token)
                }
                onClick={() =>
                  update((p) => {
                    p.quotes[key] = {
                      id: uid(),
                      itemId: item.id,
                      price: quotePrice(p, item, dice, discountRoll),
                      discountRoll,
                      chemicalKind: chemicalKind(item),
                      basePrice: Number(item.price.match(/^\d+/)?.[0] || 0),
                      dice,
                      tokenId: token,
                      used: false,
                    };
                    log(
                      p,
                      "price",
                      `${item.name}: ${p.quotes[key].price} zk (kości: ${dice.join(",") || "cena stała"})`,
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
  const [theftDice, setTheftDice] = useState([]);
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
      {post.tradeClosed && (
        <p>Handel z taborytami zakończony, wynik kradzieży zapisany.</p>
      )}
      <fieldset disabled={post.tradeClosed}>
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
          Przedmioty poza listą można kupić do skarbca do późniejszego
          przydziału.
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
        {post.effects?.strigosTheftPending && (
          <section className="campaign-card">
            <h3>Zakończenie handlu ze Strigosem</h3>
            <p>
              50% zniżki. Po wszystkich zakupach rzuć K6: na 5+ tracisz całe
              złoto i wszystkie łupy. Zatwierdzenie zamyka handel.
            </p>
            <DiceInput
              label="Strigos: kradzież po handlu"
              value={theftDice}
              onChange={setTheftDice}
            />
            <button
              className="button"
              disabled={!validDice(theftDice, 1)}
              onClick={() => update((p) => settleStrigos(p, theftDice))}
            >
              Zakończ handel z taborytami
            </button>
          </section>
        )}
      </fieldset>
    </>
  );
}
