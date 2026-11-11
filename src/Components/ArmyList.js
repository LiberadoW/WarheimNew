import React from "react";
import UnitTable from "./UnitTable";
import Treasury from "./Treasury";
import ArmyListHeader from "./ArmyListHeader";
import CampaignPoints from "./CampaignPoints";
import ArmyRulesAppendix from "./ArmyRulesAppendix";
import "../styles/ArmyList.css";
import { getAllUniqueEquipment } from "../Functions/getAllUniqueEquipment";

const ArmyList = ({
  unitList,
  heroes,
  unitName,
  setUnitList,
  army,
  prestige,
  armyName,
  campaignNotes,
  includeRules = false,
}) => {
  const heroesUnitList = unitList.filter((unit) => unit.type === "Bohater");
  const henchmenUnitList = unitList.filter(
    (unit) =>
      unit.type === "Stronnik" ||
      unit.type === "Machina" ||
      unit.type === "Najemne Ostrze",
  );
  const uniqueEquipmentArray = getAllUniqueEquipment(unitList);

  console.log(uniqueEquipmentArray);

  return (
    <div className="army-list-container">
      <div className="print-a4-page">
        <ArmyListHeader
          army={army}
          prestige={prestige}
          armyName={armyName}
          unitList={unitList}
        />
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
          campaignNotes={campaignNotes}
        />
      </div>
      <div className="print-a4-page">
        <UnitTable
          unitList={henchmenUnitList}
          heroes={heroes}
          unitName={unitName}
          setUnitList={setUnitList}
        />
        <CampaignPoints army={army} campaignNotes={campaignNotes} />
      </div>
      {includeRules && <ArmyRulesAppendix unitList={unitList} />}
      {/* <div className="print-a4-page">
        <div className="rules-box">
          {uniqueRulesList.map((rule) => {
            return (
              <div className="rule" key={rule}>
                <span className="rule-title">{`${rule}: `}</span>

                <span className="rule-body">{rulesObject[rule]}</span>
              </div>
            );
          })}
        </div>
      </div> */}
      {/* <div className="print-a4-page">
        {magicPath && (
          <div className="magic-box">
            <p className="spell-school-title">{magicPath}</p>
            {Object.keys(magic[magicPath])
              .sort((a, b) => a - b)
              .map((spell) => {
                return (
                  <p className="spell-card">
                    <span className="bold-text spell-card-title">
                      {magic[magicPath][spell][0]}
                    </span>
                    <span className="capitalize-first italic">
                      {magic[magicPath][spell][1]}
                    </span>
                    <span className="spell-card-text">
                      {magic[magicPath][spell][2]}
                    </span>
                  </p>
                );
              })}
          </div>
        )}
      </div> */}
      {/* {uniqueEquipmentArray && (
        <div className="print-a4-page">
          <div className="magic-box">
            {uniqueEquipmentArray.map((item) => {
              return (
                <p className="spell-card">
                  <span className="bold-text">{item}</span>
                  <span className="">{getItemText(item)}</span>
                </p>
              );
            })}
          </div>
        </div>
      )} */}
    </div>
  );
};

export default ArmyList;
