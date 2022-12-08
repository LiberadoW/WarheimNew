import React from "react";
import UnitTable from "./UnitTable";
import Treasury from "./Treasury";
import ArmyListHeader from "./ArmyListHeader";
import CampaignPoints from "./CampaignPoints";
import "../styles/ArmyList.css";

const ArmyList = ({
  unitList,
  heroes,
  unitName,
  setUnitList,
  army,
  prestige,
  armyName,
}) => {
  const heroesUnitList = unitList.filter((unit) => unit.type === "Bohater");
  const henchmenUnitList = unitList.filter(
    (unit) =>
      unit.type === "Stronnik" ||
      unit.type === "Machina" ||
      unit.type === "Najemne Ostrze"
  );
  return (
    <div className="army-list-container">
      <div className="print-a4-page">
        <ArmyListHeader army={army} prestige={prestige} armyName={armyName} />
        <UnitTable
          unitList={heroesUnitList}
          heroes={heroes}
          unitName={unitName}
          setUnitList={setUnitList}
        />
        <Treasury
          army={army}
          unitList={unitList}
          heroesUnitList={heroesUnitList}
          henchmenUnitList={henchmenUnitList}
        />
      </div>
      <div className="print-a4-page">
        <UnitTable
          unitList={henchmenUnitList}
          heroes={heroes}
          unitName={unitName}
          setUnitList={setUnitList}
        />
        <CampaignPoints army={army} />
      </div>
    </div>
  );
};

export default ArmyList;
