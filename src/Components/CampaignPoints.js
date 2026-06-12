import React from "react";
import "../styles/CampaignPoints.css";

const CAMPAIGN_POINT_FIELDS = [
  {
    key: "determinacja",
    label: "DETERMINACJA",
    marks: [5, 10, 15, 20, 29, 40],
  },
  {
    key: "gniew",
    label: "GNIEW",
    marks: [3, 7, 11, 19, 29, 40],
  },
  {
    key: "odpornosc",
    label: "ODPORNOŚĆ",
    marks: [6, 13, 20, 29, 40],
  },
];

const toCampaignPointValue = (value) => {
  const parsedValue = Number(value);

  if (!Number.isFinite(parsedValue) || parsedValue < 0) {
    return 0;
  }

  return Math.min(Math.floor(parsedValue), 40);
};

const normalizeSpecialRules = (rules) => {
  if (Array.isArray(rules)) {
    return rules
      .map((rule) => String(rule || "").trim())
      .filter((rule) => rule.length > 0);
  }

  if (typeof rules === "string") {
    return rules
      .split(",")
      .map((rule) => rule.trim())
      .filter((rule) => rule.length > 0);
  }

  return [];
};

export { CAMPAIGN_POINT_FIELDS, normalizeSpecialRules, toCampaignPointValue };

const CampaignPointsBoxes = ({ number, array, name, points }) => {
  return (
    <div className="campaign-points-boxes-container">
      <div className="campaing-points-boxes-name bold">{name}</div>
      <div className="campaing-points-boxes">
        {[...Array(number / 2)].map((e, i) => (
          <span className="experience-number" key={i}>
            {(i + 1) % 5 === 0 ? i + 1 : ""}
          </span>
        ))}
        {[...Array(number)].map((e, i) => (
          <span
            className={
              array.includes(i + 1) ? "experience-box-bold" : "experience-box"
            }
            style={{
              backgroundColor: i < points ? "gray" : "white",
            }}
            key={i}
          ></span>
        ))}
      </div>
    </div>
  );
};

const CampaignPoints = ({ army, campaignNotes }) => {
  const notes = campaignNotes || {};
  const campaignPointsSum = CAMPAIGN_POINT_FIELDS.reduce(
    (sum, field) => sum + toCampaignPointValue(notes[field.key]),
    0,
  );

  const armyRulesText = Array.isArray(army?.armyRules)
    ? army.armyRules.join(", ")
    : "";
  const customRulesText = normalizeSpecialRules(notes.specialRules).join(", ");
  const displayedRules = [armyRulesText, customRulesText]
    .filter((text) => text.length > 0)
    .join(", ");

  return (
    <div className="campaign-points-container">
      <div className="campaign-points-inner">
        <div className="campaign-points-title">NOTATKI</div>
        <div className="campaign-points-rules">
          <div className="campaign-points">
            <div className="bold">PUNKTY KAMPANII:</div>
            {CAMPAIGN_POINT_FIELDS.map((field) => (
              <div className="campaign-point-row" key={field.key}>
                <CampaignPointsBoxes
                  number={40}
                  array={field.marks}
                  name={field.label}
                  points={toCampaignPointValue(notes[field.key])}
                />
              </div>
            ))}
          </div>
          <div className="campaign-points-sum">
            <div className="bold">SUMA PUNKTÓW KAMPANII</div>
            <div className="campaign-points-sum-value">{campaignPointsSum}</div>
          </div>
          <div className="special-rules">
            <div className="bold">ZASADY SPECJALNE:</div>
            <div className="special-rules-text">{displayedRules}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignPoints;
