import { livingCount } from "./effects";
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
  purchaseTotal,
  log,
  uid,
  sum,
  availabilityValue,
  createAvailabilityPool,
  setAvailabilityDice,
  setAvailabilityHelper,
  bribeAvailability,
  refreshAvailability,
  usableAvailability,
  roll,
} from "./rules";

// Pula Kości Dostępności (s. 426): one result per hero, used for rare
// equipment and recruits; common items never need it.
export function AvailabilityPool({ post, update, compact = false }) {
  const pool = post.availability;
  const [reroll, setReroll] = useRollDraft(post, update, "availability-reroll"),
    [selected, setSelected] = useState("");
  const [bribeCost, setBribeCost] = useRollDraft(post, update, "availability-bribe");
  const [bribeTarget, setBribeTarget] = useState("");

  // The pool exists as soon as trading starts; nothing to create by hand.
  useEffect(() => {
    if (pool === null || pool === undefined) update((p) => createAvailabilityPool(p));
  }, [pool]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!pool) return null;
  const open = pool.filter((t) => !t.used && !t.helping);
  const unrolled = open.filter((t) => !t.locked);
  const nameOf = (id) => pool.find((t) => t.id === id)?.name || "";

  const rollAll = () =>
    update((p) =>
      p.availability
        .filter((t) => !t.used && !t.helping && !t.locked)
        .forEach((t) => setAvailabilityDice(p, t.id, roll(t.bribe ? 3 : 2), "app")),
    );

  return (
    <section className={`campaign-availability${compact ? " is-compact" : ""}`}>
      {!compact && (
        <>
          <h3>Pula dostępności</h3>
          <details className="campaign-help">
            <summary>Jak działa pula?</summary>
            <p className="campaign-muted">
              Po jednym wyniku 2K6 za każdego bohatera, który nie rzucał na tabelę poważnych ran.
              Wynik zużywasz na jeden rzadki przedmiot albo rekruta; powszechne przedmioty i rekruci
              go nie potrzebują. Niewykorzystane wyniki przepadają po sekwencji.
            </p>
          </details>
        </>
      )}
      {pool.length === 0 ? (
        <p className="campaign-muted">Żaden bohater nie może w tej sekwencji szukać rzadkich towarów.</p>
      ) : (
        <>
          <ul className="campaign-availability-tokens" aria-label="Wyniki puli dostępności">
            {pool.map((t) => (
              <li
                key={t.id}
                className={t.used ? "is-used" : t.helping ? "is-helping" : t.locked ? "is-ready" : ""}
              >
                <span className="campaign-availability-name">{t.name}</span>
                <strong>
                  {t.helping ? "pomaga" : t.locked ? t.total : "—"}
                </strong>
                <small>
                  {t.used
                    ? `→ ${t.usedFor || "wykorzystany"}`
                    : t.helping
                      ? `Społem: ${nameOf(t.helping)}`
                      : [
                          t.bribe && "3K6",
                          t.helpers && `+${t.helpers} społem`,
                          t.modifier && `${t.modifier > 0 ? "+" : ""}${t.modifier} ${t.reason}`,
                        ]
                          .filter(Boolean)
                          .join(" · ")}
                </small>
              </li>
            ))}
          </ul>
          {unrolled.length > 0 && (
            <button type="button" className="button" onClick={rollAll}>
              <i className="fa-solid fa-dice" aria-hidden="true"></i> Rzuć wszystkie ({unrolled.length})
            </button>
          )}
          <details>
            <summary>Wpisz rzuty, Społem i modyfikatory</summary>
            <div className="campaign-grid">
              {pool.map((token) => (
                <div className="campaign-card" key={token.id}>
                  <strong>{token.name}</strong>
                  {!token.helping && (
                    <DiceInput
                      label={`Dostępność: ${token.name}`}
                      count={token.bribe ? 3 : 2}
                      value={token.dice}
                      disabled={token.used}
                      onChange={(dice, source) =>
                        update((p) => setAvailabilityDice(p, token.id, dice, source))
                      }
                    />
                  )}
                  {!token.used && !token.locked && !token.bribe && (
                    <label>
                      Społem: pomaga bohaterowi
                      <select
                        value={token.helping || ""}
                        onChange={(e) =>
                          update((p) => setAvailabilityHelper(p, token.id, e.target.value || null))
                        }
                      >
                        <option value="">Nie pomaga (rzuca sam)</option>
                        {pool
                          .filter((t) => t.id !== token.id && !t.helping && !t.used)
                          .map((t) => (
                            <option key={t.id} value={t.id}>
                              {t.name}
                            </option>
                          ))}
                      </select>
                    </label>
                  )}
                  {!token.helping && (
                    <>
                      <label>
                        Modyfikator
                        <NumberInput
                          type="number"
                          value={token.modifier}
                          disabled={token.used}
                          onChange={(e) =>
                            update((p) => {
                              const t = p.availability.find((x) => x.id === token.id);
                              t.modifier = Number(e.target.value) || 0;
                              refreshAvailability(p.availability);
                            })
                          }
                        />
                      </label>
                      <label>
                        Zasada / przedmiot uzasadniający modyfikator
                        <input
                          value={token.reason}
                          disabled={token.used}
                          onChange={(e) =>
                            update((p) => {
                              p.availability.find((x) => x.id === token.id).reason = e.target.value;
                            })
                          }
                        />
                      </label>
                    </>
                  )}
                </div>
              ))}
            </div>
            {!pool.some((t) => t.bribe) && open.some((t) => !t.locked) && (
              <div className="campaign-card">
                <strong>Bogaty może więcej…</strong>
                <p className="campaign-muted">
                  Łapówka 2K6 zk: wybrany bohater rzuca 3K6 i odrzuca najniższą kość. Złoto przepada
                  niezależnie od wyniku. Raz w sekwencji.
                </p>
                <label>
                  Bohater
                  <select value={bribeTarget} onChange={(e) => setBribeTarget(e.target.value)}>
                    <option value="">Wybierz</option>
                    {open
                      .filter((t) => !t.locked)
                      .map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.name}
                        </option>
                      ))}
                  </select>
                </label>
                <DiceInput label="Wysokość łapówki" count={2} value={bribeCost} onChange={setBribeCost} />
                <button
                  type="button"
                  className="button button-secondary"
                  disabled={!bribeTarget || !validDice(bribeCost, 2)}
                  onClick={() => update((p) => bribeAvailability(p, bribeTarget, bribeCost))}
                >
                  Zapłać łapówkę{validDice(bribeCost, 2) ? ` (${sum(bribeCost)} zk)` : ""}
                </button>
              </div>
            )}
          </details>
        </>
      )}
      {post.availability && ["Kontakty handlowe", "Alchemicy", "Truciciele", "Obrotność"].some((name) => companyLevel(post, name) > 0) && (
        <details className="campaign-help">
          <summary>
            Premie z zasad kompanii:{" "}
            {["Kontakty handlowe", "Alchemicy", "Truciciele", "Obrotność"]
              .filter((name) => companyLevel(post, name) > 0)
              .join(", ")}
          </summary>
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
                        refreshAvailability(p.availability);
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
                      t.dice = t.bribe ? [...reroll, Math.min(...t.dice)] : reroll;
                      refreshAvailability(p.availability);
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
        </details>
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
  // Flat rolls from older drafts cover only the first item, never the group.
  const rawTaxes = saved?.taxRolls || draftTax;
  let taxRolls = Array.isArray(rawTaxes[0]) ? rawTaxes : rawTaxes.length ? [rawTaxes] : [];
  if (!taxRolls[0]?.length && saved?.taxRoll) taxRolls = [saved.taxRoll, ...taxRolls.slice(1)];
  const count = priceDiceCount(item.price), discounts = discountDice(post, item);
  const quantity = toInventory ? 1 : livingCount(unit || {});
  const recipient = toInventory ? "Skarbiec kompanii" : (unit?.unitDisplayName || unit?.unitName || "Brak postaci");
  const reason = toInventory ? null : !unit ? "Wybierz postać, dla której kupujesz ekwipunek." : giantArmourBlocked(unit, item) || equipmentPermission(unit, item, armyName) || equipmentCapacity(unit, item);
  const priceUnit = toInventory ? null : unit;
  const base = (count === 0 || validDice(dice, count)) ? basePriceOf(item, dice, priceUnit) : null;
  const taxes = taxDice(post, base);
  const priceAllowed = /^(\d+\+)?(\d*K[236](X\d+)?|\d+)$/i.test(item.price);
  // The smallest result that is enough, unless the player picks another.
  const tokens = usableAvailability(post, item.availability, (t) => availabilityValue(t, item));
  const tokenId = saved?.tokenId || (tokens.some((t) => t.id === token) ? token : tokens[0]?.id || "");
  const priceReady = priceAllowed && (count === 0 || validDice(dice, count)) && (discounts === 0 || validDice(discountRoll, discounts)) && (taxes === 0 || Array.from({ length: quantity }, (_, i) => validDice(taxRolls[i], taxes)).every(Boolean));
  const legacyGroupTax = !!saved && !saved.unitPrices && quantity > 1 && taxes > 0;
  const unitPrices = saved && !legacyGroupTax
    ? (saved.unitPrices || Array(quantity).fill(saved.price))
    : priceReady ? Array.from({ length: quantity }, (_, i) => quotePrice(post, item, dice, discountRoll, { taxRoll: taxRolls[i], unit: priceUnit })) : null;
  const total = unitPrices?.length === quantity ? sum(unitPrices) : null;
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
          <p>Przedmiot trafił do: {recipient}. Zapłacono {purchaseTotal(quote, quote.quantity ?? quantity)} zk. Skarbiec: {post.treasury} zk.</p>
          <button className="button" onClick={onBack}>Wróć do listy</button>
          <button className="button button-secondary" onClick={()=>setRepeatOf(quote.id)}>Kup kolejne</button>
        </div>
      ) : reason ? <p className="campaign-error">{reason}</p> : (
        <>
          {item.availability > 0 && (
            <section className="campaign-purchase-step">
              <h4>Dostępność {item.availability}+</h4>
              <p className="campaign-muted">Rzadki przedmiot: potrzebny niewykorzystany wynik puli co najmniej {item.availability}.</p>
              <AvailabilityPool post={post} update={update} compact />
              {tokens.length > 0 ? (
                <label>Zużyje wynik
                  <select value={tokenId} disabled={!!saved} onChange={e=>setToken(e.target.value)}>
                    {tokens.map(t=><option key={t.id} value={t.id}>{t.name}: {availabilityValue(t,item)}</option>)}
                  </select>
                </label>
              ) : (
                <p className="campaign-error">Żaden niewykorzystany wynik nie wystarcza ({item.availability}+).</p>
              )}
            </section>
          )}
          <section className="campaign-purchase-step">
            <h4>Cena {item.price} zk / szt.</h4>
            {count > 0 && <DiceInput label={`Cena: ${item.name}`} count={count} value={dice} onChange={setDice} disabled={!!saved} />}
            {discounts > 0 && <DiceInput label={`Zniżka: ${item.name}`} count={discounts} value={discountRoll} onChange={setDiscount} disabled={!!saved} />}
            {giantArmour(priceUnit, item) && <p className="campaign-source">Wielkolud: koszt pancerza x2 ({base ?? "…"} zk).</p>}
            {taxes > 0 && Array.from({ length: quantity }, (_, i) => (
              <div key={i} className="campaign-item-tax">
                <DiceInput
                  label={`${quantity > 1 ? `Podatek — sztuka ${i + 1} z ${quantity}` : "Podatek"} (cena podstawowa ${base} zk): +${taxes}K6`}
                  count={taxes} value={taxRolls[i] || []}
                  onChange={(value) => setTax(Array.from({ length: quantity }, (_, j) => j === i ? value : taxRolls[j] || []))}
                  disabled={!!saved?.unitPrices || (i === 0 && !!saved?.taxRoll)}
                />
                {unitPrices && quantity > 1 && <p className="campaign-source">Sztuka {i + 1}: {unitPrices[i]} zk (podatek: {sum(taxRolls[i] || [])} zk)</p>}
              </div>
            ))}
            {!priceAllowed && <p>Wybierz wariant ceny według opisu przedmiotu.</p>}
          </section>
          <div className="campaign-purchase-total">
            <div><span>Do zapłaty</span><strong>{total == null ? "Ustal wynik rzutu" : `${total} zk`}</strong>
              <small>{quantity > 1 && total != null ? `${unitPrices.join(" + ")} zk · ` : ""}W skarbcu: {post.treasury} zk</small></div>
            <button className="button" disabled={!priceReady || total == null || !availabilityReady || total > post.treasury || post.tradeClosed}
              onClick={()=>update(p=>{
                if ((p.quotes[key]?.id || null) !== (quote?.id || null)) throw Error("Zakup został już rozliczony.");
                if (!saved || legacyGroupTax) {
                  p.quotes[key] = { id: uid(), itemId: item.id, price: unitPrices[0], unitPrices, quantity,
                    discountRoll, taxRolls: taxes ? taxRolls : [], chemicalKind: chemicalKind(item), basePrice: Number(item.price.match(/^\d+/)?.[0] || 0),
                    dice, tokenId, used: false };
                  log(p,"price",`${item.name}: ${total} zk za ${quantity} szt. (kości: ${dice.join(",") || "cena stała"}${taxes ? `; podatek ${taxRolls.map((r, i) => `szt. ${i + 1}: ${r.join("+")}`).join("; ")}` : ""}${giantArmour(priceUnit, item) ? "; wielkolud x2" : ""})`);
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
// Why an item cannot be bought right now (greyed out in the list): no result
// in the pool is high enough once every hero has rolled, or even the cheapest
// possible price (lowest dice, best discount) exceeds the treasury.
export function unavailableReason(post, unit, item, toInventory = false) {
  if (item.availability > 0) {
    if (!toInventory && unit?.campaignNewRecruit) return "Nowy rekrut: tylko ze skarbca";
    const pool = post.availability || [];
    const waiting = pool.some((t) => !t.used && !t.helping && !t.locked);
    if (!waiting && !usableAvailability(post, item.availability, (t) => availabilityValue(t, item)).length)
      return pool.some((t) => !t.used && !t.helping) ? "Wynik puli za niski" : "Brak wyniku puli";
  }
  try {
    const ones = (n) => Array(n).fill(1);
    const base = basePriceOf(item, ones(priceDiceCount(item.price)), unit);
    if (base == null) return null;
    const cheapest = quotePrice(post, item, ones(priceDiceCount(item.price)), Array(discountDice(post, item)).fill(6),
      { taxRoll: ones(taxDice(post, base)), unit });
    const quantity = toInventory || !unit ? 1 : Math.max(1, livingCount(unit));
    if (cheapest * quantity > post.treasury) return `Za mało zk (od ${cheapest * quantity} zk)`;
  } catch {
    return null;
  }
  return null;
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
          <label>Postać
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
            {!commonOnly && <AvailabilityPool post={post} update={update} />}
            <details className="campaign-shop-options"><summary>Opcje listy</summary>
              <label className="campaign-check"><input type="checkbox" checked={all} onChange={e=>setAll(e.target.checked)} />Pokaż również niedozwolone dla postaci</label>
            </details>
            <p className="campaign-source">{shown.length} przedmiotów · wybierz przedmiot, aby zobaczyć zasady i kupić</p>
            <div className="campaign-shop-list">
              {shown.slice(0,limit).map(item=>{
                const reason=inventory ? null : giantArmourBlocked(unit,item) || equipmentPermission(unit,item,army.name) || equipmentCapacity(unit,item);
                const blocked=unavailableReason(post,unit,item,inventory);
                const tag=item.availability ? `Dostępność ${item.availability}+` : "Powszechny";
                return <button type="button" className={`campaign-shop-item${reason || blocked ? " is-unavailable" : ""}`} key={item.id}
                  aria-label={`Wybierz: ${item.name}`} aria-describedby={!reason && blocked ? `why-${item.id}` : undefined} title={reason || blocked || undefined} onClick={()=>setSelected(item.id)}>
                  <span className="campaign-shop-item-name">{item.name}<small>{item.category}</small></span>
                  <span className="campaign-shop-item-price">{item.price} zk<small>{reason ? "Sprawdź ograniczenia" : tag}</small>{!reason && blocked && <small className="campaign-shop-item-why" id={`why-${item.id}`}>{blocked}</small>}</span>
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
