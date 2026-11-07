import React, { useContext } from "react";
import WeaponList from "../layouts/WeaponList";
import UnitTable from "./UnitTable";
import UnitEdit from "./UnitEdit";
import UnitPlay from "./UnitPlay";
import { EditArmyContext } from "../layouts/App";

const UnitInfo = ({
  heroes,
  campaign,
  unit,
  unitIndex,
  unitList,
  setUnitList,
  handleSetUnitExp,
  army,
}) => {
  const handleOnChange = (e) => {
    unitList[unitIndex].unitDisplayName = e.target.value;
    setUnitList([...unitList]);
  };

  const { isEditArmyView, isPlayArmyView } = useContext(EditArmyContext);

  return (
    <div className="unit unit-inline-details" id={String(unitIndex)}>
      <div className="edit-unit-container">
        <div className="modal-unit-info">
          <h2>
            {isPlayArmyView && unit.unitDisplayName
              ? unit.unitDisplayName
              : unit.unitName}
          </h2>
          <span>
            {isPlayArmyView &&
              unit.unitDisplayName &&
              unit.unitDisplayName !== unit.unitName &&
              `${unit.unitName} · `}
            <span className="bold-text">Koszt:</span> {`${unit.totalCost} zk`}
          </span>
        </div>
        {!isPlayArmyView && (
        <div className="unit-name-input">
          <label htmlFor={`unit-name-input-${unit.uniqueId}`}>Imię</label>
          <input
            className={String(unitIndex)}
            onChange={handleOnChange}
            type="text"
            id={`unit-name-input-${unit.uniqueId}`}
            placeholder={unit.unitDisplayName}
            disabled={isPlayArmyView}
            value={
              unit.unitDisplayName !== unit.unitName ? unit.unitDisplayName : ""
            }
          />
        </div>
        )}
        {isPlayArmyView ? (
          <UnitPlay
            campaign={campaign}
            unit={unit}
            unitList={unitList}
            setUnitList={setUnitList}
          />
        ) : isEditArmyView &&
          unit.type !== "Machina" &&
          !unit.rules.includes("Zwierzę") ? (
          <UnitEdit
            unitList={unitList}
            setUnitList={setUnitList}
            id={unit.uniqueId}
            heroes={heroes}
          />
        ) : (
          <WeaponList
            heroes={heroes}
            unitList={unitList}
            setUnitList={setUnitList}
            id={unitIndex}
            army={army}
          />
        )}
        {!isPlayArmyView && (
          <details className="unit-print-preview" open={!isEditArmyView}>
            <summary>Karta jednostki (podgląd druku)</summary>
            <div className="unit-print-preview-scroll">
              <UnitTable
                unitList={[unit]}
                handleSetUnitExp={handleSetUnitExp}
                heroes={heroes}
                disableExpEdit={isPlayArmyView}
              />
            </div>
          </details>
        )}
      </div>
    </div>
  );
};

export default UnitInfo;
