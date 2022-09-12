import React from "react";
import "../styles/CampaignPoints.css";

const CampaignPointsBoxes = ({ number, array, name }) => {
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
            key={i}
          ></span>
        ))}
      </div>
    </div>
  );
};

const CampaignPoints = ({ army }) => {
  return (
    <div className="campaign-points-container">
      <div className="campaign-points-inner">
        <div className="campaign-points-title">NOTATKI</div>
        <div className="campaign-points-rules">
          <div className="campaign-points">
            <div className="bold">PUNKTY KAMPANII:</div>
            <CampaignPointsBoxes
              number={40}
              array={[5, 10, 15, 20, 29, 40]}
              name={"DETERMINACJA"}
            />
            <CampaignPointsBoxes
              number={40}
              array={[3,7,11,19,29,40]}
              name={"GNIEW"}
            />
             <CampaignPointsBoxes
              number={40}
              array={[6,13,20,29,40]}
              name={"ODPORNOŚĆ"}
            />
          </div>
          <div className="campaign-points-sum">
            <div className="bold">SUMA PUNKTÓW KAMPANII</div>
          </div>
          <div className="special-rules">
            <div className="bold">ZASADY SPECJALNE:</div>
            <div className="special-rules-text">
              {army.armyRules.join(", ")}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignPoints;
