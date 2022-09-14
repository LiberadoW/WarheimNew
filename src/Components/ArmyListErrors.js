import React from "react";
import "../styles/ArmyListErrors.css";
import isGeneral from "../Functions/isGeneral";
import getModelAmount from "../Functions/getModelAmount";

const ArmyListErrors = ({ army, unitList, totalCost }) => {
  const modelAmount = getModelAmount(unitList, army);

  return (
    <div className="army-list-errors">
      {totalCost > army.limit && (
        <p className="bold">
          <i className="fa-solid fa-triangle-exclamation"></i> Przekroczono liczbę
          złotych koron.
        </p>
      )}

      {!isGeneral(unitList) && (
        <p className="bold">
          {" "}
          <i className="fa-solid fa-triangle-exclamation"></i> Banda musi posiadać
          dowódcę.
        </p>
      )}

      {modelAmount < army.minModels && (
        <p className="bold">
          {" "}
          <i className="fa-solid fa-triangle-exclamation"></i>{" "}
          {`Banda musi składać się z przynajmniej ${army.minModels} modeli.`}
        </p>
      )}

      {modelAmount > army.maxModels && (
        <p className="bold">
          {" "}
          <i className="fa-solid fa-triangle-exclamation"></i>{" "}
          {`Banda musi składać się z maksymalnie ${army.maxModels} modeli.`}
        </p>
      )}
    </div>
  );
};

export default ArmyListErrors;
