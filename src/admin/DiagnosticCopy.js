import React, { useState } from "react";
import armies from "../Data.js/Armies";
import { normalizeSpecialRules } from "../Components/CampaignPoints";
import { withChaosMark } from "../Functions/chaosMark";
import RosterView from "../campaignHub/RosterView";
import CampaignManager from "../campaign/CampaignManager";
import { unpack } from "../campaign/sequenceStore";

// The campaign reference activates live event and loot-sale synchronization.
// Strip it every time a battle is loaded, including when reopening a sequence.
function localNotes(notes) {
  const active = notes.campaign?.activeBattle;
  if (!active?.campaignGame) return notes;
  const { campaignGame, lootSync, ...battle } = active;
  return { ...notes, campaign: { ...notes.campaign, activeBattle: battle } };
}

export default function DiagnosticCopy({ list, player, onClose }) {
  const [copy] = useState(() => JSON.parse(JSON.stringify({
    armyList: list.armyList,
    campaignNotes: list.campaignNotes,
    sequenceDraft: list.sequenceDraft,
  })));
  const [draft] = useState(() => unpack(copy.sequenceDraft));
  const hasDraft = Array.isArray(draft?.unitList) && !!draft?.battle;
  const [unitList, setUnitList] = useState(() =>
    hasDraft ? draft.unitList : copy.armyList || [],
  );
  const [notes, setNotes] = useState(() => localNotes({
    ...copy.campaignNotes,
    specialRules: normalizeSpecialRules(copy.campaignNotes?.specialRules),
    ...(hasDraft
      ? { campaign: { ...copy.campaignNotes?.campaign, activeBattle: draft.battle } }
      : {}),
  }));
  const setCampaignNotes = (value) =>
    setNotes((current) => localNotes(typeof value === "function" ? value(current) : value));
  const army = withChaosMark(armies[list.armyType], notes.chaosMark);

  return (
    <div className="hub-page">
      <button type="button" className="button button-secondary" onClick={onClose}>Wróć do rozpisek graczy</button>
      <h2 className="hub-title">Tryb diagnostyczny</h2>
      <p><strong>{list.armyName || "Bez nazwy"}</strong> · {player}</p>
      <p className="hub-muted">Zmiany dotyczą kopii w tej karcie. Wyjście lub odświeżenie usuwa kopię.</p>
      {copy.sequenceDraft && !hasDraft && (
        <p role="alert">Nie udało się odczytać zapisanej sekwencji. Wczytano zapisaną rozpiskę.</p>
      )}
      <details className="hub-card">
        <summary>Rozpiska kopii</summary>
        <RosterView armyList={unitList} notes={notes} title={list.armyName} />
      </details>
      {army ? (
        <CampaignManager
          unitList={unitList}
          setUnitList={setUnitList}
          army={army}
          campaignNotes={notes}
          setCampaignNotes={setCampaignNotes}
          onFinish={() => null}
        />
      ) : (
        <p role="alert">Nie rozpoznano armii {list.armyType}. Rozpiska jest dostępna do podglądu.</p>
      )}
    </div>
  );
}
