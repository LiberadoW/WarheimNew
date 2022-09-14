import React from "react";
import WeaponList from "../layouts/WeaponList";
import UnitTable from "./UnitTable";


const UnitInfo = ({
  heroes,
  mercenaries,
  unitName,
  unitList,
  setUnitList,
  handleClickShow,
  idShown,
}) => {
  const handleOnChange = (e) => {
    const displayName = e.target.value;
    unitList[e.target.className].unitDisplayName = displayName;
    const newUnitList = [...unitList];
    setUnitList(newUnitList);
  };

  return unitList.map((unit, index) => {
    if (unit != null) {
      return (
        unitList.indexOf(unit) == idShown && (
          <div className="side-builder-right">
            <div
              className={`unit ${index}`}
              id={index}
              handleClick={handleClickShow}
              key={index}
            >
              <div className="edit-unit-container">
                <div className="unit-name-input">
                  <label htmlFor="unit-name-input">Imię: </label>
                  <input
                    className={index}
                    onChange={handleOnChange}
                    type="text"
                    id="unit-name-input"
                    placeholder={unit.unitDisplayName}
                    value={
                      unit.unitDisplayName !== unit.unitName
                        ? unit.unitDisplayName
                        : ""
                    }
                    key={index}
                  />
                </div>
                <WeaponList
                  heroes={heroes}
                  unitList={unitList}
                  unitName={unitName}
                  setUnitList={setUnitList}
                  id={index}
                  heroEquipment={
                    Object.keys(heroes).includes(unit.unitName)
                      ? heroes[unit.unitName].equipmentList
                      : mercenaries[unit.unitName].equipmentList
                  }
                  rules={
                    Object.keys(heroes).includes(unit.unitName)
                      ? heroes[unit.unitName].rules
                      : mercenaries[unit.unitName].rules
                  }
                />
                <UnitTable
                  unitList={unitList.filter(
                    (x) => unitList.indexOf(x) === index
                  )}
                  heroes={heroes}
                  unitName={unitName}
                />
              </div>
            </div>
          </div>
        )
      );
    }
  });
};

export default UnitInfo;
