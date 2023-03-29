import React from "react";
import WeaponList from "../layouts/WeaponList";
import UnitTable from "./UnitTable";
import Modal from "./Modal";

const UnitInfo = ({
  heroes,
  mercenaries,
  unitName,
  unitList,
  setUnitList,
  handleClickShow,
  handleSetUnitExp,
  idShown,
  setIdShown,
  showModal,
  setShowModal,
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
        unit.uniqueId == idShown && (
          <Modal show={showModal}  key={index} showModal={showModal} setShowModal={setShowModal} setIdShown={setIdShown}>
            <div className="side-builder-right" key={`${index}1`}>
              <div
                className={`unit ${index}`}
                id={index}
                handleClick={handleClickShow}
              >
                <div className="edit-unit-container">
                  <div className="modal-unit-info">
                      <h2>{unit.unitName}</h2>
                    <span><span className="bold-text">Koszt:</span> {`${unit.totalCost} zk`} </span>
                   
                  </div>
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
                    handleSetUnitExp={handleSetUnitExp}
                    heroes={heroes}
                    unitName={unitName}
                  />
                </div>
              </div>
            </div>
          </Modal>
        )
      );
    }
  });
};

export default UnitInfo;
