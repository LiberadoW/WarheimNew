import React, { useEffect, useState } from "react";
import ArmyListErrors from "./ArmyListErrors";
import armies from "../Data.js/Armies";
import "../styles/ArmyInfo.css";
import getErrors from "../Functions/getErrors";
import getModelAmount from "../Functions/getModelAmount";
import { Link } from "react-router-dom";

const ArmyInfo = ({ totalCost, prestige, army, unitList, setArmyName }) => {
  const [clicked, setClicked] = useState(false);
  const [errors, setErrors] = useState(0);

  const handleClick = () => {
    setClicked(!clicked);
  };

  const modelAmount = getModelAmount(unitList, army);

  useEffect(() => {
    setErrors(getErrors(armies, army, totalCost, modelAmount, unitList));
  },[army, totalCost, modelAmount, unitList]);

  const handleArmyNameChange = (e) => {
    setArmyName(e.target.value);
  };

  return (
    <div className="army-info-alerts-container">
      <div className="army-info-container">
        <div className="army-info-left">
          {errors > 0 && (
            <p className="alerts" onClick={handleClick}>
              {clicked ? (
                <i className="fa-solid fa-caret-down fa-xl"></i>
              ) : (
                <i className="fa-solid fa-caret-right fa-xl"></i>
              )}
              <span>
                <i className="fa-solid fa-triangle-exclamation"></i> Liczba błędów:{" "}
                {errors}{" "}
              </span>
            </p>
          )}
        </div>
        <div className="army-info-right">
          <p className="army-name-input">
            <span>Nazwa kompanii:</span>{" "}
            <input onChange={handleArmyNameChange} type="text" />
          </p>
          <p className="prestige">
            <span className="bold">Prestiż:</span> {prestige}
          </p>
          <p
            className="total-cost"
            style={{
              color: totalCost > army.limit ? "red" : "black",
            }}
          >
            <span className="bold">Suma:</span>{" "}
            {`${totalCost} / ${army.limit} zk`}
          </p>
          <p>
            <Link to="/armylist" target="_blank">
              <button className="button">Eksportuj</button>
            </Link>
          </p>
        </div>
      </div>
      {clicked && (
        <ArmyListErrors army={army} unitList={unitList} totalCost={totalCost} />
      )}
    </div>
  );
};

export default ArmyInfo;
