import React, { useState } from "react";
import OptionalRulesPicker, { OptionalRuleChips } from "./OptionalRulesPicker";
import { updateCampaignSettings } from "./campaignService";

// Campaign-wide default optional rules; each new game starts with them and
// its two players can still change them for that game.
const CampaignSettings = ({ campaign, isOrganizer, act }) => {
  const current = campaign.settings?.optionalRules || [];
  const [editing, setEditing] = useState(false);
  const [rules, setRules] = useState(current);

  return (
    <section className="hub-card">
      <div className="hub-card-head">
        <h3>Zasady opcjonalne kampanii</h3>
        {isOrganizer && !editing && (
          <button
            type="button"
            className="button button-secondary button-small"
            onClick={() => {
              setRules(current);
              setEditing(true);
            }}
          >
            Zmień
          </button>
        )}
      </div>
      <p className="hub-muted">
        Domyślne zasady dla nowych gier (rozdział 12). Gracze danej gry mogą je zmienić przed potyczką.
      </p>
      {editing ? (
        <>
          <OptionalRulesPicker value={rules} onChange={setRules} />
          <div className="hub-actions">
            <button
              type="button"
              className="button"
              onClick={() =>
                act(
                  () => updateCampaignSettings(campaign.id, { ...(campaign.settings || {}), optionalRules: rules }),
                  "Zapisano zasady opcjonalne kampanii.",
                ).then((ok) => ok && setEditing(false))
              }
            >
              Zapisz
            </button>
            <button type="button" className="button button-ghost" onClick={() => setEditing(false)}>
              Anuluj
            </button>
          </div>
        </>
      ) : (
        <OptionalRuleChips keys={current} />
      )}
    </section>
  );
};

export default CampaignSettings;
