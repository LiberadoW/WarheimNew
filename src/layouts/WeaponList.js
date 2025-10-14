import React, { useContext, useEffect, useState } from "react";
import "../styles/WeaponList.css";
import { addCommandCost } from "../Functions/addCommandCost";
import { setCommandNumberModels } from "../Functions/setCommandNumberModels";
import { disableButtons } from "../Functions/disableButtons";
import mageEquipmentList from "../Data.js/MageEquipmentList";
import findCommonElements from "../Functions/findCommonElements";
import { getItemText } from "../Functions/getItemText";
import { CommandContext } from "./Builder";
import { getValueOfOptionalEquipment } from "../Functions/getValueOfOptionalEquipment";

const WeaponList = ({ heroes, id, unitList, setUnitList, army }) => {
  const { standardBearer, setStandardBearer, musician, setMusician } =
    useContext(CommandContext);

  const baseCost =
    unitList[id].type != "Najemne Ostrze"
      ? heroes[unitList[id].unitName].cost
      : null;

  const [isPromptShown, setIsPromptShown] = useState(null);
  const [promptUnit, setPromptUnit] = useState(null);
  const [delayHandler, setDelayHandler] = useState(null);

  const isCommandGroup = unitList[id].rules.includes("Chorążowie & sygnaliści");

  const handleMouseEnter = (e) => {
    setPromptUnit(
      e.target.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode
        .parentNode.id
    );
    setDelayHandler(
      setTimeout(() => {
        setIsPromptShown(e.target.id);
      }, 1000)
    );
  };

  const handleMouseLeave = () => {
    clearTimeout(delayHandler);
    setIsPromptShown(null);
    setPromptUnit(null);
  };

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

      const maxShootingWeapons = unitList[id].rules.includes("Zbrojny po zemby")
        ? 3
        : 2;

      if (number1 >= maxShootingWeapons) {
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

      const maxCloseCombatWeapons = unitList[id].rules.includes(
        "Zbrojny po zemby"
      )
        ? 3
        : 2;

      if (number2 >= maxCloseCombatWeapons) {
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
    const equipmentList = unit.optionalEquipment;

    if (unit.unitName === "Troll") {
      if (e.target.name === "Troll Górski" && e.target.checked === true) {
        unit.rules = [
          "Bycza szarża",
          "Duży cel",
          "Głód trzewi",
          "Głupota",
          "Nieświadomy",
          "Niezłomny",
          "Ochronne tatuaże",
          "Przepastne trzewia",
          "Regeneracja",
          "Strach",
          "Wielkolud",
          "Żrąca plwocina",
          "Odporność na magię (2)",
          "Łuskowata skóra (5+)",
          "Pomiot podmroku",
        ];
      } else if (
        e.target.name === "Troll Rzeczny" &&
        e.target.checked === true
      ) {
        unit.rules = [
          "Bycza szarża",
          "Duży cel",
          "Głód trzewi",
          "Głupota",
          "Nieświadomy",
          "Niezłomny",
          "Ochronne tatuaże",
          "Przepastne trzewia",
          "Regeneracja",
          "Strach",
          "Wielkolud",
          "Żrąca plwocina",
          "Nurek",
          "Stygmat Nurgla (odór)",
          "Wodny",
        ];
      } else {
        unit.rules = [
          "Bycza szarża",
          "Duży cel",
          "Głód trzewi",
          "Głupota",
          "Nieświadomy",
          "Niezłomny",
          "Ochronne tatuaże",
          "Przepastne trzewia",
          "Regeneracja",
          "Strach",
          "Wielkolud",
          "Żrąca plwocina",
        ];
      }
    }

    const spellSchools = Object.fromEntries(
      Object.entries(unit.equipmentList).filter(
        ([key]) => key.includes("Tradycja") || key.includes("Magia")
      )
    );

    if (e.target.name.includes("Tradycja") || e.target.name.includes("Magia")) {
      const mageEquipment = mageEquipmentList[e.target.name].equipment;

      const indexOfSpellSchool = unit.rules.findIndex(
        (el) => el.indexOf("Mag") !== -1
      );

      if (unit.rules.includes(e.target.name)) {
        unit.rules.splice(unit.rules.indexOf(e.target.name), 1);
      } else {
        unit.rules.push(e.target.name);
      }

      if (e.target.checked === true) {
        if (
          Object.values(unit.equipmentList).filter((x) => x.length === 2)
            .length === 0
        ) {
          Object.entries(mageEquipment).forEach(([key, value]) => {
            unit.equipmentList[key] = value;
          });
        }

        if (unit.unitName !== "Panna Graala") {
          if (heroes[unit.unitName].skills.length === 0) {
            unit.skills = mageEquipmentList[e.target.name].skills;
          }
        } else {
          unit.equipmentList["Rumak"] = [55, 3];
        }
      } else {
        const differentEquipmentNames = Object.keys(unit.equipmentList).filter(
          (x) => Object.keys(mageEquipment).includes(x)
        );

        if (
          JSON.stringify(differentEquipmentNames) ==
          JSON.stringify(Object.keys(mageEquipment))
        ) {
          unit.equipmentList = spellSchools;
        }

        unit.optionalEquipment = [];
        unit.cost = heroes[unit.unitName].cost;

        if (unit.unitName !== "Panna Graala") {
          if (heroes[unit.unitName].skills.length === 0) {
            unit.skills = [];
          }
        } else {
          unit.equipmentList["Rumak"] = [55, 3];
        }
      }
    } else {
      if (equipmentList.includes(e.target.name)) {
        equipmentList.splice(equipmentList.indexOf(e.target.name), 1);
      } else {
        equipmentList.push(e.target.name);
      }
    }

    if (e.target.name === "Rumak") {
      if (e.target.checked === true) {
        unit.stats["Rumak"] = [8, 3, 0, 3, "-", "-", 3, 1, 5];
      } else {
        delete unit.stats["Rumak"];
      }
    }

    if (e.target.name === "Wielki wilk") {
      if (e.target.checked === true) {
        unit.stats["Wielki wilk"] = [9, 3, 0, 4, "-", "-", 3, 1, 3];
      } else {
        delete unit.stats["Wielki wilk"];
      }
    }

    // for units which have options for starting weapons
    const startingWeapons = Array.from(
      document.querySelectorAll(
        `div.unit[id='${String(id)}'] [data='Startowy']`
      )
    );

    if (startingWeapons.includes(e.target)) {
      const howManyChecked = startingWeapons.filter(
        (x) => x.checked === true
      ).length;

      const valueOfOptionalEquipment = getValueOfOptionalEquipment([
        unitList[id],
      ]);

      // if (unitList[id].unitName === "Debeściak" || unitList[id].unitName === "Debeściak Dzikich Orków") {
      //   if (e.target.name === "Rembak" && e.target.checked === true) {
      //     unitList[id].optionalEquipment.push("Sztylet")
      //   } else if (e.target.name === "Rembak" && e.target.checked === false) {
      //     unitList[id].optionalEquipment.splice(unitList[id].optionalEquipment.indexOf("Sztylet"),1)
      //   }
      // }

      if (howManyChecked === 1) {
        unit.cost = e.target.checked
          ? unit.cost + 0
          : unit.cost - Number(e.target.value);
      } else if (howManyChecked === 0) {
        unit.cost = baseCost + valueOfOptionalEquipment;
      } else {
        unit.cost = e.target.checked
          ? unit.cost + Number(e.target.value)
          : unit.cost - Number(e.target.value);
      }
    } else {
      unit.cost = e.target.checked
        ? unit.cost + Number(e.target.value)
        : unit.cost - Number(e.target.value);
    }

    if (isCommandGroup) {
      const commandGroupArray = Array.from(
        document.querySelectorAll("input[data='Dowodzenie']")
      );
      const howManyCommandChecked = commandGroupArray.filter(
        (x) => x.checked === true
      ).length;
      unit.totalCost =
        unit.cost * unit.selectedNumber + howManyCommandChecked * 20;
    } else if (unitList[id].unitName === "Duże Dźgacze") {
      unit.totalCost = unit.cost * unit.selectedNumber - 100;
    } else if (
      unitList[id].unitName === "Drużyna ciężkich broni" &&
      !unitList[id].rules.includes("Animozja") &&
      army.name !== "Piechota Morska z Marienburga" &&
      army.name !== "Piraci z Sartosy"
    ) {
      if (
        [
          "Kulomiot",
          "Miotacz spaczognia",
          "Moździerz trującego wichru",
          "Spaczrusznica",
        ].some((element) => unitList[id].optionalEquipment.includes(element))
      ) {
        unit.totalCost = unit.cost * unit.selectedNumber - 110;
      } else {
        unit.totalCost = unit.cost * unit.selectedNumber - 60;
      }
    } else if (
      unitList[id].unitName === "Drużyna ciężkich broni" &&
      unitList[id].rules.includes("Animozja")
    ) {
      if (
        ["Harpun", "Ołowiomiotacz"].some((element) =>
          unitList[id].optionalEquipment.includes(element)
        )
      ) {
        unit.totalCost = unit.cost * unit.selectedNumber - 80;
      } else {
        unit.totalCost = unit.cost * unit.selectedNumber - 30;
      }
    } else if (
      unitList[id].unitName === "Drużyna ciężkich broni" &&
      army.name === "Piechota Morska z Marienburga"
    ) {
      if (
        ["Harpun", "Ołowiomiotacz"].some((element) =>
          unitList[id].optionalEquipment.includes(element)
        )
      ) {
        unit.totalCost = unit.cost * unit.selectedNumber - 110;
      } else {
        unit.totalCost = unit.cost * unit.selectedNumber - 60;
      }
    } else if (
      unitList[id].unitName === "Drużyna ciężkich broni" &&
      army.name === "Piraci z Sartosy"
    ) {
      if (
        ["Harpun", "Ołowiomiotacz"].some((element) =>
          unitList[id].optionalEquipment.includes(element)
        )
      ) {
        unit.totalCost = unit.cost * unit.selectedNumber - 90;
      } else {
        unit.totalCost = unit.cost * unit.selectedNumber - 40;
      }
    } else {
      unit.totalCost = unit.cost * unit.selectedNumber;
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

    // for units which have options for starting weapons
    const startingWeapons = Array.from(
      document.querySelectorAll(
        `div.unit[id='${String(id)}'] [data='Startowy']`
      )
    );

    if (startingWeapons.includes(e.target)) {
      const howManyChecked = startingWeapons.filter(
        (x) => x.checked === true
      ).length;

      if (howManyChecked === 1) {
        unit.cost = e.target.checked
          ? unit.cost + 0
          : unit.cost - Number(e.target.value);
      } else if (howManyChecked === 0) {
        unit.cost = e.target.checked ? unit.cost + 0 : unit.cost - 0;
      } else {
        unit.cost = e.target.checked
          ? unit.cost + Number(e.target.value)
          : unit.cost - Number(e.target.value);
      }
    } else {
      unit.cost = e.target.checked
        ? unit.cost + Number(e.target.value)
        : unit.cost - Number(e.target.value);
    }

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

  const handleCommandClick = (e) => {
    const arr = unitList[id].optionalEquipment;
    if (e.target.checked) {
      arr.push(e.target.name);
      e.target.name === "Chorąży"
        ? setStandardBearer(e.target.className)
        : setMusician(e.target.className);
    } else {
      arr.splice(arr.indexOf(e.target.name), 1);
      e.target.name === "Chorąży" ? setStandardBearer(null) : setMusician(null);
    }

    if (arr.includes("Chorąży") && arr.includes("Sygnalista")) {
      unitList[id].number = 2;
      unitList[id].selectedNumber = 2;
    } else if (arr.includes("Chorąży") || arr.includes("Sygnalista")) {
      unitList[id].number = 2;
      unitList[id].selectedNumber = 1;
    } else {
      unitList[id].number = heroes[unitList[id].unitName].number;
    }

    unitList[id].selectedNumber = setCommandNumberModels(arr);

    unitList[id].totalCost = addCommandCost(
      unitList[id].cost,
      unitList[id].selectedNumber,
      arr
    );

    const newUnitList = [...unitList];
    newUnitList.sort();
    setUnitList(newUnitList);
  };

  const equipmentTypeArr = [{}, {}, {}, {}, {}];
  const equipmentTypeNames = [
    "Broń do walki wręcz",
    "Broń dystansowa",
    "Pancerz",
    "Specjalne",
    "Kolegia Magii",
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
              <div className="equipment-type-list" key={`${indexMain}1`}>
                <h4>{equipmentTypeNames[indexMain]}</h4>
                <ul className={indexMain}>
                  {Object.entries(item).map(([key, value], index) => {
                    const isStartingEquipment = findCommonElements(
                      unitList[id].startingEquipment,
                      key
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
                          type="checkbox"
                          disabled={
                            unitList[id].startingEquipment.includes(key) ||
                            isStartingEquipment
                          }
                          readOnly
                        ></input>
                        {indexMain <= 1 &&
                          ![
                            "Harpun",
                            "Ołowiomiotacz",
                            "Kulomiot",
                            "Miotacz spaczognia",
                            "Moździerz trującego wichru",
                            "Spaczrusznica",
                          ].includes(key) && (
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
                              type="checkbox"
                              disabled={
                                unitList[id].startingEquipment.filter(
                                  (x) => x === key
                                ).length === 2
                              }
                              readOnly
                            ></input>
                          )}
                        <span
                          className="equipment-text"
                          onMouseEnter={handleMouseEnter}
                          onMouseLeave={handleMouseLeave}
                          id={key}
                        >
                          {key}
                        </span>
                        {isPromptShown == key && (
                          <p className="equipment-tooltip">
                            {getItemText(key, unitList[promptUnit])}
                          </p>
                        )}
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
            <ul>
              <li>
                <input
                  type="checkbox"
                  className={id}
                  name="Chorąży"
                  checked={unitList[id].optionalEquipment.includes("Chorąży")}
                  onChange={handleCommandClick}
                  disabled={
                    standardBearer &&
                    !unitList[id].optionalEquipment.includes("Chorąży")
                  }
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
                  onChange={handleCommandClick}
                  disabled={
                    musician &&
                    !unitList[id].optionalEquipment.includes("Sygnalista")
                  }
                  data="Dowodzenie"
                  readOnly
                />
                Sygnalista
              </li>
            </ul>
          </div>
        )}
      </div>
      {}
    </div>
  );
};

export default WeaponList;
