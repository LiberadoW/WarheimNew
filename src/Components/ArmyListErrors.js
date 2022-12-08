import React from "react";
import "../styles/ArmyListErrors.css";
import isGeneral from "../Functions/isGeneral";
import getModelAmount from "../Functions/getModelAmount";
import { getValueOfOptionalEquipment } from "../Functions/getValueOfOptionalEquipment";

const ArmyListErrors = ({ army, unitList, totalCost }) => {
  const modelAmount = getModelAmount(unitList, army);

  return (
    <div className="army-list-errors">
      {totalCost > army.limit && (
        <p className="bold">
          <i className="fa-solid fa-triangle-exclamation"></i> Przekroczono
          liczbę złotych koron.
        </p>
      )}

      {!isGeneral(unitList) && (
        <p className="bold">
          {" "}
          <i className="fa-solid fa-triangle-exclamation"></i> Banda musi
          posiadać dowódcę.
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

      {(army.armyRules.includes("Zamożność") && totalCost > 500) && (getValueOfOptionalEquipment(unitList) < totalCost - 500 ) && (
        <p className="bold"><i className="fa-solid fa-triangle-exclamation"> {" "} </i> Dodatkowe 100 zk z zasady "Zamożność" musi być przeznaczone na zakup ekwipunku.</p>
      )}



      {unitList.map((item) => {
        const startingWeaponsOptions = Object.entries(
          item.equipmentList
        ).filter(([key, value]) => value[2] === "Startowy");

        if (startingWeaponsOptions.length > 0) {
          const intersection = item.optionalEquipment.filter((element) =>
            startingWeaponsOptions.flat().includes(element)
          );

          if (intersection.length < 1) {
            return (
              <p className="bold">
                <i className="fa-solid fa-triangle-exclamation"></i>{" "}
                {`${
                  item.unitName
                } musi posiadać przynajmniej 1 wybór z listy startowych broni: ${startingWeaponsOptions
                  .map((item) => item[0])
                  .join(", ")}.`}
              </p>
            );
          }
        }
      })}
    </div>
  );
};

export default ArmyListErrors;
