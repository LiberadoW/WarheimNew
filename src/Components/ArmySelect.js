import { React, useContext } from "react";
import "../styles/ArmySelect.css";
import armies from "../Data.js/Armies";
import { CommandContext } from "../layouts/Builder";

const ArmySelect = ({
  army,
  setArmy,
  setUnitList,
  setUnitName,
  setIdShown,
  setMercenaryUnitName,
}) => {
  const { setStandardBearer, setMusician } = useContext(CommandContext);

  const handleOnChange = (e) => {
    setArmy(e.target.value);
    setUnitName("");
    setUnitList([]);
    setIdShown(null);
    setMercenaryUnitName("");
    setStandardBearer(null);
    setMusician(null);
  };

  const updatedArmies = [
    "Łowcy Czarownic",
    "Cyrkowcy z Ligii Ostermarku",
    "Strażnicy dróg z Averlandu",
    "Zbrojna chorągiew z Kisleva",
    "Kupiecka karawana z Arabii",
    "Amazonki z Lustrii",
    "Gladiatorzy z Jałowej Krainy",
    "Leśni Elfowie z Athel Loren",
    "Mroczni Elfowie z Naggaroth",
    "Khazadzi z Gór Krańca Świata",
    "Krasnoludowie Chaosu z Zorn Uzkul",
    "Jeźdzcy Wilków",
    "Kult Ducha Chaosu",
    "Kult Karmazynowej Czaszki",
    "Kult Dzieci Zagłady",
    "Grasanci Chaosu",
    "Karnawał Chaosu",
    "Nieumarły orszak księżnej Lahmi",
    "Zwiadowcze stado klanu Eshin",
    "Kult Zarazy klanu Pestilens",
    "Łowcze plemię Dzikich Orków",
    "Plemię Leśnych Goblinów",
    "Załoga Zielonoskórych Kaprów",
    "Nieumarła horda Liczmistrza",
    "Nocne Gobliny",
    "Piechota Morska z Marienburga",
    "Zbrojni z Middenheim",
    "Zbrojne stado klanu Mors",
    "Poganiacze klanu Moulder",
    "Muszkieterzy z Nuln",
    "Nieumarły zastęp z Nehekhary",
    "Nieumarły sabat rodu Nekrarch",
  ];

  return (
    <div className="army-select-container">
      <span className="bold">Banda:</span>
      <select onChange={handleOnChange} value={army.name}>
        <option disabled>Wybierz bandę</option>

        {Object.keys(armies)
          .sort((a, b) => a.localeCompare(b, "pl"))
          .map((army, index) => {
            return (
              <option
                key={index}
                value={army}
                className={
                  updatedArmies.includes(army)
                    ? `army-select-updated-option`
                    : ``
                }
              >
                {army}
              </option>
            );
          })}
      </select>
    </div>
  );
};

export default ArmySelect;
