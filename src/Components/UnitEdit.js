import React, { useState } from "react";
import UnitEditStats from "./UnitEdit/unitEditStats";
import UnitEditInjuries from "./UnitEdit/unitEditInjuries";
import UnitEditRules from "./UnitEdit/unitEditRules";
import "../styles/UnitEdit.css";

const MENU = ["Poważne obrażenia", "Statystyki", "Umiejętności", "Ekwipunek"];
const MENU_HENCHMEN = ["Statystyki", "Ekwipunek"];

const UnitEdit = ({ unitList, unitName, setUnitList, id, heroes }) => {
  const unit = unitList.filter((x) => x.uniqueId === id)[0];
  const [menu, setMenu] = useState("Statystyki");

  const handleMenuClick = (item) => {
    setMenu(item);
  };

  let menuComponent = null;

  switch (menu) {
    case "Poważne obrażenia":
      menuComponent = (
        <UnitEditInjuries
          unitList={unitList}
          unit={unit}
          setUnitList={setUnitList}
          heroes={heroes}
        />
      );
      break;
    case "Statystyki":
      menuComponent = (
        <UnitEditStats
          unitList={unitList}
          unit={unit}
          setUnitList={setUnitList}
          heroes={heroes}
        />
      );
      break;
    case "Umiejętności":
      menuComponent = (
        <UnitEditRules
          unitList={unitList}
          unit={unit}
          setUnitList={setUnitList}
          heroes={heroes}
        />
      );
      break;
    default:
      menuComponent = null;
  }

  let arrayToMap;

  switch (unit.type) {
    case "Bohater":
      arrayToMap = MENU;
      break;
    case "Stronnik":
      arrayToMap = MENU_HENCHMEN;
      break;
    case "Machina":
      arrayToMap = [];
      break;
    case "Najemne Ostrze":
      arrayToMap = MENU_HENCHMEN;
      break;
    default:
      arrayToMap = [];
      break;
  }

  return (
    <div className="unit-edit">
      <div className="unit-edit-menu">
        {arrayToMap.map((item, index) => (
          <button
            className={item === menu ? "menu-button active" : "menu-button"}
            key={index}
            onClick={() => handleMenuClick(item)}
          >
            {item}
          </button>
        ))}
      </div>
      {menuComponent}
    </div>
  );
};

export default UnitEdit;
