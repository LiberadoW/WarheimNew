import React, { useState } from "react";
import ScenarioPicker, { ScenarioDetails } from "../campaignHub/ScenarioPicker";
import { AREAS } from "../campaignHub/scenarios";
import "../styles/CampaignHub.css";

// Scenario of a skirmish played from the builder: rolled or picked from the
// rulebook tables (like campaign games), or typed in. A rulebook scenario also
// sets the area, which is then read from it.
export default function ScenarioField({ battle, setBattle }) {
  const [open, setOpen] = useState(!battle.scenario);
  const record = battle.scenarioRecord || (battle.scenario ? { name: battle.scenario, area: battle.area } : null);
  return (
    <div className="campaign-scenario-field">
      {battle.scenario && !open ? (
        <div className="campaign-scenario-chosen">
          <div>
            <strong>{battle.scenario}</strong>
            <small>
              {record?.special
                ? "Scenariusz specjalny"
                : [record?.code && `K66: ${record.code}`, record?.page && `s. ${record.page}`, AREAS[battle.area]]
                    .filter(Boolean)
                    .join(" · ")}
            </small>
          </div>
          <button type="button" className="button button-secondary" onClick={() => setOpen(true)}>
            Zmień scenariusz
          </button>
        </div>
      ) : (
        <ScenarioPicker
          onPick={(rec) => {
            setBattle({
              ...battle,
              scenario: rec.name,
              scenarioRecord: rec,
              area: rec.area || battle.area,
            });
            setOpen(false);
          }}
          onCancel={() => setOpen(false)}
        />
      )}
      {battle.scenario && !open && record?.key && (
        <details className="campaign-help">
          <summary>Zasady scenariusza</summary>
          <ScenarioDetails scenario={record} />
        </details>
      )}
    </div>
  );
}
