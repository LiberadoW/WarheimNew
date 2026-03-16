import React from "react";
import "../styles/UnitTable.css";
import { getModifiers } from "../Functions/getModifiers";
import StatsTable from "./StatsTable";

const experienceBold = [
  2, 4, 6, 8, 11, 14, 17, 20, 24, 28, 32, 36, 41, 46, 51, 57, 63, 69, 76, 83,
  90,
];

const experienceBoldHenchmen = [2, 5, 9, 14];

const statsHeaders = [
  "Statystyka",
  "Sz",
  "WW",
  "US",
  "S",
  "Wt",
  "\u017Bw",
  "I",
  "A",
  "CP",
  "OP",
];
const skills = [
  "Walki",
  "Strzeleckie",
  "Akademickie",
  "Si\u0142owe",
  "Szybko\u015Bciowe",
  "Specjalne",
];

const shouldSplitEquipmentName = (name) =>
  typeof name === "string" &&
  name.includes("/") &&
  !name.includes("(") &&
  !name.includes(")");

const getEquipmentAliases = (name) => {
  if (!shouldSplitEquipmentName(name)) {
    return [name];
  }

  return name
    .split("/")
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
};

const getAliasSelectionQueue = (aliasSelections, canonicalName) => {
  const selected = aliasSelections?.[canonicalName];

  if (Array.isArray(selected)) {
    return [...selected];
  }

  if (typeof selected === "string" && selected.length > 0) {
    return [selected];
  }

  return [];
};

const getDisplayEquipment = (unit, equipmentList) => {
  const aliasQueues = {};
  const startingCounts = unit.startingEquipment.reduce((acc, equipment) => {
    acc[equipment] = (acc[equipment] || 0) + 1;
    return acc;
  }, {});
  const seenCounts = {};

  return equipmentList.map((equipment) => {
    const aliases = getEquipmentAliases(equipment);

    if (aliases.length === 1) {
      return equipment;
    }

    const seenCount = seenCounts[equipment] || 0;
    seenCounts[equipment] = seenCount + 1;

    if (seenCount < (startingCounts[equipment] || 0)) {
      return aliases[0];
    }

    if (!aliasQueues[equipment]) {
      aliasQueues[equipment] = getAliasSelectionQueue(
        unit.equipmentAliasSelections,
        equipment
      );
    }

    if (aliasQueues[equipment].length > 0) {
      return aliasQueues[equipment].shift();
    }

    return aliases[0];
  });
};

const formatCustomEquipmentEntry = (entry) => {
  if (entry && typeof entry === "object" && !Array.isArray(entry)) {
    const name = String(entry.name || "").trim();
    const price = Number(entry.price);

    if (name.length === 0) {
      return null;
    }

    if (Number.isFinite(price) && price >= 0) {
      return `${name} (${price} zk)`;
    }

    return name;
  }

  if (typeof entry === "string" && entry.trim().length > 0) {
    return entry.trim();
  }

  return null;
};

const UnitTable = ({ unitList, heroes, handleSetUnitExp }) => {
  unitList.sort((a, b) => a.id - b.id);

  return (
    <div className="army-list-container">
      <div className="army-list">
        {unitList.map((item, index) => {
          const standardEquipment = item.startingEquipment.concat(
            item.optionalEquipment
          );

          let [armour, speedModifier, initativeModifier] = getModifiers(
            standardEquipment,
            item
          );

          if (item.type !== "Najemne Ostrze") {
            standardEquipment.sort(
              (a, b) =>
                Object.keys(heroes[item.unitName].equipmentList).indexOf(a) -
                Object.keys(heroes[item.unitName].equipmentList).indexOf(b)
            );
          }

          const standardEquipmentString = getDisplayEquipment(
            item,
            standardEquipment
          );

          standardEquipmentString.forEach((item, index) => {
            if (["Lekki", "\u015Aredni", "Ci\u0119\u017Cki"].includes(item)) {
              standardEquipmentString[index] = `${item} pancerz`;
            }
          });

          const customEquipmentString = (item.customEquipment || [])
            .map((entry) => formatCustomEquipmentEntry(entry))
            .filter((entry) => entry !== null);

          const equipmentString = standardEquipmentString.concat(
            customEquipmentString
          );

          if (item.type === "Bohater") {
            return (
              <div
                className={`unit-table ${
                  Object.keys(item.stats).length === 3
                    ? "unit-table-height3"
                    : "unit-table-height2"
                }`}
                key={index}
              >
                <div className="stats-table">
                  <div className="unit-table-name">
                    <span className="bold">Imi\u0119: </span>
                    <span>{item.unitDisplayName}</span>
                  </div>
                  <div className="unit-table-type">
                    <span className="bold">Typ: </span>
                    <span>{item.unitName}</span>
                  </div>
                  <div className="unit-table-skills">
                    {skills.map((skill, index) => {
                      return (
                        <span key={index}>
                          <i
                            className={
                              item.skills.includes(index)
                                ? "fa-solid fa-square-full"
                                : "fa-regular fa-square-full"
                            }
                          ></i>
                          {skill}
                        </span>
                      );
                    })}
                  </div>
                  <StatsTable
                    item={item}
                    statsHeaders={statsHeaders}
                    armour={armour}
                    speedModifier={speedModifier}
                    initativeModifier={initativeModifier}
                    heroes={heroes}
                  />
                </div>
                <div className="equipment-table">
                  <div className="skills">
                    <span className="bold">
                      {"Umiej\u0119tno\u015Bci & zakl\u0119cia/modlitwy: "}
                    </span>
                    <span>{item.rules.join(", ")}</span>
                  </div>
                  <div className="equipment">
                    <span className="bold">Ekwipunek: </span>
                    <span>{equipmentString.join(", ")}</span>
                  </div>
                  <div className="experience">
                    {[...Array(30)].map((e, i) => (
                      <span className="experience-number" key={i}>
                        {(i + 1) % 5 === 0 ? i + 1 : ""}
                      </span>
                    ))}
                    {[...Array(90)].map((e, i) => {
                      const setExp = () => {
                        handleSetUnitExp(item.uniqueId, i + 1);
                      };
                      return (
                        <span
                          onClick={setExp}
                          className={
                            experienceBold.includes(i + 1)
                              ? "experience-box-bold"
                              : "experience-box"
                          }
                          style={{
                            backgroundColor: i < item.exp ? "gray" : "white",
                          }}
                          key={i}
                        ></span>
                      );
                    })}
                  </div>
                  <div className="injuries">
                    <span className="bold">Powa\u017Cne obra\u017Cenia:</span>
                    <span>{item.injuries?.join(", ")}</span>
                  </div>
                </div>
              </div>
            );
          } else if (item.type === "Najemne Ostrze") {
            return (
              <div
                className={`unit-table ${
                  Object.keys(item.stats).length === 3
                    ? "unit-table-height3"
                    : "unit-table-height2"
                }`}
                key={`${index}1`}
              >
                <div className="stats-table">
                  <div className="unit-table-name">
                    <span className="bold">Imi\u0119: </span>
                    <span>{item.unitDisplayName}</span>
                  </div>
                  <div className="unit-table-type-henchmen">
                    <span className="bold">Typ: </span>
                    <span>{item.unitName}</span>
                    <span className="number-henchmen">
                      <span className="bold">\u017Bo\u0142d:</span>{" "}
                      <span>{`${item.pay} zk`}</span>
                    </span>
                  </div>
                  <div className="unit-table-skills">
                    {skills.map((skill, index) => {
                      return (
                        <span key={`${index}1`}>
                          <i
                            className={
                              item.skills.includes(index)
                                ? "fa-solid fa-square-full"
                                : "fa-regular fa-square-full"
                            }
                          ></i>
                          {skill}
                        </span>
                      );
                    })}
                  </div>
                  <StatsTable
                    item={item}
                    statsHeaders={statsHeaders}
                    armour={armour}
                    speedModifier={speedModifier}
                    initativeModifier={initativeModifier}
                  />
                </div>
                <div className="equipment-table-henchmen">
                  <div className="skills-henchmen">
                    <span className="bold">
                      {"Umiej\u0119tno\u015Bci & zasady specjalne: "}
                    </span>
                    <span>{item.rules.join(", ")}</span>
                  </div>
                  <div className="equipment-henchmen">
                    <span className="bold">Ekwipunek: </span>
                    <span>{equipmentString.join(", ")}</span>
                  </div>
                  <div className="experience-henchmen">
                    {[...Array(14)].map((e, i) => (
                      <span className="experience-number" key={i}>
                        {(i + 1) % 5 === 0 ? i + 1 : ""}
                      </span>
                    ))}
                    {[...Array(14)].map((e, i) => {
                      const setExp = () => {
                        handleSetUnitExp(item.uniqueId, i + 1);
                      };

                      return (
                        <span
                          onClick={setExp}
                          className={
                            experienceBoldHenchmen.includes(i + 1)
                              ? "experience-box-bold"
                              : "experience-box"
                          }
                          style={{
                            backgroundColor: i < item.exp ? "gray" : "white",
                          }}
                          key={i}
                        ></span>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          } else {
            return (
              <div
                className={`unit-table-henchmen ${
                  Object.keys(item.stats).length === 3
                    ? "unit-table-henchmen-height3"
                    : "unit-table-henchmen-height2"
                }`}
                key={`${index}2`}
              >
                <div className="stats-table-henchmen">
                  <div className="unit-table-name">
                    <span className="bold">Imi\u0119: </span>
                    <span>{item.unitDisplayName}</span>
                  </div>
                  <div className="unit-table-type-henchmen">
                    <span className="bold">Typ: </span>
                    <span>{item.unitName}</span>
                    <span
                      className="number-henchmen bold"
                      style={{
                        marginRight:
                          item.selectedNumber > 0 ? "15px" : "24.6px",
                      }}
                    >
                      Liczba: {item.selectedNumber}
                    </span>
                  </div>
                  <StatsTable
                    item={item}
                    statsHeaders={statsHeaders}
                    armour={armour}
                    speedModifier={speedModifier}
                    initativeModifier={initativeModifier}
                  />
                </div>
                <div className="equipment-table-henchmen">
                  <div className="skills-henchmen">
                    <span className="bold">
                      {"Umiej\u0119tno\u015Bci & zasady specjalne: "}
                    </span>
                    <span>{item.rules.join(", ")}</span>
                  </div>
                  <div className="equipment-henchmen">
                    <span className="bold">Ekwipunek: </span>
                    <span>{equipmentString.join(", ")}</span>
                  </div>
                  <div className="experience-henchmen">
                    {[...Array(14)].map((e, i) => (
                      <span className="experience-number" key={i}>
                        {(i + 1) % 5 === 0 ? i + 1 : ""}
                      </span>
                    ))}
                    {[...Array(14)].map((e, i) => {
                      const setExp = () => {
                        handleSetUnitExp(item.uniqueId, i + 1);
                      };

                      return (
                        <span
                          onClick={setExp}
                          className={
                            experienceBoldHenchmen.includes(i + 1)
                              ? "experience-box-bold"
                              : "experience-box"
                          }
                          style={{
                            backgroundColor: i < item.exp ? "gray" : "white",
                          }}
                          key={i}
                        ></span>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          }
        })}
      </div>
    </div>
  );
};

export default UnitTable;
