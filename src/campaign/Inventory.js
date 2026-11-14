import React, { useState } from "react";
import * as R from "./rules";

function Inventory({ post, update, army }) {
  const [id, setId] = useState(post.units[0]?.uniqueId || "");
  const [name, setName] = useState("");
  const [reason, setReason] = useState("");
  const unit = post.units.find((u) => u.uniqueId === id);
  const [using, setUsing] = useState("");
  const [useReason, setUseReason] = useState("");
  return (
    <>
      <label>
        Postać
        <select value={id} onChange={(e) => setId(e.target.value)}>
          {post.units
            .filter((u) => !u.campaignModelStatus?.every((s) => s.dead))
            .map((u) => (
              <option value={u.uniqueId} key={u.uniqueId}>
                {R.label(u)}
              </option>
            ))}
        </select>
      </label>
      <h3>Skarbiec ekwipunku</h3>
      <p className="campaign-muted">
        Wybierz postać powyżej i kliknij <strong>Przydziel</strong> przy przedmiocie, żeby go jej dać. Grupa
        stronników potrzebuje kompletu: po jednej sztuce dla każdego żyjącego modelu. Co zostanie w skarbcu,
        przechodzi do następnej sekwencji. <strong>Usuń bez zwrotu</strong> jest dla przedmiotów zużytych lub
        utraconych; żeby dostać złoto, sprzedaj przedmiot w kroku Handel (połowa ceny).
      </p>
      {post.inventory.length ? (
        <ul className="campaign-stash">
          {post.inventory.map((item) => {
            const definition = R.catalog.find((x) => x.id === item.catalogId);
            const permission = definition
              ? R.equipmentPermission(unit, definition, army.name)
              : Object.keys(unit?.equipmentList || {}).some(
                    (n) => R.baseName(n) === R.baseName(item.name),
                  )
                ? null
                : "Sprawdź możliwość użycia tego znaleziska.";
            // A group needs one per living model (the dead keep nothing).
            const living = unit
              ? R.modelCount(unit) - (unit.campaignModelStatus || []).filter((s) => s.dead).length
              : 0;
            const short = unit && item.quantity < living;
            return (
              <li key={item.id}>
                <div className="campaign-stash-row">
                  <div className="campaign-stash-name">
                    <strong>{item.name}</strong>
                    <small>
                      ×{item.quantity}
                      {permission
                        ? ` · ${permission}`
                        : short
                          ? ` · za mało dla ${living} modeli`
                          : ""}
                    </small>
                  </div>
                  <button
                    className="button"
                    disabled={!unit || !!permission || short}
                    onClick={() =>
                      update((p) => {
                        R.equipStoredItem(p, id, item.id, army.name);
                      })
                    }
                  >
                    Przydziel
                  </button>
                  <button
                    type="button"
                    className="button button-ghost campaign-link-button"
                    aria-expanded={using === item.id}
                    onClick={() => {
                      setUsing(using === item.id ? "" : item.id);
                      setUseReason("");
                    }}
                  >
                    Usuń bez zwrotu
                  </button>
                </div>
                {using === item.id && (
                  <div className="campaign-stash-use">
                    <label>
                      Powód (zużyty, zgubiony, zniszczony…)
                      <input
                        value={useReason}
                        onChange={(e) => setUseReason(e.target.value)}
                      />
                    </label>
                    <button
                      className="button button-secondary"
                      disabled={!useReason.trim()}
                      onClick={() => {
                        update((p) => {
                          const stored = p.inventory.find((i) => i.id === item.id);
                          if (!stored || stored.quantity < 1)
                            throw Error("Brak przedmiotu.");
                          stored.quantity--;
                          p.usedItems = [
                            ...(p.usedItems || []),
                            { id: R.uid(), item: { ...stored, quantity: 1 }, reason: useReason },
                          ];
                          p.inventory = p.inventory.filter((i) => i.quantity > 0);
                          R.log(
                            p,
                            "item-use",
                            `${item.name}: zużyto / utracono jedną sztukę. ${useReason}`,
                          );
                        });
                        setUsing("");
                      }}
                    >
                      Usuń jedną sztukę bez zwrotu złota
                    </button>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="campaign-muted">Skarbiec ekwipunku jest pusty.</p>
      )}
      {(post.usedItems || []).length > 0 && (
        <div className="campaign-joined">
          <p>Usunięte w tej sekwencji:</p>
          <ul>
            {post.usedItems.map((u) => (
              <li key={u.id}>
                {u.item.name} · {u.reason}{" "}
                <button
                  type="button"
                  className="button button-ghost button-small"
                  onClick={() =>
                    update((p) => {
                      const used = (p.usedItems || []).find((x) => x.id === u.id);
                      if (!used) return;
                      const { id: _id, quantity: _q, name, ...extra } = used.item;
                      R.storeItem(p, name, 1, extra);
                      p.usedItems = p.usedItems.filter((x) => x !== used);
                      R.log(p, "item-use", `${name}: przywrócono do skarbca.`);
                    })
                  }
                >
                  Przywróć
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      {unit && (
        <details className="campaign-card">
          <summary>Przenieś ekwipunek postaci do skarbca</summary>
          {[
            "startingEquipment",
            "optionalEquipment",
            "customEquipment",
          ].flatMap((field) =>
            (unit[field] || []).map((entry, index) => (
              <div className="campaign-row" key={`${field}:${index}`}>
                <span>{typeof entry === "string" ? entry : entry.name}</span>
                <button
                  className="button button-secondary"
                  onClick={() =>
                    update((p) => R.unequipItem(p, id, field, index))
                  }
                >
                  Do skarbca
                </button>
              </div>
            )),
          )}
        </details>
      )}
      <details className="campaign-card">
        <summary>Dodaj znalezisko lub przedmiot z zasad specjalnych</summary>
        <label>
          Przedmiot
          <input value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <label>
          Źródło / wynik z tabeli
          <input value={reason} onChange={(e) => setReason(e.target.value)} />
        </label>
        <button
          className="button"
          disabled={!name.trim() || !reason.trim()}
          onClick={() => {
            update((p) => {
              R.storeItem(p, name.trim());
              R.log(p, "found-item", `${name}: ${reason}`);
            });
            setName("");
          }}
        >
          Dodaj do skarbca
        </button>
      </details>
    </>
  );
}

export default Inventory;
