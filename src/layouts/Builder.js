import React, {
  useEffect,
  useState,
  useContext,
  createContext,
} from "react";
import ArmySelect from "../Components/ArmySelect";
import UnitSelect from "./UnitSelect";
import UnitList from "./UnitList";
import "../styles/Builder.css";
import { getPrestige } from "../Functions/getPrestige";
import { getOneOfChoices } from "../Functions/getOneOfChoices";
import MercenariesSelect from "./MercenariesSelect";
import ArmyInfo from "../Components/ArmyInfo";
import UnitInfo from "../Components/UnitInfo";
import { db } from "../Database/database";
import { doc, updateDoc, getDoc, Timestamp } from "firebase/firestore";
import { AuthContext } from "../Context/AuthContext";
import html2pdf from "html2pdf.js";
import "@sweetalert2/themes/bootstrap-4";
import Modal from "../Components/Modal";

export const CommandContext = createContext();

const getTotalCost = (arr) => {
  let cost = 0;
  arr.forEach((item) => {
    if (item != null) {
      cost += item.totalCost;
    }
  });
  return cost;
};

const OPTIONS = {
  image: {
    type: "jpeg",
    quality: 500,
  },
  html2canvas: {
    scale: 6,
  },
  jsPDF: {
    unit: "cm",
    format: "a4",
    orientation: "portrait",
  },
};

const normalizeUnitList = (unitList) => {
  unitList.forEach((unit) => {
    Object.keys(unit).forEach((key) => {
      if (unit[key] === undefined) {
        delete unit[key];
      }
    });
  });
  return unitList;
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
  mercenaries,
  setMercenaries,
  handleSetUnitExp,
}) => {
  const [totalCost, setTotalCost] = useState(0);
  const [idShown, setIdShown] = useState(null);
  const { currentUser } = useContext(AuthContext);
  const [showModal, setShowModal] = useState(false);
  const [showNewArmyModal,setShowNewArmyModal] = useState(false);
  const [errors, setErrors] = useState(0);
  const [customArmyCost, setCustomArmyCost] = useState(0);
  const [isCustomArmyCost, setIsCustomArmyCost] = useState(false);

  const [standardBearer, setStandardBearer] = useState(null);
  const [musician, setMusician] = useState(null);

  useEffect(() => {
    setTotalCost(getTotalCost(unitList));
  }, [unitList]);

  useEffect(() => {
    setPrestige(getPrestige(unitList)[0]);
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

      if (armyName.trim().length === 0) {
        alert("Nazwij swoją kompanię");
        return;
      }

      const armyObj = {
        armyType: army.name,
        armyName: armyName,
        armyList: normalizeUnitList(unitList),
        timestamp: Timestamp.now(),
        totalCost: totalCost,
        prestige: prestige,
      };

      if (arrayArmyNames.includes(armyName.trim())) {
        if (
          window.confirm(
            "Rozpiska o podanej nazwie już istnieje. Czy chcesz ją zastąpić?"
          )
        ) {
          const index = arrayOfSavedLists
            .map((e) => e.armyName)
            .indexOf(armyName);
          arrayOfSavedLists[index] = armyObj;
        } else {
          return;
        }
      } else {
        arrayOfSavedLists.push(armyObj);
        arrayArmyNames.push(armyName);
      }

      await updateDoc(doc(db, "lists", currentUser.user.uid), {
        lists: arrayOfSavedLists,
        armyNames: arrayArmyNames,
      });
      alert("Armia została zapisana");
    } catch (err) {
      console.log(err);
    }
  };

  const handleSavePDFClick = (e) => {
    e.preventDefault();
    if (errors === 0) {
      OPTIONS.filename = armyName;
      const element = document.getElementById("armylist").innerHTML;
      html2pdf().from(element).set(OPTIONS).save();
    } else {
      alert(`Napraw występujące błędy aby zapisać rozpiskę.`);
    }
  };

  const handleResetArmyClick = () => {
    if (window.confirm("Czy na pewno chcesz zresetować rozpiskę?")) {
      setUnitList([]);
      setUnitName("");
      setMercenaryUnitName("");
      setArmyName("");
      setStandardBearer(null);
      setMusician(null);
    }
  };

  const handleCustomArmyCostClick = () => {
    setIsCustomArmyCost(!isCustomArmyCost);
    setCustomArmyCost(0);
  };

  const handleCustomArmyCostChange = (e) => {
    e.preventDefault();
    setCustomArmyCost(e.target.value);
  };

  const handleNewArmyClick = e => {

  }

  return (
    <CommandContext.Provider
      value={{ standardBearer, setStandardBearer, musician, setMusician }}
    >
      <div className="builder">
        <div className="builder-top-wrapper">
          <div className="builder-controls">
            <div className="builder-controls-buttons">
            {/* <button className="button" onClick={handleNewArmyClick}>
                Nowa rozpiska
              </button> */}
              <button className="button" onClick={handleResetArmyClick}>
                Resetuj
              </button>
              <button className="button" onClick={handleSavePDFClick}>
                Zapisz PDF
              </button>
              
              {currentUser && (
                <button className="button " onClick={saveArmy}>
                  Zapisz armię
                </button>
              )}
            </div>
            <div>
              <input
                type="checkbox"
                onClick={handleCustomArmyCostClick}
              ></input>
              Zmień startową liczbę ZK
            </div>
            {isCustomArmyCost && (
              <div>
                <input type="text" onChange={handleCustomArmyCostChange} />
              </div>
            )}
          </div>
          <div className="builder-select-container">
            <ArmySelect
              army={army}
              setArmy={setArmy}
              setUnitList={setUnitList}
              setUnitName={setUnitName}
              setIdShown={setIdShown}
              setMercenaryUnitName={setMercenaryUnitName}
              setMercenaries={setMercenaries}
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
        </div>

        <ArmyInfo
          prestige={prestige}
          totalCost={totalCost}
          army={army}
          isCustomArmyCost={isCustomArmyCost}
          customArmyCost={customArmyCost}
          unitList={unitList}
          setArmyName={setArmyName}
          armyName={armyName}
          errors={errors}
          setErrors={setErrors}
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
            handleSetUnitExp={handleSetUnitExp}
            idShown={idShown}
            setIdShown={setIdShown}
            showModal={showModal}
            setShowModal={setShowModal}
          />
        </div>
      </div>

      <Modal showModal={showNewArmyModal} setShowModal={setShowNewArmyModal}></Modal>
    </CommandContext.Provider>
  );
};

export default Builder;
