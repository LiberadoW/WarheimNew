import React, { useEffect, useState, useContext } from "react";
import ArmyListErrors from "./ArmyListErrors";

import "../styles/ArmyInfo.css";
import getErrors from "../Functions/getErrors";
import getModelAmount from "../Functions/getModelAmount";
import { EditArmyContext } from "../layouts/App";

const ArmyInfo = ({
  totalCost,
  prestige,
  army,
  unitList,
  setArmyName,
  armyName,
  errors,
  setErrors,
  isCustomArmyCost,
  customArmyCost,
  theme,
}) => {
  const [clicked, setClicked] = useState(false);
  const { isEditArmyView } = useContext(EditArmyContext);

  const handleClick = () => {
    setClicked(!clicked);
  };

  if (army.armyRules.includes("Zamożność")) {
    customArmyCost = 1.2 * customArmyCost;
  }

  const modelAmount = getModelAmount(unitList, army);

  const limit = isCustomArmyCost ? customArmyCost : army.limit;

  useEffect(() => {
    if (isEditArmyView) {
      setErrors(0);
      return;
    } else {
      setErrors(getErrors(army, totalCost, modelAmount, unitList, limit));
      return;
    }
  }, [army, totalCost, modelAmount, unitList, isEditArmyView, limit, setErrors]);

  const handleArmyNameChange = (e) => {
    setArmyName(e.target.value);
  };

  const remaining = limit - totalCost;
  const percent = limit > 0 ? Math.min(100, Math.max(0, totalCost / limit * 100)) : 0;
  return (
    <section className="company-summary" aria-label="Podsumowanie kompanii">
      <div className="company-summary-main">
        <label className="company-name-field" htmlFor="company-name">Nazwa kompanii
          <input id="company-name" onChange={handleArmyNameChange} value={armyName} placeholder="Nadaj nazwę swojej kompanii" autoComplete="off" />
        </label>
        <div className={`budget-summary ${remaining < 0 && !isEditArmyView ? "over-budget" : ""}`}>
          <span className="summary-label">{isEditArmyView ? "Wartość kompanii" : "Złote korony"}</span>
          <strong>{totalCost} <span>{!isEditArmyView && `/ ${limit}`} zk</span></strong>
          {!isEditArmyView && <><div className="budget-track" role="progressbar" aria-label="Wykorzystany budżet" aria-valuenow={Math.round(percent)} aria-valuemin={0} aria-valuemax={100}><span style={{ width: `${percent}%` }} /></div>
            <small>{remaining >= 0 ? `Pozostało ${remaining} zk` : `Przekroczono budżet o ${-remaining} zk`}</small></>}
        </div>
        <div className="summary-stat"><span className="summary-label">Modele</span><strong>{modelAmount}<span>{!isEditArmyView && ` / ${army.maxModels}`}</span></strong><small>{!isEditArmyView ? `Min. modeli: ${army.minModels}` : "W kompanii"}</small></div>
        <div className="summary-stat"><span className="summary-label">Prestiż</span><strong>{prestige}</strong><small>Siła kompanii</small></div>
      </div>
      {!isEditArmyView && <div className={`roster-validation ${errors ? "needs-attention" : "is-valid"}`}>
        {errors ? <><button type="button" onClick={handleClick} aria-expanded={clicked} aria-controls="roster-validation-details"><span aria-hidden="true">{clicked ? "−" : "+"}</span> {unitList.length === 0 ? "Zacznij od dowódcy i skompletuj drużynę" : `Do sprawdzenia: ${errors}`}</button><span>{clicked ? "Ukryj szczegóły" : "Pokaż wymagania"}</span></>
          : <p>✓ Kompania spełnia wymagania rekrutacji</p>}
      </div>}
      {clicked && errors > 0 && <div id="roster-validation-details"><ArmyListErrors army={army} unitList={unitList} totalCost={totalCost} limit={limit} /></div>}
    </section>
  );
};
export default ArmyInfo;
