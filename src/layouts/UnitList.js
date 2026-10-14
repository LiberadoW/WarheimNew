import React, { useContext, useEffect, useState } from "react";
import "../styles/UnitList.css";
import { CommandContext } from "../layouts/Builder";
import UnitInfo from "../Components/UnitInfo";
import { EditArmyContext } from "./App";

const ARRAY_OF_TYPES = ["Bohater", "Stronnik", "Machina", "Najemne Ostrze"];
const ARRAY_OF_TYPES_DISPLAY = [
  "Bohaterowie",
  "Stronnicy",
  "Machiny",
  "Najemne Ostrza",
];

const UnitList = ({
  unitList,
  setUnitList,
  setIdShown,
  idShown,
  heroes,
  handleSetUnitExp,
  army,
}) => {
  const { setStandardBearer, setMusician } = useContext(CommandContext);
  const { isPlayArmyView } = useContext(EditArmyContext);
  const [groupedUnits, setGroupedUnits] = useState([]);

  const handleDeleteClick = (unitId) => {
    const unitToDelete = unitList.find((item) => item.uniqueId === unitId);
    if (!unitToDelete) {
      return;
    }

    if (unitToDelete.optionalEquipment?.includes("Chorąży")) {
      setStandardBearer(null);
    }

    if (unitToDelete.optionalEquipment?.includes("Sygnalista")) {
      setMusician(null);
    }

    if (unitToDelete.stats?.hasOwnProperty("Aktualna")) {
      delete unitToDelete.stats.Aktualna;
    }

    if (
      unitToDelete.hasOwnProperty("newRules") &&
      heroes?.[unitToDelete.unitName]?.rules
    ) {
      heroes[unitToDelete.unitName].rules = unitToDelete.baseRules;
    }

    const newUnitList = unitList.filter((item) => item.uniqueId !== unitId);
    setUnitList(newUnitList);

    if (idShown === unitId) {
      setIdShown(null);
    }
  };

  useEffect(() => {
    const nextGroups = ARRAY_OF_TYPES.map((type) =>
      unitList
        .filter((unit) => unit.type === type)
        .sort((a, b) => a.id - b.id)
    );
    setGroupedUnits(nextGroups);
  }, [unitList]);

  const handleChange = (unitId, value) => {
    const unit = unitList.find((item) => item.uniqueId === unitId);
    if (!unit) {
      return;
    }

    unit.selectedNumber = value;
    unit.totalCost = unit.cost * value;
    setUnitList([...unitList]);
  };

  return groupedUnits.map((unitsOfType, groupIndex) => (
    <React.Fragment key={`group-${ARRAY_OF_TYPES[groupIndex]}`}>
      {unitsOfType.length !== 0 && (
        <h3 className="unit-list-divider">{ARRAY_OF_TYPES_DISPLAY[groupIndex]}<span>{unitsOfType.length}</span></h3>
      )}
      {unitsOfType.map((unit, unitIndex) => {
        const unitGlobalIndex = unitList.findIndex(
          (item) => item.uniqueId === unit.uniqueId
        );

        return (
          <React.Fragment key={unit.uniqueId}>
            <div className={`unit roster-unit ${idShown === unit.uniqueId ? "is-expanded" : ""} ${unitIndex} ${unit.type}`} id={unit.uniqueId}>
              <div className={`unit-info-container ${unitIndex}`}>
                <button className="unit-name" aria-expanded={idShown === unit.uniqueId} aria-label={`${unit.unitName} — ekwipunek i szczegóły`} onClick={() => setIdShown(idShown === unit.uniqueId ? null : unit.uniqueId)}>
                  <span className="unit-initial" aria-hidden="true">{unit.unitName.charAt(0)}</span>
                  <span className="unit-label"><strong>{unit.unitDisplayName || unit.unitName}</strong><small>{unit.unitDisplayName ? unit.unitName : unit.type} · {unit.exp || 0} PD</small></span>
                  <span className="unit-chevron" aria-hidden="true">{idShown === unit.uniqueId ? "−" : "+"}</span>
                </button>
                <div className="unit-info">
                  <span className="number-of-henchmen">
                    {unit.type === "Stronnik" || unit.type === "Machina" ? (
                      <>
                        <span>Liczba:</span>
                        {isPlayArmyView ? (
                          <span>{unit.selectedNumber}</span>
                        ) : (
                          <select
                            onChange={(e) =>
                              handleChange(unit.uniqueId, Number(e.target.value))
                            }
                            name="number-of-henchmen"
                            aria-label={`Liczba modeli: ${unit.unitName}`}
                            value={unit.selectedNumber}
                          >
                            {unit.unitName === "Duże Dżgacze" ||
                            unit.unitName === "Drużyna ciężkich broni" ? (
                              <option value={2}>2</option>
                            ) : (
                              [...Array(Math.min(unit.number, 5))].map((_, i) => (
                                <option key={i} value={i + 1}>
                                  {i + 1}
                                </option>
                              ))
                            )}
                          </select>
                        )}
                      </>
                    ) : (
                      ""
                    )}
                  </span>
                  <span>{`${unit.totalCost} zk`}</span>
                  {!isPlayArmyView && (
                    <button className="remove-unit" aria-label={`Usuń: ${unit.unitName}`} onClick={() => handleDeleteClick(unit.uniqueId)}><i className="fa-solid fa-trash-can" aria-hidden="true"></i></button>
                  )}
                </div>
              </div>
            </div>
            {idShown === unit.uniqueId && unitGlobalIndex !== -1 && (
              <UnitInfo
                heroes={heroes}
                unit={unit}
                unitIndex={unitGlobalIndex}
                unitList={unitList}
                setUnitList={setUnitList}
                handleSetUnitExp={handleSetUnitExp}
                army={army}
              />
            )}
          </React.Fragment>
        );
      })}
    </React.Fragment>
  ));
};

export default UnitList;
