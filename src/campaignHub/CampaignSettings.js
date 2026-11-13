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
      <label className="hub-field hub-field-inline">
        <input
          type="checkbox"
          disabled={!isOrganizer}
          checked={campaign.settings?.randomEventLimit !== false}
          onChange={(e) =>
            act(
              () => updateCampaignSettings(campaign.id, { ...(campaign.settings || {}), randomEventLimit: e.target.checked }),
              e.target.checked ? "Limit: jedno zdarzenie losowe na grę." : "Bez limitu zdarzeń losowych.",
            )
          }
        />
        Zdarzenia losowe: najwyżej jedno na grę (s. 398)
      </label>
      <label className="hub-field hub-field-inline">
        <input
          type="checkbox"
          disabled={!isOrganizer}
          checked={campaign.settings?.weatherFrom === 5}
          onChange={(e) =>
            act(
              () => updateCampaignSettings(campaign.id, { ...(campaign.settings || {}), weatherFrom: e.target.checked ? 5 : 6 }),
              e.target.checked ? "Zmiana pogody na 5+." : "Zmiana pogody tylko na 6.",
            )
          }
        />
        Zdarzenia losowe: zmiana pogody na 5+ (podręcznik: tylko na 6)
      </label>
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
