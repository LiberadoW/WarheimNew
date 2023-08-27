import React, { useEffect, useState } from "react";
import ArmyListErrors from "./ArmyListErrors";
import armies from "../Data.js/Armies";
import "../styles/ArmyInfo.css";
import getErrors from "../Functions/getErrors";
import getModelAmount from "../Functions/getModelAmount";

const ArmyInfo = ({
  totalCost,
  prestige,
  army,
  unitList,
  setArmyName,
  armyName,
  errors,
  setErrors,
  isCustomArmyCost,
  customArmyCost,
  theme,
}) => {
  const [clicked, setClicked] = useState(false);

  const handleClick = () => {
    setClicked(!clicked);
  };

  if (army.armyRules.includes("Zamożność")) {
    customArmyCost = 1.2 * customArmyCost;
  }

  const modelAmount = getModelAmount(unitList, army);

  const limit = isCustomArmyCost ? customArmyCost : army.limit;

  useEffect(() => {
    setErrors(getErrors(army, totalCost, modelAmount, unitList, limit));
  }, [army, totalCost, modelAmount, unitList]);

  const handleArmyNameChange = (e) => {
    setArmyName(e.target.value);
  };

  return (
    <div className="army-info-alerts-container">
      <div className="army-info-container">
        <div className="army-info-left">
          {errors > 0 && (
            <p className="alerts" onClick={handleClick}>
              {clicked ? (
                <i className="fa-solid fa-caret-down fa-xl"></i>
              ) : (
                <i className="fa-solid fa-caret-right fa-xl"></i>
              )}
              <span>
                <i className="fa-solid fa-triangle-exclamation"></i> Liczba
                błędów: {errors}{" "}
              </span>
            </p>
          )}
        </div>
        <div className="army-info-right">
          <p className="army-name-input">
            <span>Nazwa kompanii:</span>{" "}
            <input
              onChange={handleArmyNameChange}
              type="text"
              value={armyName}
            />
          </p>
          <p className="prestige">
            <span className="bold">Prestiż:</span> {prestige}
          </p>
          <p
            className="total-cost"
            style={{
              color:
                totalCost > limit
                  ? "red"
                  : theme === "dark"
                  ? "#f2f2f2"
                  : "black",
            }}
          >
            <span className="bold">Suma:</span> {`${totalCost} / ${limit} zk`}
          </p>
          <p></p>
        </div>
      </div>
      {clicked && (
        <ArmyListErrors
          army={army}
          unitList={unitList}
          totalCost={totalCost}
          limit={limit}
        />
      )}
    </div>
  );
};

export default ArmyInfo;
