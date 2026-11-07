import useRollDraft from "./useRollDraft";
import NumberInput from "./NumberInput";
import React, { useEffect, useRef, useState } from "react";
import { companyLevel } from "./company";
import {
  discountDice,
  quotePrice,
  chemicalKind,
  settleStrigos,
  taxDice,
  basePriceOf,
  giantArmour,
  giantArmourBlocked,
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

export function AvailabilityPool({ post, update, compact = false }) {
  const heroes = eligibleHeroes(post.units).filter(
    (u) => !hasRule(u, "Anoreksja"),
  );
  const [reroll, setReroll] = useRollDraft(post, update, "availability-reroll"),
    [selected, setSelected] = useState("");
  return (
    <section>
      {!compact && <><h3>Pula wyników dostępności</h3>
      <p>
        Każdy uprawniony bohater daje jeden wynik 2K6. Wynik zużywasz na jeden
        rzadki przedmiot lub rekruta. Wyniki niewykorzystane przepadają.
      </p></>}
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
              <details>
                <summary>Modyfikatory wyniku</summary>
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
              </details>
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
      {post.availability && ["Kontakty handlowe", "Alchemicy", "Truciciele", "Obrotność"].some((name) => companyLevel(post, name) > 0) && (
        <>
          <label>
            Wynik do modyfikacji zasadą kompanii
            <select
              value={selected}
              disabled={validDice(reroll, 2)}
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
                  disabled={!selected}
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
      {!compact && <Reference pages={[426]} />}
    </section>
  );
}
function CatalogItem({ item, unit, post, update, armyName, toInventory, onBack }) {
  const key = `${item.id}:${toInventory ? "inventory" : unit?.uniqueId}`;
  const quote = post.quotes[key];
  const attempt = quote?.id || "first";
  const [draftDice, setDice] = useRollDraft(post, update, `price:${key}:${attempt}`);
  const [draftDiscount, setDiscount] = useRollDraft(post, update, `discount:${key}:${attempt}`);
  const [draftTax, setTax] = useRollDraft(post, update, `tax:${key}:${attempt}`);
  const [token, setToken] = useState("");
  const [repeatOf, setRepeatOf] = useState(null);
  const completed = quote?.used && quote.id !== repeatOf;
  const saved = quote && !quote.used ? quote : null;
  const dice = saved?.dice || draftDice;
  const discountRoll = saved?.discountRoll || draftDiscount;
  const taxRoll = saved?.taxRoll || draftTax;
  const count = priceDiceCount(item.price), discounts = discountDice(post, item);
  const quantity = toInventory ? 1 : modelCount(unit || {});
  const recipient = toInventory ? "Skarbiec kompanii" : (unit?.unitDisplayName || unit?.unitName || "Brak postaci");
  const reason = toInventory ? null : !unit ? "Wybierz postać, dla której kupujesz ekwipunek." : giantArmourBlocked(unit, item) || equipmentPermission(unit, item, armyName) || equipmentCapacity(unit, item);
  const priceUnit = toInventory ? null : unit;
  const base = (count === 0 || validDice(dice, count)) ? basePriceOf(item, dice, priceUnit) : null;
  const taxes = taxDice(post, base);
  const priceAllowed = /^(\d+\+)?(\d*K[236](X\d+)?|\d+)$/i.test(item.price);
  const tokens = (post.availability || []).filter(t => t.locked && !t.used && availabilityValue(t, item) >= item.availability);
  const tokenId = saved?.tokenId || token || (tokens.length === 1 ? tokens[0].id : "");
  const priceReady = priceAllowed && (count === 0 || validDice(dice, count)) && (discounts === 0 || validDice(discountRoll, discounts)) && (taxes === 0 || validDice(taxRoll, taxes));
  const price = saved ? saved.price : priceReady ? quotePrice(post, item, dice, discountRoll, { taxRoll, unit: priceUnit }) : null;
  const total = price == null ? null : price * quantity;
  const availabilityReady = !item.availability || tokens.some(t=>t.id === tokenId);
  return (
    <article className="campaign-purchase" aria-label={`Zakup: ${item.name}`}>
      <button type="button" className="campaign-back" onClick={onBack}>← Wróć do przedmiotów</button>
      <p className="campaign-source">{item.category} · podręcznik s. {item.page}</p>
      <h3>{item.name}</h3>
      <p>{recipient} · {quantity} {quantity === 1 ? "sztuka" : "szt."}</p>
      <details className="campaign-item-description"><summary>Statystyki, zasady i ograniczenia</summary><p>{item.text}</p></details>
      {completed ? (
        <div className="campaign-purchase-success" role="status">
          <strong>Zakupiono: {item.name}</strong>
          <p>Przedmiot trafił do: {recipient}. Zapłacono {quote.price * quantity} zk. Skarbiec: {post.treasury} zk.</p>
          <button className="button" onClick={onBack}>Wróć do listy</button>
          <button className="button button-secondary" onClick={()=>setRepeatOf(quote.id)}>Kup kolejne</button>
        </div>
      ) : reason ? <p className="campaign-error">{reason}</p> : (
        <>
          {item.availability > 0 && (
            <section className="campaign-purchase-step">
              <h4>Dostępność {item.availability}+</h4>
              {tokens.length === 0 && <p className="campaign-muted">Potrzebujesz niewykorzystanego wyniku co najmniej {item.availability}. Rzut wykonujesz raz na bohatera po potyczce.</p>}
              <details open={tokens.length === 0}>
                <summary>Rzuty i wyniki dostępności</summary>
                <AvailabilityPool post={post} update={update} compact />
              </details>
              <label>Wynik dostępności
                <select value={tokenId} disabled={!!saved} onChange={e=>setToken(e.target.value)}>
                  <option value="">Wybierz zatwierdzony wynik</option>
                  {tokens.map(t=><option key={t.id} value={t.id}>{t.name}: {availabilityValue(t,item)}</option>)}
                </select>
              </label>
            </section>
          )}
          <section className="campaign-purchase-step">
            <h4>Cena {item.price} zk / szt.</h4>
            {count > 0 && <DiceInput label={`Cena: ${item.name}`} count={count} value={dice} onChange={setDice} disabled={!!saved} />}
            {discounts > 0 && <DiceInput label={`Zniżka: ${item.name}`} count={discounts} value={discountRoll} onChange={setDiscount} disabled={!!saved} />}
            {giantArmour(priceUnit, item) && <p className="campaign-source">Wielkolud: koszt pancerza x2 ({base ?? "…"} zk).</p>}
            {taxes > 0 && <DiceInput label={`Podatek (cena podstawowa ${base} zk): +${taxes}K6`} count={taxes} value={taxRoll} onChange={setTax} disabled={!!saved} />}
            {!priceAllowed && <p>Wybierz wariant ceny według opisu przedmiotu.</p>}
          </section>
          <div className="campaign-purchase-total">
            <div><span>Do zapłaty</span><strong>{total == null ? "Ustal wynik rzutu" : `${total} zk`}</strong>
              <small>{quantity > 1 && total != null ? `${quantity} × ${price} zk · ` : ""}W skarbcu: {post.treasury} zk</small></div>
            <button className="button" disabled={!priceReady || !availabilityReady || total > post.treasury || post.tradeClosed}
              onClick={()=>update(p=>{
                if ((p.quotes[key]?.id || null) !== (quote?.id || null)) throw Error("Zakup został już rozliczony.");
                if (!saved) {
                  p.quotes[key] = { id: uid(), itemId: item.id, price: quotePrice(p,item,dice,discountRoll,{ taxRoll, unit: priceUnit }),
                    discountRoll, taxRoll, chemicalKind: chemicalKind(item), basePrice: Number(item.price.match(/^\d+/)?.[0] || 0),
                    dice, tokenId, used: false };
                  log(p,"price",`${item.name}: ${p.quotes[key].price} zk (kości: ${dice.join(",") || "cena stała"}${taxes ? `; podatek ${taxRoll.join("+")}` : ""}${giantArmour(priceUnit, item) ? "; wielkolud x2" : ""})`);
                }
                buyItem(p,unit?.uniqueId,item,p.quotes[key],armyName,toInventory);
              })}>
              {total == null ? "Kup przedmiot" : `Kup za ${total} zk`}
            </button>
          </div>
          {total != null && total > post.treasury && <p className="campaign-error">Brakuje {total-post.treasury} zk do zakupu.</p>}
        </>
      )}
    </article>
  );
}
export default function Trade({ post, update, army, commonOnly = false }) {
  const [theftDice, setTheftDice] = useRollDraft(post, update, "strigos-theft");
  const [selectedId, setSelected] = useRollDraft(post, update, "trade-selected", "");
  const [recipientId, setUnitId] = useRollDraft(post, update, "trade-recipient", post.units.find(u=>!u.campaignModelStatus?.every(s=>s.dead))?.uniqueId || "");
  const [category, setCategory] = useState(""), [query, setQuery] = useState("");
  const [all, setAll] = useState(false), [limit, setLimit] = useState(24);
  const [inventory, setInventory] = useRollDraft(post, update, "trade-inventory", false);
  const unit = post.units.find(u=>u.uniqueId === recipientId && !u.campaignModelStatus?.every(s=>s.dead)) || post.units.find(u=>!u.campaignModelStatus?.every(s=>s.dead));
  const unitId = unit?.uniqueId || "";
  const categories = [...new Set(catalog.map(i=>i.category))];
  const shown = catalog.filter(i=>(!category || i.category===category) && normal(i.name).includes(normal(query)) &&
    (all || inventory || (!equipmentPermission(unit,i,army.name) && !giantArmourBlocked(unit,i))) &&
    (!commonOnly || !i.availability));
  const selected = catalog.find(i=>i.id === selectedId);
  const heading = useRef(null), previousSelection = useRef(selectedId);
  useEffect(()=>{
    if (previousSelection.current !== selectedId) {
      heading.current?.scrollIntoView?.({block:"start",behavior:"instant"});
      heading.current?.focus({preventScroll:true});
    }
    previousSelection.current=selectedId;
  },[selectedId]);
  return (
    <section className="campaign-shop" aria-label="Sklep kampanii">
      <div className="campaign-shop-heading" ref={heading} tabIndex={-1}>
        <h3>{commonOnly ? "Ekwipunek powszechny" : "Handel"}</h3><strong>{post.treasury} <small>zk w skarbcu</small></strong>
      </div>
      {commonOnly && <p className="campaign-source">Krok 9: nowi rekruci i pozostali drużynnicy mogą kupić przedmioty powszechne. Rzadkie kupujesz w kroku 7.</p>}
      {post.tradeClosed && <p>Handel z taborytami zakończony, wynik kradzieży zapisany.</p>}
      <fieldset disabled={post.tradeClosed}>
        <div className="campaign-shop-recipient">
          <label>Odbiorca zakupów
            <select value={inventory ? "inventory" : unitId} onChange={e=>{
              setInventory(e.target.value === "inventory");
              if(e.target.value !== "inventory") setUnitId(e.target.value);
              setSelected("");
            }}>
              {post.units.filter(u=>!u.campaignModelStatus?.every(s=>s.dead)).map(u=><option key={u.uniqueId} value={u.uniqueId}>{u.unitDisplayName || u.unitName}{modelCount(u)>1 ? ` · ${modelCount(u)} modele` : ""}</option>)}
              <option value="inventory">Skarbiec kompanii</option>
            </select>
          </label>
          <p className="campaign-muted">{inventory ? "Przedmioty do późniejszego przydziału." : unit && modelCount(unit)>1 ? `Kupujesz komplet dla ${modelCount(unit)} modeli.` : "Ekwipunek z listy wybranej postaci."}</p>
        </div>
        {selected ? <CatalogItem key={`${selected.id}:${unitId}:${inventory}`} item={selected} unit={unit}
          post={post} update={update} armyName={army.name} toInventory={inventory} onBack={()=>setSelected("")} /> : (
          <>
            <div className="campaign-shop-filters">
              <label>Szukaj przedmiotu<input type="search" placeholder="Nazwa, np. miecz lub trucizna" value={query} onChange={e=>{setQuery(e.target.value);setLimit(24);}} /></label>
              <label>Kategoria<select value={category} onChange={e=>{setCategory(e.target.value);setLimit(24);}}>
                <option value="">Wszystkie kategorie</option>{categories.map(c=><option key={c}>{c}</option>)}
              </select></label>
            </div>
            <details className="campaign-shop-options"><summary>Opcje listy i pula dostępności</summary>
              <label className="campaign-check"><input type="checkbox" checked={all} onChange={e=>setAll(e.target.checked)} />Pokaż również niedozwolone dla postaci</label>
              {!commonOnly && <AvailabilityPool post={post} update={update} />}
            </details>
            <p className="campaign-source">{shown.length} przedmiotów · wybierz przedmiot, aby zobaczyć zasady i kupić</p>
            <div className="campaign-shop-list">
              {shown.slice(0,limit).map(item=>{
                const reason=inventory ? null : giantArmourBlocked(unit,item) || equipmentPermission(unit,item,army.name) || equipmentCapacity(unit,item);
                return <button type="button" className="campaign-shop-item" key={item.id} aria-label={`Wybierz: ${item.name}`} onClick={()=>setSelected(item.id)}>
                  <span className="campaign-shop-item-name">{item.name}<small>{item.category}</small></span>
                  <span className="campaign-shop-item-price">{item.price} zk<small>{reason ? "Sprawdź ograniczenia" : item.availability ? `Dostępność ${item.availability}+` : "Powszechny"}</small></span>
                  <span aria-hidden="true">›</span>
                </button>;
              })}
            </div>
            {!shown.length && <p>Brak przedmiotów spełniających filtry.</p>}
            {shown.length>limit && <button className="button button-secondary" onClick={()=>setLimit(limit+24)}>Pokaż kolejne ({shown.length-limit})</button>}
          </>
        )}
        {post.effects?.strigosTheftPending && <section className="campaign-card">
          <h3>Zakończenie handlu ze Strigosem</h3><p>50% zniżki. Po wszystkich zakupach rzuć K6: na 5+ tracisz całe złoto i wszystkie łupy. Zatwierdzenie zamyka handel.</p>
          <DiceInput label="Strigos: kradzież po handlu" value={theftDice} onChange={setTheftDice} />
          <button className="button" disabled={!validDice(theftDice,1)} onClick={()=>update(p=>settleStrigos(p,theftDice))}>Zakończ handel z taborytami</button>
        </section>}
      </fieldset>
    </section>
  );
}
