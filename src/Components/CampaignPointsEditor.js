import React, { useState } from "react";
import {
  CAMPAIGN_POINT_FIELDS,
  normalizeSpecialRules,
  toCampaignPointValue,
} from "./CampaignPoints";
import "../styles/CampaignPointsEditor.css";

const toComparable = (value) => value.toLocaleLowerCase();

const CampaignPointsEditor = ({ army, campaignNotes, setCampaignNotes }) => {
  const notes = campaignNotes || {};
  const [rule, setRule] = useState("");

  const baseRules = normalizeSpecialRules(army?.armyRules);
  const addedRules = normalizeSpecialRules(notes.specialRules);
  const mergedRules = [...baseRules, ...addedRules];
  const comparableRules = mergedRules.map((item) => toComparable(item));
  const baseRulesComparable = new Set(
    baseRules.map((item) => toComparable(item)),
  );

  console.log(notes, "notes");

  const handleCampaignPointChange = (field, value) => {
    const nextValue = value === "" ? "" : toCampaignPointValue(value);

    setCampaignNotes((currentNotes) => ({
      ...currentNotes,
      [field]: nextValue,
    }));
  };

  const handleTextFieldChange = (field, value) => {
    setCampaignNotes((currentNotes) => ({
      ...currentNotes,
      [field]: value,
    }));
  };

  const updateSpecialRules = (specialRules) => {
    setCampaignNotes((currentNotes) => ({
      ...currentNotes,
      specialRules,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const normalizedRule = rule.trim();
    if (
      normalizedRule.length === 0 ||
      comparableRules.includes(toComparable(normalizedRule))
    ) {
      return;
    }

    updateSpecialRules([...addedRules, normalizedRule]);
    setRule("");
  };

  const handleDeleteRuleClick = (ruleToDelete) => {
    updateSpecialRules(
      addedRules.filter(
        (item) => toComparable(item) !== toComparable(ruleToDelete),
      ),
    );
  };

  const handleRevertClick = () => {
    updateSpecialRules([]);
  };

  return (
    <div className="campaign-notes-editor">
      <h3>Informacje o drużynie</h3>
      <div className="campaign-points-editor">
        <div className="campaign-points-editor-fields">
          {CAMPAIGN_POINT_FIELDS.map((field) => (
            <label className="campaign-points-editor-field" key={field.key}>
              <span>{field.label}</span>
              <input
                type="number"
                min="0"
                max="40"
                value={notes[field.key] ?? ""}
                onChange={(event) =>
                  handleCampaignPointChange(field.key, event.target.value)
                }
              />
            </label>
          ))}
        </div>

        <div className="campaign-points-editor-rules">
          <span className="bold">Zasady specjalne</span>
          <form
            className="campaign-points-editor-rules-form"
            onSubmit={handleSubmit}
          >
            <input
              value={rule}
              type="text"
              onChange={(event) => setRule(event.target.value)}
            />
            <button type="submit" className="button">
              Dodaj
            </button>
            <button
              type="button"
              className="button"
              onClick={handleRevertClick}
              disabled={addedRules.length === 0}
            >
              Cofnij
            </button>
          </form>
          <div className="campaign-points-editor-rules-list">
            {mergedRules.map((item) => {
              const isCoreRule = baseRulesComparable.has(toComparable(item));

              return (
                <div className="campaign-points-editor-rule" key={item}>
                  <span>{item}</span>
                  <span
                    className={`unit-edit-pill ${
                      isCoreRule
                        ? "unit-edit-pill-core"
                        : "unit-edit-pill-added"
                    }`}
                  >
                    {isCoreRule ? "początkowa" : "dodana"}
                  </span>
                  {!isCoreRule && (
                    <button
                      type="button"
                      onClick={() => handleDeleteRuleClick(item)}
                    >
                      <i className="fa-solid fa-trash-can"></i>
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="campaign-notes-textareas">
        <label className="campaign-notes-textarea-box">
          <span className="bold">Kosztowności</span>
          <textarea
            value={notes.kosztownosci || ""}
            onChange={(event) =>
              handleTextFieldChange("kosztownosci", event.target.value)
            }
          />
        </label>
        <label className="campaign-notes-textarea-box">
          <span className="bold">Skarbiec</span>
          <textarea
            value={notes.skarbiec || ""}
            onChange={(event) =>
              handleTextFieldChange("skarbiec", event.target.value)
            }
          />
        </label>
      </div>
    </div>
  );
};

export default CampaignPointsEditor;
