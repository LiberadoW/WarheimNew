import React from "react";
import "../styles/Treasury.css";
import { getPrestige } from "../Functions/getPrestige";

const Treasury = ({ army, unitList }) => {

  const prestigeValues = getPrestige(unitList, army);
  return (
    <div className="treasury-container">
      <div className="big-prestige">
        <div className="treasury-title">PRESTIŻ</div>
        <div className="prestige-values-container">
          <div className="prestige-values-left">
            <div>
              <span>Suma PD bohaterów:</span>
            </div>
            <div>
              <span>Suma PD stronników:</span>
            </div>
            <div>
              <span>Suma punktów kampanii:</span>
            </div>
            <div>
              <span>{`Liczba modeli (${prestigeValues[1].modelsNumber})x5:`}</span>
            </div>
            <div>
              <span>{`Wierzchowce (${prestigeValues[1].mountsNumber})x5:`}</span>
            </div>
            <div>
              <span>{`Wartość ekwipunku (${prestigeValues[1].equipmentTotalValue})x1/10:`}</span>
            </div>
            <div>
              <span>{`Magiczne przedmioty (${0})x5:`}</span>
            </div>
            <div>
              <span>{`Duże cele (${prestigeValues[1].bigTargetsNumber})x20:`}</span>
            </div>
            <div>
              <span>{`Machiny (${prestigeValues[1].warmachinesNumber})x25:`}</span>
            </div>
            <div>
              <span>{`Potwory (${prestigeValues[1].monstersNumber})x50:`}</span>
            </div>
            <div>
              <span>Najemne ostrza:</span>
            </div>
            <div>
              <span>Postacie dramatu:</span>
            </div>
            <div>
              <span className="bold">PRESTIŻ DRUŻYNY:</span>
            </div>
          </div>
          <div className="prestige-values-right">
            <div>
              <span>{prestigeValues[1].heroesTotalExp}</span>
            </div>
            <div>
              <span>0</span>
            </div>
            <div>
              <span>0</span>
            </div>
            <div>
              <span>{prestigeValues[1].modelsNumber * 5}</span>
            </div>
            <div>
              <span>{prestigeValues[1].mountsNumber * 5}</span>
            </div>
            <div>
              <span>{prestigeValues[1].equipmentTotalValue/10}</span>
            </div>
            <div>
              <span>0</span>
            </div>
            <div>
              <span>{prestigeValues[1].bigTargetsNumber*10}</span>
            </div>
            <div>
              <span>{prestigeValues[1].warmachinesNumber*25}</span>
            </div>
            <div>
              <span>{prestigeValues[1].monstersNumber*50}</span>
            </div>
            <div>
              <span>{prestigeValues[1].mercenariesTotalPrestige}</span>
            </div>
            <div>
              <span>0</span>
            </div>
            <div>
              <span>{prestigeValues[0]}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="valuables">
        <div className="treasury-title">KOSZTOWNOŚCI</div>
      </div>
      <div className="treasury">
        <div className="treasury-title">SKARBIEC</div>
      </div>
    </div>
  );
};

export default Treasury;
