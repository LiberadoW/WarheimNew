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
            const short = unit && item.quantity < R.modelCount(unit);
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
                          ? ` · za mało dla ${R.modelCount(unit)} modeli`
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
                    Zużyj
                  </button>
                </div>
                {using === item.id && (
                  <div className="campaign-stash-use">
                    <label>
                      Powód zużycia / utraty przedmiotu
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
                      Zużyj jedną sztukę
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
