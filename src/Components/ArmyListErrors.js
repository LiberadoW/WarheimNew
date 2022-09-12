import React from "react";
import { armies } from "../layouts/Builder";
import "../styles/ArmyListErrors.css";
import isGeneral from "../Functions/isGeneral";
import getModelAmount from "../Functions/getModelAmount";

const ArmyListErrors = ({ army, unitList, totalCost }) => {
  const modelAmount = getModelAmount(unitList, army);

  return (
    <div className="army-list-errors">
      {totalCost > armies[army].limit && (
        <p className="bold">
          <i class="fa-solid fa-triangle-exclamation"></i> Przekroczono liczbę
          złotych koron.
        </p>
      )}

      {!isGeneral(unitList) && (
        <p className="bold">
          {" "}
          <i class="fa-solid fa-triangle-exclamation"></i> Banda musi posiadać
          dowódcę.
        </p>
      )}

      {modelAmount < armies[army].minModels && (
        <p className="bold">
          {" "}
          <i class="fa-solid fa-triangle-exclamation"></i>{" "}
          {`Banda musi składać się z przynajmniej ${armies[army].minModels} modeli.`}
        </p>
      )}

      {modelAmount > armies[army].maxModels && (
        <p className="bold">
          {" "}
          <i class="fa-solid fa-triangle-exclamation"></i>{" "}
          {`Banda musi składać się z maksymalnie ${armies[army].maxModels} modeli.`}
        </p>
      )}
    </div>
  );
};

export default ArmyListErrors;
