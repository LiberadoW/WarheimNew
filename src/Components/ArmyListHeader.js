import React from "react";
import { armies } from "../layouts/Builder";
import "../styles/ArmyListHeader.css";

const ArmyListHeader = ({ army, prestige, armyName }) => {
  return (
    <div className="army-list-header">
      <p><span className="bold">Nazwa kompanii: </span><span>{armyName}</span></p>
      <p>
        <span className="bold">Drużyna: </span>
        <span>{army.name}</span>
      </p>
      <p>
        <span className="bold">Natura: </span>
        <span>{army.nature}</span>
      </p>
      <p>
        <span className="bold">Prestiż: </span>
        {prestige}
        <span></span>
      </p>
    </div>
  );
};

export default ArmyListHeader;
