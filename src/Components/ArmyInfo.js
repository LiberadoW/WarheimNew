import React, { useEffect, useState, useContext } from "react";
import ArmyListErrors from "./ArmyListErrors";
import armies from "../Data.js/Armies";
import "../styles/ArmyInfo.css";
import getErrors from "../Functions/getErrors";
import getModelAmount from "../Functions/getModelAmount";
import { EditArmyContext } from "../layouts/App";

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
  const { isEditArmyView } = useContext(EditArmyContext);

  const handleClick = () => {
    setClicked(!clicked);
  };

  if (army.armyRules.includes("Zamożność")) {
    customArmyCost = 1.2 * customArmyCost;
  }

  const modelAmount = getModelAmount(unitList, army);

  const limit = isCustomArmyCost ? customArmyCost : army.limit;

  useEffect(() => {
    if (isEditArmyView) {
      setErrors(0);
      return;
    } else {
      setErrors(getErrors(army, totalCost, modelAmount, unitList, limit));
      return;
    }
  }, [army, totalCost, modelAmount, unitList, isEditArmyView, limit]);

  const handleArmyNameChange = (e) => {
    setArmyName(e.target.value);
  };

  const isOverCost = !isEditArmyView && totalCost > limit;
  const isOverModels = !isEditArmyView && modelAmount > army.maxModels;

  return (
    <div className="army-info-alerts-container">
      <div className="army-info-container">
        <label className="army-name-input header-field">
          <span className="header-field-label">Nazwa kompanii</span>
          <input
            onChange={handleArmyNameChange}
            type="text"
            value={armyName}
            placeholder="Nazwij kompanię…"
          />
        </label>
        <div className="army-info-right">
          <div className="army-metric">
            <span className="army-metric-label">Prestiż</span>
            <span className="army-metric-value">{prestige}</span>
          </div>
          {!isEditArmyView && (
            <div className={`army-metric${isOverCost ? " is-over" : ""}`}>
              <span className="army-metric-label">Złote korony</span>
              <span className="army-metric-value">
                {totalCost}
                <span className="army-metric-limit">{` / ${limit}`}</span>
              </span>
            </div>
          )}
          <div className={`army-metric${isOverModels ? " is-over" : ""}`}>
            <span className="army-metric-label">Modele</span>
            <span className="army-metric-value">
              {modelAmount}
              {!isEditArmyView && (
                <span className="army-metric-limit">{` / ${army.maxModels}`}</span>
              )}
            </span>
          </div>
        </div>
        <div className="army-info-left">
          {errors > 0 && (
            <button
              type="button"
              className="alerts"
              onClick={handleClick}
              aria-expanded={clicked}
            >
              <i className="fa-solid fa-triangle-exclamation"></i>
              {`Błędy: ${errors}`}
              <i
                className={`fa-solid ${
                  clicked ? "fa-chevron-up" : "fa-chevron-down"
                } alerts-chevron`}
              ></i>
            </button>
          )}
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
