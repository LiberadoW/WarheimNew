import React, { useEffect, useState, useContext } from "react";
import ArmyListErrors from "./ArmyListErrors";
import "../styles/ArmyInfo.css";
import { getErrorMessages } from "../Functions/getErrors";
import getModelAmount from "../Functions/getModelAmount";
import { EditArmyContext } from "../layouts/App";

// "1 błąd", "2 błędy", "5 błędów", "22 błędy"
export const formatErrorCount = (count) => {
  const lastDigit = count % 10;
  const lastTwo = count % 100;
  if (count === 1) return "1 błąd";
  if (lastDigit >= 2 && lastDigit <= 4 && (lastTwo < 12 || lastTwo > 14)) {
    return `${count} błędy`;
  }
  return `${count} błędów`;
};

const Metric = ({ label, value, limit, isOver, overLabel }) => (
  <div className={`army-metric${isOver ? " is-over" : ""}`}>
    <span className="army-metric-label">{label}</span>
    <span className="army-metric-value">
      {value}
      {limit !== undefined && <span className="army-metric-limit">{` / ${limit}`}</span>}
    </span>
    {isOver && (
      <span className="army-metric-warning">
        <i className="fa-solid fa-triangle-exclamation" aria-hidden="true"></i>
        {overLabel}
      </span>
    )}
  </div>
);

// The summary strip under the header: gold, models, prestige and the
// validation status, which opens the list of problems.
const ArmyInfo = ({
  totalCost,
  prestige,
  army,
  unitList,
  errors,
  setErrors,
  isCustomArmyCost,
  customArmyCost,
  onSelectUnit,
}) => {
  const [isErrorListOpen, setIsErrorListOpen] = useState(false);
  const { isEditArmyView } = useContext(EditArmyContext);

  let customLimit = Number(customArmyCost) || 0;
  if (army.armyRules.includes("Zamożność")) {
    customLimit = 1.2 * customLimit;
  }

  const modelAmount = getModelAmount(unitList, army);
  const limit = isCustomArmyCost ? customLimit : army.limit;

  const errorMessages = isEditArmyView
    ? []
    : getErrorMessages(army, totalCost, modelAmount, unitList, limit);

  useEffect(() => {
    setErrors(errorMessages.length);
  });

  useEffect(() => {
    if (errors === 0) {
      setIsErrorListOpen(false);
    }
  }, [errors]);

  const isOverCost = !isEditArmyView && totalCost > limit;
  const isOverModels = !isEditArmyView && modelAmount > army.maxModels;

  const handleSelectMessage = (uniqueId) => {
    onSelectUnit?.(uniqueId);
  };

  return (
    <div className="army-summary">
      <div className="army-summary-metrics">
        {!isEditArmyView && (
          <Metric
            label="Złote korony"
            value={totalCost}
            limit={limit}
            isOver={isOverCost}
            overLabel="ponad limit"
          />
        )}
        <Metric
          label="Modele"
          value={modelAmount}
          limit={isEditArmyView ? undefined : army.maxModels}
          isOver={isOverModels}
          overLabel="za dużo"
        />
        <Metric label="Prestiż" value={prestige} />
      </div>

      {errorMessages.length > 0 && (
        <button
          type="button"
          className="army-errors-toggle"
          onClick={() => setIsErrorListOpen(!isErrorListOpen)}
          aria-expanded={isErrorListOpen}
          aria-controls="army-error-list"
        >
          <i className="fa-solid fa-triangle-exclamation" aria-hidden="true"></i>
          {formatErrorCount(errorMessages.length)}
          <span className="army-errors-toggle-action">
            · {isErrorListOpen ? "Ukryj" : "Sprawdź"}
          </span>
        </button>
      )}

      {isErrorListOpen && errorMessages.length > 0 && (
        <ArmyListErrors messages={errorMessages} onSelect={handleSelectMessage} />
      )}
    </div>
  );
};

export default ArmyInfo;
