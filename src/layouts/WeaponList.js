import React, { useEffect, useState } from "react";
import "../styles/WeaponList.css";
import { disableButtons } from "../Functions/disableButtons";
import mageEquipmentList from "../Data.js/MageEquipmentList";

const WeaponList = ({
  heroEquipment,
  heroes,
  id,
  unitList,
  unitName,
  setUnitList,
  rules,
}) => {
  const commandGroupUnit = unitList[id];
  const findCommonElements = (arr1, arr2) => {
    const index = arr1.some((item) => arr2.includes(item));
    return index;
  };

  const [checked, setChecked] = useState(
    commandGroupUnit.commandGroup ? commandGroupUnit : ""
  );

  const [isCommandGroup, setCommandGroup] = useState(
    unitList[id].rules.includes("Chorążowie & sygnaliści")
  );

  const unitArray = Array.from(document.querySelectorAll(".unit"));

  useEffect(() => {
    const numberOfShootingWeaponsArray = [];
    const numberOfCloseCombatWeaponsArray = [];

    unitArray.forEach((item, index) => {
      const shootingWeapons = document.querySelectorAll(
        `div.unit[id='${String(index)}'] ul[class='1'] li input`
      );
      const shootingWeaponsArray = Array.from(shootingWeapons);
      const number1 = shootingWeaponsArray.filter(
        (item) => item.checked === true
      ).length;
      numberOfShootingWeaponsArray.push(number1);

      if (number1 >= 2) {
        shootingWeaponsArray.forEach((item) => {
          if (item.checked === false) {
            item.disabled = true;
          }
        });
      } else {
        shootingWeaponsArray.forEach((item) => {
          if (item.checked === false) {
            item.disabled = false;
          }
        });
      }

      const closeCombatWeapons = document.querySelectorAll(
        `div.unit[id='${String(index)}'] ul[class='0'] li input`
      );
      const closeCombatWeaponsArray = Array.from(closeCombatWeapons);
      const dagger = closeCombatWeaponsArray.find((el) => el.name == "Sztylet");
      const closeCombatWeaponsArrayWithoutDagger = [...closeCombatWeaponsArray];
      closeCombatWeaponsArrayWithoutDagger.splice(
        closeCombatWeaponsArrayWithoutDagger.indexOf(dagger),
        1
      );
      const number2 = closeCombatWeaponsArrayWithoutDagger.filter(
        (item) => item.checked === true
      ).length;
      numberOfCloseCombatWeaponsArray.push(number2);

      if (number2 >= 2) {
        closeCombatWeaponsArray.forEach((item) => {
          if (item.checked === false) {
            item.disabled = true;
          }
        });
      } else {
        closeCombatWeaponsArray.forEach((item) => {
          if (item.checked === false) {
            item.disabled = false;
          }
        });
      }
    });
  });

  useEffect(() => {
    unitArray.forEach((item, index) => {
      disableButtons("Zbroja", index);
      disableButtons("Tarcza", index);
      disableButtons("Choice", index);
      disableButtons("Tradycja", index);
    });
  });

  const handleWeaponListClick = (e) => {
    const unit = unitList[e.target.className];
    const equipmentList = unitList[e.target.className].optionalEquipment;

    if (e.target.name.includes("Tradycja")) {
      if (unit.rules.includes(e.target.name)) {
        unit.rules.splice(unit.rules.indexOf(e.target.name), 1);
      } else {
        unit.rules.push(e.target.name);
      }

      if (e.target.checked === true) {
        Object.entries(mageEquipmentList[e.target.name].equipment).forEach(
          ([key, value]) => {
            unit.equipmentList[key] = value;
          }
        );
        unit.skills = mageEquipmentList[e.target.name].skills;
      } else {
        unit.equipmentList = {
          "Tradycja Bestii": [0, 4, "Tradycja"],
          "Tradycja Cienia": [0, 4, "Tradycja"],
          "Tradycja Metalu": [0, 4, "Tradycja"],
          "Tradycja Niebios": [0, 4, "Tradycja"],
          "Tradycja Ognia": [0, 4, "Tradycja"],
          "Tradycja Śmierci": [0, 4, "Tradycja"],
          "Tradycja Światła": [0, 4, "Tradycja"],
          "Tradycja Życia": [0, 4, "Tradycja"],
        };
        unit.optionalEquipment = [];
        unit.skills = [];
      }
    } else {
      if (equipmentList.includes(e.target.name)) {
        equipmentList.splice(equipmentList.indexOf(e.target.name), 1);
      } else {
        equipmentList.push(e.target.name);
      }

      unit.cost = e.target.checked
        ? unit.cost + Number(e.target.value)
        : unit.cost - Number(e.target.value);

      if (isCommandGroup) {
        const commandGroupArray = Array.from(
          document.querySelectorAll("input[data='Dowodzenie']")
        );
        const howManyCommandChecked = commandGroupArray.filter(
          (x) => x.checked === true
        ).length;
        unit.totalCost =
          unit.cost * unit.selectedNumber + howManyCommandChecked * 20;
      } else {
        unit.totalCost = unit.cost * unit.selectedNumber;
      }
    }

    const newUnitList = [...unitList];
    setUnitList(newUnitList);
  };

  const handleWeaponListClick2 = (e) => {
    const unit = unitList[e.target.className];
    const equipmentList = unitList[e.target.className].optionalEquipment;

    if (
      equipmentList
        .concat(unitList[id].startingEquipment)
        .filter((x) => x === e.target.name).length === 2
    ) {
      equipmentList.splice(equipmentList.indexOf(e.target.name), 1);
    } else {
      equipmentList.push(e.target.name);
    }

    unit.cost = e.target.checked
      ? unit.cost + Number(e.target.value)
      : unit.cost - Number(e.target.value);

    if (isCommandGroup) {
      const commandGroupArray = Array.from(
        document.querySelectorAll("input[data='Dowodzenie']")
      );
      const howManyCommandChecked = commandGroupArray.filter(
        (x) => x.checked === true
      ).length;
      unit.totalCost =
        unit.cost * unit.selectedNumber + howManyCommandChecked * 20;
    } else {
      unit.totalCost = unit.cost * unit.selectedNumber;
    }

    const newUnitList = [...unitList];
    setUnitList(newUnitList);
  };

  const handleCommandGroupClick = (e) => {
    const commandGroupButton = document.querySelector(
      `div[id='${id}'] input[name='command-group-checkbox']`
    );

    const allCommandGroupButtonsArray = Array.from(
      document.querySelectorAll("input[name='command-group-checkbox']")
    );

    if (
      allCommandGroupButtonsArray.filter((x) => x.checked === true).length === 1
    ) {
      allCommandGroupButtonsArray
        .filter((x) => x.checked === false)
        .forEach((item) => {
          item.disabled = true;
        });
    } else {
      allCommandGroupButtonsArray.forEach((item) => (item.disabled = false));
    }

    setChecked(commandGroupButton.checked);
    const unit = unitList[e.target.className];
    unit.commandGroup = commandGroupButton.checked;
    const equipmentList = unitList[e.target.className].optionalEquipment;

    if (e.target.name != "command-group-checkbox") {
      if (equipmentList.includes(e.target.name)) {
        equipmentList.splice(equipmentList.indexOf(e.target.name), 1);
      } else {
        equipmentList.push(e.target.name);
      }
    }

    const commandGroupArray = Array.from(
      document.querySelectorAll("input[data='Dowodzenie']")
    );
    const howManyCommandChecked = commandGroupArray.filter(
      (x) => x.checked === true
    ).length;

    unit.selectedNumber = howManyCommandChecked > 0 ? howManyCommandChecked : 1;

    unit.totalCost =
      unit.cost * unit.selectedNumber + howManyCommandChecked * 20;

    if (!unit.commandGroup) {
      if (equipmentList.includes("Chorąży")) {
        equipmentList.splice(equipmentList.indexOf("Chorąży"), 1);
      }
      if (equipmentList.includes("Sygnalista")) {
        equipmentList.splice(equipmentList.indexOf("Sygnalista"), 1);
      }
      unit.selectedNumber = 1;
      unit.totalCost = unit.cost * unit.selectedNumber;
    }

    unit.number = unit.commandGroup ? 2 : heroes[unit.unitName].number;

    const newUnitList = [...unitList];
    setUnitList(newUnitList);
  };

  const equipmentTypeArr = [{}, {}, {}, {}, {}];
  const equipmentTypeNames = [
    "Broń do walki wręcz",
    "Broń dystansowa",
    "Pancerz",
    "Specjalne",
    "Kolegia magii",
  ];

  Object.keys(unitList[id].equipmentList).forEach((item) => {
    equipmentTypeArr[unitList[id].equipmentList[item][1]][item] =
      unitList[id].equipmentList[item];
  });

  return (
    <div className="equipment-list-container">
      <div className="equipment-list-name">
        {Object.keys(unitList[id].equipmentList).length === 0 ? null : (
          <h4>Lista ekiwpunku</h4>
        )}
      </div>
      <div className="equipment-list">
        {equipmentTypeArr.map((item, indexMain) => {
          if (Object.keys(item).length > 0) {
            return (
              <div className="equipment-type-list">
                <h4>{equipmentTypeNames[indexMain]}</h4>
                <ul className={indexMain}>
                  {Object.entries(item).map(([key, value], index) => {
                    let keyArr = [];
                    if (key.includes("/")) {
                      keyArr = key.split("/");
                    } else {
                      keyArr = [key];
                    }
                    const isStartingEquipment = findCommonElements(
                      unitList[id].startingEquipment,
                      keyArr
                    );

                    return (
                      <li key={`${index}3`}>
                        <span
                          style={{
                            marginRight: value[0] < 9 ? "15px" : "8.6px",
                          }}
                        >{`${value[0]} zk `}</span>
                        <input
                          onClick={handleWeaponListClick}
                          checked={
                            unitList[id].optionalEquipment.includes(key) ||
                            isStartingEquipment ||
                            unitList[id].rules.includes(key)
                          }
                          data={value[2]}
                          name={key}
                          value={value[0]}
                          className={id}
                          key={index}
                          type="checkbox"
                          disabled={
                            unitList[id].startingEquipment.includes(key) ||
                            isStartingEquipment
                          }
                          readOnly
                        ></input>
                        {indexMain <= 1 && (
                          <input
                            onClick={handleWeaponListClick2}
                            checked={
                              unitList[id].optionalEquipment
                                .concat(unitList[id].startingEquipment)
                                .filter((x) => x === key).length === 2
                            }
                            data={value[2]}
                            name={key}
                            value={value[0]}
                            className={id}
                            key={`${index}2`}
                            type="checkbox"
                            disabled={
                              unitList[id].startingEquipment.filter(
                                (x) => x === key
                              ).length === 2
                            }
                            readOnly
                          ></input>
                        )}
                        {key}
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          }
        })}
        {isCommandGroup && (
          <div className="equipment-type-list">
            <h4>Specjalne</h4>
            <ul onChange={handleCommandGroupClick}>
              <li>
                <input
                  type="checkbox"
                  checked={checked}
                  className={id}
                  name="command-group-checkbox"
                  readOnly
                ></input>
                Grupa dowodzenia
              </li>
              {checked && (
                <>
                  <li>
                    <input
                      type="checkbox"
                      className={id}
                      name="Chorąży"
                      checked={unitList[id].optionalEquipment.includes(
                        "Chorąży"
                      )}
                      data="Dowodzenie"
                      readOnly
                    />
                    Chorąży
                  </li>
                  <li>
                    <input
                      type="checkbox"
                      className={id}
                      name="Sygnalista"
                      checked={unitList[id].optionalEquipment.includes(
                        "Sygnalista"
                      )}
                      data="Dowodzenie"
                      readOnly
                    />
                    Sygnalista
                  </li>
                </>
              )}
            </ul>
          </div>
        )}
      </div>
      {}
    </div>
  );
};

export default WeaponList;
