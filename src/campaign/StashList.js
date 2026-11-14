import React from "react";

// Items kept in the company's stash between skirmishes (the sequence after
// the skirmish stores them in campaignNotes.campaign.inventory).
export const stashItems = (notes) =>
  (notes?.campaign?.inventory || []).filter((i) => i && Number(i.quantity) > 0);

export default function StashList({ notes, title = "Przedmioty w skarbcu", className = "" }) {
  const items = stashItems(notes);
  return (
    <div className={`stash-list ${className}`.trim()}>
      <span className="bold">{title}</span>
      {items.length ? (
        <ul>
          {items.map((i) => (
            <li key={i.id || i.name}>
              {i.name}
              {Number(i.quantity) > 1 ? ` ×${i.quantity}` : ""}
            </li>
          ))}
        </ul>
      ) : (
        <p className="stash-list-empty">brak</p>
      )}
    </div>
  );
}
