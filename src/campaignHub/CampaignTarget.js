import React, { useState } from "react";

// A band being created for a campaign: the campaign page sends the player to
// the builder, and the builder offers to save the band and upload it there.
const KEY = "warheim:campaign-target";
export const readCampaignTarget = () => {
  try {
    return JSON.parse(sessionStorage.getItem(KEY)) || null;
  } catch {
    return null;
  }
};
export const setCampaignTarget = (target) => {
  try {
    if (target) sessionStorage.setItem(KEY, JSON.stringify(target));
    else sessionStorage.removeItem(KEY);
  } catch {}
};

export default function CampaignTargetBanner({ target, onSaveAndUpload, onCancel }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  return (
    <section className="campaign-target" aria-label="Banda do kampanii">
      <div>
        <strong>Tworzysz bandę do kampanii „{target.name}”</strong>
        <small>Dodaj modele i nazwij kompanię, a potem zapisz ją i wgraj do kampanii jednym przyciskiem.</small>
        {error && <small className="campaign-target-error" role="alert">{error}</small>}
      </div>
      <div className="campaign-target-actions">
        <button
          type="button"
          className="button"
          disabled={busy}
          onClick={async () => {
            setBusy(true);
            setError("");
            try {
              await onSaveAndUpload();
            } catch (e) {
              setError(e.message || "Nie udało się wgrać bandy.");
            } finally {
              setBusy(false);
            }
          }}
        >
          Zapisz i wgraj do kampanii
        </button>
        <button type="button" className="button button-secondary" onClick={onCancel}>
          Nie teraz
        </button>
      </div>
    </section>
  );
}
