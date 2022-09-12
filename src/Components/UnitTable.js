import React from "react";
import "../styles/UnitTable.css";
import { getModifiers } from "../Functions/getModifiers";
import StatsTable from "./StatsTable";

const UnitTable = ({ unitList, heroes }) => {

  const experienceBold = [
    2, 4, 6, 8, 11, 14, 17, 20, 24, 28, 32, 36, 41, 46, 51, 57, 63, 69, 76, 83,
    90,
  ];
  const statsHeaders = [
    "Statystyka",
    "Sz",
    "WW",
    "US",
    "S",
    "Wt",
    "Żw",
    "I",
    "A",
    "CP",
    "OP",
  ];
  const skills = [
    "Walki",
    "Strzeleckie",
    "Akademickie",
    "Siłowe",
    "Szybkościowe",
    "Specjalne",
  ];

  return (
    <div className="army-list-container">
      <div className="army-list">
        {unitList.map((item) => {
          const equipmentString = item.startingEquipment.concat(
            item.optionalEquipment
          );

          const [armour, speedModifier, initativeModifier] =
            getModifiers(equipmentString);

          if (item.type !== "Najemne Ostrze") {
            equipmentString.sort(
              (a, b) =>
                Object.keys(heroes[item.unitName].equipmentList).indexOf(a) -
                Object.keys(heroes[item.unitName].equipmentList).indexOf(b)
            );
          }

          equipmentString.forEach((item, index) => {
            if (["Lekki", "Średni", "Ciężki"].includes(item)) {
              equipmentString[index] = `${item} pancerz`;
            }
          });

          if (item.type === "Bohater") {
            return (
              <div className="unit-table">
                <div className="stats-table">
                  <div className="unit-table-name">
                    <span className="bold">Imię: </span>
                    <span>{item.unitDisplayName}</span>
                  </div>
                  <div className="unit-table-type">
                    <span className="bold">Typ: </span>
                    <span>{item.unitName}</span>
                  </div>
                  <div className="unit-table-skills">
                    {skills.map((skill, index) => {
                      return (
                        <span>
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
                <div className="equipment-table">
                  <div className="skills">
                    <span className="bold">
                      {"Umiejętności & zaklęcia/modlitwy: "}
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
                    {[...Array(90)].map((e, i) => (
                      <span
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
                    ))}
                  </div>
                  <div className="injuries">
                    <span className="bold">Poważne obrażenia:</span>
                  </div>
                </div>
              </div>
            );
          } else if (item.type === "Najemne Ostrze") {
            return (
              <div className="unit-table">
                <div className="stats-table">
                  <div className="unit-table-name">
                    <span className="bold">Imię: </span>
                    <span>{item.unitDisplayName}</span>
                  </div>
                  <div className="unit-table-type-henchmen">
                    <span className="bold">Typ: </span>
                    <span>{item.unitName}</span>
                    <span className="number-henchmen">
                      <span className="bold">Żołd:</span>{" "}
                      <span>{`${item.pay} zk`}</span>
                    </span>
                  </div>
                  <div className="unit-table-skills">
                    {skills.map((skill, index) => {
                      return (
                        <span>
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
                      {"Umiejętności & zasady specjalne: "}
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
                    {[...Array(14)].map((e, i) => (
                      <span
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
                    ))}
                  </div>
                </div>
              </div>
            );
          } else {
            return (
              <div className="unit-table-henchmen">
                <div className="stats-table-henchmen">
                  <div className="unit-table-name">
                    <span className="bold">Imię: </span>
                    <span>{item.unitDisplayName}</span>
                  </div>
                  <div className="unit-table-type-henchmen">
                    <span className="bold">Typ: </span>
                    <span>{item.unitName}</span>
                    <span className="number-henchmen bold" style={{marginRight: item.selectedNumber >0 ? "15px" : "24.6px"}}>
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
                      {"Umiejętności & zaklęcia/modlitwy: "}
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
                    {[...Array(14)].map((e, i) => (
                      <span
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
                    ))}
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
