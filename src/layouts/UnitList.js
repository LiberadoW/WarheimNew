import React, { useEffect, useState, useContext } from "react";
import "../styles/UnitList.css";
import { CommandContext } from "../layouts/Builder";

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
  setShowModal,
}) => {
  const { standardBearer, setStandardBearer, musician, setMusician } =
    useContext(CommandContext);

  const handleDeleteClick = (e) => {
    const unitIndex = e.target.parentNode.parentNode.parentNode.parentNode.id;
    const element = unitList.filter((item) => item.uniqueId == unitIndex);

    if (element[0].optionalEquipment.includes("Chorąży")) {
      setStandardBearer(null);
    }

    if (element[0].optionalEquipment.includes("Sygnalista")) {
      setMusician(null);
    }

    const index = unitList.indexOf(element[0]);
    unitList.splice(index, 1);
    const newUnitList = [...unitList];
    setUnitList(newUnitList);
  };

  const [arrayToDisplay, setArrayToDisplay] = useState([]);

  useEffect(() => {
    const arr = [];
    ARRAY_OF_TYPES.forEach((type) => {
      const filteredArray = unitList.filter((x) => x.type === type);
      const sortedArray = filteredArray.sort((a, b) => a.id - b.id);
      arr.push(sortedArray);
    });
    setArrayToDisplay(arr);
  }, [unitList]);

  const handleClickId = (e) => {
    if (e.target.className === "unit-name") {
      setIdShown(
        idShown != e.target.parentNode.parentNode.id
          ? e.target.parentNode.parentNode.id
          : null
      );
      setShowModal(true);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    const value = e.target.value;
    const id = e.target.parentNode.parentNode.parentNode.parentNode.id;
    const unit = unitList.filter((x) => x.uniqueId == id);
    unit[0].selectedNumber = value;
    unit[0].totalCost = unit[0].cost * value;
    const newUnitList = [...unitList];
    setUnitList(newUnitList);
  };

  return arrayToDisplay.map((unitList, index) => {
    return (
      <>
        {unitList.length !== 0 && (
          <h3 className="unit-list-divider" key={`${index} 1`}>
            {ARRAY_OF_TYPES_DISPLAY[index]}
          </h3>
        )}
        {unitList.length !== 0 &&
          unitList.map((unit, index) => {
            return (
              <div
                className={`unit ${index} ${unit.type}`}
                id={unit.uniqueId}
                key={unit.uniqueId}
              >
                <li
                  className={`unit-info-container ${index}`}
                  onClick={handleClickId}
                >
                  <span className="unit-name">{unit.unitName} </span>
                  <p className="unit-info">
                    <span className="number-of-henchmen">
                      {unit.type === "Stronnik" || unit.type === "Machina" ? (
                        <>
                          <span>Liczba:</span>
                          <select
                            onChange={handleChange}
                            name="number-of-henchmen"
                            value={unit.selectedNumber}
                          >
                            {unit.unitName == "Duże Dźgacze" ||
                            unit.unitName == "Drużyna ciężkich broni" ? (
                              <option value={2}>2</option>
                            ) : (
                              [...Array(unit.number)].map((e, i) => {
                                return (
                                  <option key={i} value={i + 1}>
                                    {i + 1}
                                  </option>
                                );
                              })
                            )}
                          </select>
                        </>
                      ) : (
                        ""
                      )}
                    </span>
                    <span>{`${unit.totalCost} zk`}</span>
                    <span className={index} onClick={handleDeleteClick}>
                      <i className="fa-solid fa-trash-can"></i>
                    </span>
                  </p>
                </li>
              </div>
            );
          })}
      </>
    );
  });
};
export default UnitList;
