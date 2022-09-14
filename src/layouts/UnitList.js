import React from "react";
import "../styles/UnitList.css";

const UnitList = ({ unitList, setUnitList, setIdShown, idShown }) => {
  const handleDeleteClick = (e) => {
    const unitIndex = e.target.parentNode.className;
    unitList.splice(unitIndex, 1);
    const newUnitList = [...unitList];
    setUnitList(newUnitList);
  };

  const handleClickId = (e) => {
    if (e.target.className === "unit-name" ) {
      setIdShown(
        idShown != e.target.parentNode.parentNode.id
          ? e.target.parentNode.parentNode.id
          : null
      );
    } 
  };

  return unitList.map((unit, index) => {
    if (unit != null) {
      return (
        <div
          className={`unit ${index}`}
          id={index}
          style={{
            backgroundColor:
              unitList.indexOf(unit) == idShown ? "#A9A9A9" : "white",
          }}
          key={index}
        >
          <li
            key={index}
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
                      onChange={(e) => {
                        unit.selectedNumber = e.target.value;
                        unit.totalCost = unit.cost * unit.selectedNumber;
                        setUnitList([...unitList]);
                      }}
                      name="number-of-henchmen"
                    >
                      {[...Array(unit.number)].map((e, i) => {
                        return (
                          <option key={i} value={i + 1}>
                            {i + 1}
                          </option>
                        );
                      })}
                    </select>
                  </>
                ) : (
                  ""
                )}
              </span>
              <span>{`${
                unit.selectedNumber === 1 ? unit.totalCost : unit.totalCost
              } zk`}</span>
              <span className={index} onClick={handleDeleteClick}>
                <i className="fa-solid fa-trash-can"></i>
              </span>
            </p>
          </li>
        </div>
      );
    }
  });
};
export default UnitList;
