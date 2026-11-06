import React, { useState } from "react";
import * as R from "./rules";

function Inventory({ post, update, army }) {
  const [id, setId] = useState(post.units[0]?.uniqueId || "");
  const [name, setName] = useState("");
  const [reason, setReason] = useState("");
  const unit = post.units.find((u) => u.uniqueId === id);
  return (
    <>
      <label>
        Odbiorca
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
        post.inventory.map((item) => {
          const definition = R.catalog.find((x) => x.id === item.catalogId);
          const permission = definition
            ? R.equipmentPermission(unit, definition, army.name)
            : Object.keys(unit?.equipmentList || {}).some(
                  (n) => R.baseName(n) === R.baseName(item.name),
                )
              ? null
              : "Sprawdź możliwość użycia tego znaleziska.";
          return (
            <div className="campaign-card" key={item.id}>
              <strong>
                {item.name} ×{item.quantity}
              </strong>
              <p>{permission}</p>
              <button
                className="button"
                disabled={
                  !unit || !!permission || item.quantity < R.modelCount(unit)
                }
                onClick={() =>
                  update((p) => {
                    R.equipStoredItem(p, id, item.id, army.name);
                  })
                }
              >
                Przydziel
              </button>
            </div>
          );
        })
      ) : (
        <p>Brak przedmiotów w skarbcu.</p>
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
