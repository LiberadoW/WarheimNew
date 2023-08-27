import React from "react";
import "../styles/ArmyListErrors.css";
import isGeneral from "../Functions/isGeneral";
import getModelAmount from "../Functions/getModelAmount";
import { getValueOfOptionalEquipment } from "../Functions/getValueOfOptionalEquipment";
import { getAllEquipment } from "../Functions/getAllEquipment";
import { getUnitNumbers } from "../Functions/getUnitNumbers";

const ArmyListErrors = ({ army, unitList, totalCost, limit }) => {
  const modelAmount = getModelAmount(unitList, army);

  const equipmentList = getAllEquipment(unitList);

  const oneOfItems = [
    "Harpun",
    "Ołowiomiotacz",
    "Kadzielnica zarazy",
    "Kula trującego wichru",
  ];

  const unitNumbers = getUnitNumbers(unitList);

  return (
    <div className="army-list-errors">
      {totalCost > limit && (
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

      {army.armyRules.includes("Zamożność") &&
        totalCost > limit * 0.8 &&
        getValueOfOptionalEquipment(unitList) < limit * 0.2 && (
          <p className="bold">
            <i className="fa-solid fa-triangle-exclamation"> </i> Dodatkowe 20%
            zk z zasady "Zamożność" musi być przeznaczone na zakup ekwipunku.
          </p>
        )}

      {oneOfItems.map((item, index) => {
        if (equipmentList.filter((x) => x === item).length > 1) {
          return (
            <p className="bold" key={index}>
              <i className="fa-solid fa-triangle-exclamation"> </i>{" "}
              {`Banda może posiadać maksymalnie 1 ${item}.`}
            </p>
          );
        }
      })}

      {Object.keys(unitNumbers).map((unit, index) => {
        console.log(army.heroes[unit]);
        if (unitNumbers[unit] > army.heroes[unit]?.number) {
          return (
            <p className="bold" key={index}>
              <i className="fa-solid fa-triangle-exclamation"> </i>{" "}
              {`Banda może posiadać maksymalnie ${army.heroes[unit].number} ${
                army.heroes[unit].number === 1
                  ? "jednostkę"
                  : army.heroes[unit].number > 4
                  ? "jednostek"
                  : "jednostki"
              } ${unit}.`}
            </p>
          );
        }
      })}

      {unitList.map((item, index) => {
        const startingWeaponsOptions = Object.entries(
          item.equipmentList
        ).filter(([key, value]) => value[2] === "Startowy");

        if (startingWeaponsOptions.length > 0) {
          const intersection = item.optionalEquipment.filter((element) =>
            startingWeaponsOptions.flat().includes(element)
          );

          if (intersection.length < 1) {
            return (
              <p className="bold" key={index}>
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
