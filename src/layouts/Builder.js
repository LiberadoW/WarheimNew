import React, { useEffect, useState } from "react";
import Header from "./Header";
import ArmySelect from "../Components/ArmySelect";
import UnitSelect from "./UnitSelect";
import UnitList from "./UnitList";
import "../styles/Builder.css";
import { getPrestige } from "../Functions/getPrestige";
import { getOneOfChoices } from "../Functions/getOneOfChoices";
import MercenariesSelect from "./MercenariesSelect";
import { mercenaries } from "../Data.js/Mercenaries";
import ArmyInfo from "../Components/ArmyInfo";
import UnitInfo from "../Components/UnitInfo";

const getTotalCost = (arr) => {
  let cost = 0;
  arr.forEach((item) => {
    if (item != null) {
      cost += item.totalCost;
    }
  });
  return cost;
};

const Builder = ({
  unitList,
  setUnitList,
  army,
  setArmy,
  unitName,
  setUnitName,
  mercenaryUnitName,
  setMercenaryUnitName,
  prestige,
  setPrestige,
  setArmyName,
}) => {
  const [totalCost, setTotalCost] = useState(0);
  const [idShown, setIdShown] = useState(null);

  useEffect(() => {
    setTotalCost(getTotalCost(unitList));
    const inputsNumberHenchmenArray = Array.from(
      document.querySelectorAll(
        `div.unit li.unit-info-container p.unit-info span select`
      )
    );
    unitList.sort((a, b) => a.id - b.id);

    const filteredList = unitList.filter(
      (x) => x.type === "Stronnik" || x.type === "Machina"
    );
    const henchmenIndexList = filteredList.map((item) =>
      unitList.indexOf(item)
    );
    inputsNumberHenchmenArray.forEach((item, index) => {
      item.value = unitList[henchmenIndexList[index]].selectedNumber;
    });
  },[unitList]);

  useEffect(() => {
    setPrestige(getPrestige(unitList, army)[0]);
    getOneOfChoices(army, unitList);
  });

  const handleClickShow = (e) => {
    const unitIndex = e.target.className;
    if (unitList[unitIndex].isSelected === undefined) {
      unitList[unitIndex].isSelected = true;
    } else {
      unitList[unitIndex].isSelected = !unitList[unitIndex].isSelected;
    }
    const filteredUnitList = unitList.filter(
      (item) => unitList.indexOf(item) != unitIndex
    );
    filteredUnitList.forEach((unit) => (unit.isSelected = false));
    const newUnitList = [...unitList];
    setUnitList(newUnitList);
  };

  return (
    <div className="builder">
      <Header />
      <div className="builder-select-container">
        <ArmySelect
          army={army}
          setArmy={setArmy}
          setUnitList={setUnitList}
          setUnitName={setUnitName}
          setIdShown={setIdShown}
          setMercenaryUnitName={setMercenaryUnitName}
        />

        <UnitSelect
          heroes={army.heroes}
          setUnitName={setUnitName}
          unitName={unitName}
          unitList={unitList}
          setUnitList={setUnitList}
        />

        <MercenariesSelect
          mercenaries={mercenaries}
          setMercenaryUnitName={setMercenaryUnitName}
          mercenaryUnitName={mercenaryUnitName}
          unitList={unitList}
          setUnitList={setUnitList}
        />
      </div>

      <ArmyInfo
        prestige={prestige}
        totalCost={totalCost}
        army={army}
        unitList={unitList}
        setArmyName={setArmyName}
      />

      <div className="main-builder-container">
        <div className="side-builder-left">
          <UnitList
            unitList={unitList}
            setUnitList={setUnitList}
            idShown={idShown}
            setIdShown={setIdShown}
          />
        </div>

        <UnitInfo
          heroes={army.heroes}
          mercenaries={mercenaries}
          unitName={unitName}
          unitList={unitList}
          setUnitList={setUnitList}
          handleClickShow={handleClickShow}
          idShown={idShown}
        />

      </div>
    </div>
  );
};

export default Builder;
