import React, { useEffect, useState, useContext } from "react";
import { Navigate } from "react-router-dom";
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
import { db } from "../Database/database";
import { doc, updateDoc, getDoc, Timestamp } from "firebase/firestore";
import { AuthContext } from "../Context/AuthContext";

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
  armyName,
  setArmyName,
}) => {
  const [totalCost, setTotalCost] = useState(0);
  const [idShown, setIdShown] = useState(null);
  const { currentUser } = useContext(AuthContext);
  const [showModal, setShowModal] = useState(false);

  const RequireAuth = ({ children }) => {
    return currentUser ? children : <Navigate to="/login"></Navigate>;
  };

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
  }, [unitList]);

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

  const saveArmy = async (e) => {
    e.preventDefault();
    try {
      const savedLists = await getDoc(doc(db, "lists", currentUser.user.uid));
      const arrayOfSavedLists = savedLists.data().lists;
      const arrayArmyNames = savedLists.data().armyNames;

      if(armyName.trim().length===0) {
        alert("Nazwij swoją kompanię")
        return;
      }

  

      const armyObj = {
        armyType: army.name,
        armyName: armyName,
        armyList: unitList,
        timestamp: Timestamp.now(),
        totalCost: totalCost,
        prestige: prestige,
      };

      if (arrayArmyNames.includes(armyName.trim())) {
        const index = arrayOfSavedLists
          .map((e) => e.armyName)
          .indexOf(armyName);
        arrayOfSavedLists[index] = armyObj;
      } else {
        arrayOfSavedLists.push(armyObj);
        arrayArmyNames.push(armyName);
      }

      await updateDoc(doc(db, "lists", currentUser.user.uid), {
        lists: arrayOfSavedLists,
        armyNames: arrayArmyNames,
      });
      alert("Armia została zapisana.");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <Header />
      <div className="builder">
      
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

        {currentUser && (
          <button className="button save-army-button" onClick={saveArmy}>
            Zapisz armię
          </button>
        )}

        <ArmyInfo
          prestige={prestige}
          totalCost={totalCost}
          army={army}
          unitList={unitList}
          setArmyName={setArmyName}
          armyName={armyName}
        />

        <div className="main-builder-container">
          <div className="side-builder-left">
            <UnitList
              unitList={unitList}
              setUnitList={setUnitList}
              idShown={idShown}
              setIdShown={setIdShown}
              showModal={showModal}
              setShowModal={setShowModal}
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
            setIdShown={setIdShown}
            showModal={showModal}
            setShowModal={setShowModal}
          />
        </div>
      </div>
    </>
  );
};

export default Builder;
