import React, { useState } from "react";
import * as R from "./rules";
import DiceInput from "./DiceInput";
import { taxDice } from "./trading";
import {
  MERCHANT_POTIONS,
  addMerchantPotion,
  buyFromMerchant,
  merchantOffer,
  merchantQuote,
  setMerchantStock,
} from "./merchant";

const half = (item) => {
  const count = R.priceDiceCount(item.price);
  return count ? `½ × (${item.price}) zk` : `${Math.ceil(Number(item.price) / 2)} zk`;
};

// WĘDROWNY HANDLARZ (zdarzenie 46): the winner buys at half price, K3 of each.
export default function MerchantCard({ post, update }) {
  const [drafts, setDrafts] = useState({});
  const [potion, setPotion] = useState("");
  const offer = merchantOffer(post);
  const stock = post.merchant?.stock || {};
  const unrolled = offer.filter((o) => stock[o.key] == null);
  const draft = (key) => drafts[key] || { price: [], tax: [] };
  const setDraft = (key, patch) => setDrafts({ ...drafts, [key]: { ...draft(key), ...patch } });
  return (
    <section className="campaign-card campaign-merchant" aria-label="Wędrowny handlarz">
      <h3>Wędrowny handlarz (zdarzenie losowe 46)</h3>
      <p className="campaign-muted">
        Zwycięska kompania kupuje te przedmioty za połowę ceny z rozdziału 14, bez rzutu na dostępność. Handlarz ma
        K3 sztuk każdego. Zakupy trafiają do skarbca; rozdzielisz je w kroku Podział ekwipunku.
      </p>
      {unrolled.length > 1 && (
        <div className="campaign-bulk">
          <span>{unrolled.length} przedmiotów bez ustalonego zapasu.</span>
          <button
            type="button"
            className="button button-secondary"
            onClick={() => update((p) => unrolled.forEach((o) => setMerchantStock(p, o.key, R.roll(1)[0])))}
          >
            <i className="fa-solid fa-dice" aria-hidden="true"></i> Rzuć zapasy (K3)
          </button>
        </div>
      )}
      <ul className="campaign-merchant-list">
        {offer.map(({ key, label, item }) => {
          const d = draft(key);
          const priceCount = R.priceDiceCount(item.price);
          let quote = null;
          try {
            quote = merchantQuote(post, item, d.price, d.tax);
          } catch {
            quote = null;
          }
          const taxes = priceCount
            ? R.validDice(d.price, priceCount)
              ? taxDice(post, R.priceRoll(item.price, d.price).price)
              : 0
            : taxDice(post, Number(item.price));
          return (
            <li key={key}>
              <div className="campaign-merchant-head">
                <strong>{label}</strong>
                <span className="campaign-muted">{half(item)}</span>
                <span className="campaign-muted">
                  {stock[key] == null ? "zapas: ?" : `zapas: ${stock[key]}`}
                </span>
              </div>
              {stock[key] == null ? (
                <DiceInput
                  label={`Zapas: ${label} (K3)`}
                  count={1}
                  value={[]}
                  onChange={(v) => R.validDice(v, 1) && update((p) => setMerchantStock(p, key, v[0]))}
                />
              ) : stock[key] > 0 ? (
                <div className="campaign-row">
                  {priceCount > 0 && (
                    <DiceInput label={`Cena: ${label}`} count={priceCount} value={d.price} onChange={(v) => setDraft(key, { price: v })} />
                  )}
                  {taxes > 0 && (
                    <DiceInput label={`Podatek: ${label}`} count={taxes} value={d.tax} onChange={(v) => setDraft(key, { tax: v })} />
                  )}
                  <button
                    type="button"
                    className="button button-small"
                    disabled={!quote || quote.price > post.treasury}
                    onClick={() => {
                      update((p) => buyFromMerchant(p, key, { priceDice: d.price, taxRoll: d.tax }));
                      setDraft(key, { price: [], tax: [] });
                    }}
                  >
                    {quote ? `Kup za ${quote.price} zk` : "Kup"}
                  </button>
                </div>
              ) : (
                <p className="campaign-muted">Wyprzedane.</p>
              )}
            </li>
          );
        })}
      </ul>
      <label className="campaign-merchant-potion">
        Trucizna albo mikstura od handlarza
        <span className="campaign-row">
          <select value={potion} onChange={(e) => setPotion(e.target.value)}>
            <option value="">Wybierz</option>
            {MERCHANT_POTIONS.filter((i) => !(post.merchant?.potions || []).includes(i.id)).map((i) => (
              <option key={i.id} value={i.id}>
                {i.name} · {i.price} zk
              </option>
            ))}
          </select>
          <button
            type="button"
            className="button button-secondary button-small"
            disabled={!potion}
            onClick={() => {
              update((p) => addMerchantPotion(p, potion));
              setPotion("");
            }}
          >
            Dodaj do oferty
          </button>
        </span>
      </label>
    </section>
  );
}
