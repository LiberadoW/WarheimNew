import { getArmyName } from "../Data.js/RulebookNames";
import React, {
  useContext,
  useEffect,
  useRef,
  useState,
  createContext,
} from "react";
import { useLocation } from "react-router-dom";
import {
  doc,
  getDoc,
  Timestamp,
  updateDoc,
  runTransaction,
} from "firebase/firestore";
import html2pdf from "html2pdf.js";
import { avoidPdfPageBreaks } from "../Functions/avoidPdfPageBreaks";
import "@sweetalert2/themes/bootstrap-4";
import ArmySelect from "../Components/ArmySelect";
import HeaderMenu from "../Components/HeaderMenu";
import ArmyInfo from "../Components/ArmyInfo";
import CampaignPointsEditor from "../Components/CampaignPointsEditor";
import Modal from "../Components/Modal";
import UnitDetails, { UnitDetailsHeader } from "../Components/UnitDetails";
import UnitSelect from "./UnitSelect";
import CampaignManager from "../campaign/CampaignManager";
import UnitPicker from "./UnitPicker";
import UnitList from "./UnitList";
import { AuthContext } from "../Context/AuthContext";
import { db } from "../Database/database";
import { getPrestige } from "../Functions/getPrestige";
import { normalizeSpecialRules } from "../Components/CampaignPoints";
import { EditArmyContext, getDefaultCampaignNotes } from "./App";
import "../styles/Builder.css";

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

// html2canvas renders the whole list onto one canvas, and browsers refuse
// canvases taller than ~32k px, so long lists (with rules) get a lower scale.
const MAX_CANVAS_HEIGHT = 32000;
const MAX_CANVAS_AREA = 250000000;

const getPdfScale = (element) => {
  const width = element.scrollWidth || 1;
  const height = element.scrollHeight || 1;
  return Math.max(
    1,
    Math.min(
      OPTIONS.html2canvas.scale,
      MAX_CANVAS_HEIGHT / height,
      Math.sqrt(MAX_CANVAS_AREA / (width * height)),
    ),
  );
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

const getBattleModelCount = (unit) => {
  const parsedNumber = Number(unit.selectedNumber);
  return Number.isFinite(parsedNumber) && parsedNumber > 0
    ? Math.floor(parsedNumber)
    : 1;
};

const normalizeCampaignNotes = (campaignNotes) => {
  const notes = { ...getDefaultCampaignNotes(), ...(campaignNotes || {}) };

  return {
    ...notes,
    specialRules: normalizeSpecialRules(notes.specialRules),
  };
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
  setMercenaries,
  campaignNotes,
  setCampaignNotes,
  handleSetUnitExp,
  theme,
  includeRulesInPdf,
  setIncludeRulesInPdf,
}) => {
  const [totalCost, setTotalCost] = useState(0);
  const [idShown, setIdShown] = useState(null);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const sidePanelRef = useRef(null);
  const { currentUser } = useContext(AuthContext);
  const [showNewArmyModal, setShowNewArmyModal] = useState(false);
  const [errors, setErrors] = useState(0);
  const [customArmyCost, setCustomArmyCost] = useState(0);
  const [isCustomArmyCost, setIsCustomArmyCost] = useState(false);
  const [standardBearer, setStandardBearer] = useState(null);
  const [musician, setMusician] = useState(null);
  const {
    isEditArmyView,
    setIsEditArmyView,
    isPlayArmyView,
    setIsPlayArmyView,
  } = useContext(EditArmyContext);
  const location = useLocation();

  useEffect(() => {
    setTotalCost(getTotalCost(unitList));
  }, [unitList]);

  useEffect(() => {
    setIsEditArmyView(location.pathname.includes("/edit"));
    setIsPlayArmyView(location.pathname.includes("/play"));
  }, [location, setIsEditArmyView, setIsPlayArmyView]);

  useEffect(() => {
    setPrestige(getPrestige(unitList)[0]);
  });

  // The new-list view shows unit details in the right column; edit and play
  // views still expand them inline under the unit.
  const isSidePanelView = !isEditArmyView && !isPlayArmyView;
  const selectedUnitIndex = isSidePanelView
    ? unitList.findIndex((unit) => unit?.uniqueId === idShown)
    : -1;
  const selectedUnit =
    selectedUnitIndex !== -1 ? unitList[selectedUnitIndex] : null;
  const isSidePanelOpen = isPickerOpen || selectedUnit !== null;

  // Each unit (or the recruitment list) opens scrolled to the top.
  useEffect(() => {
    sidePanelRef.current?.scrollTo?.(0, 0);
  }, [idShown]);

  const handleUnitAdded = (uniqueId) => {
    setIdShown(uniqueId);
  };

  const handleSidePanelBack = () => {
    setIdShown(null);
  };

  const handleSelectUnitFromError = (uniqueId) => {
    setIsPickerOpen(false);
    setIdShown(uniqueId);
  };

  const handleSidePanelClose = () => {
    setIdShown(null);
    setIsPickerOpen(false);
  };

  useEffect(() => {
    if (!isPlayArmyView) {
      return;
    }

    let hasChanges = false;
    const updatedUnits = [...unitList];

    updatedUnits.forEach((unit) => {
      if (!unit || unit.unitName === "") {
        return;
      }

      const modelCount = getBattleModelCount(unit);
      const currentBattleExp = Number(unit.battleExp);
      const currentBattleObled = Number(unit.battleObled);
      const currentObled = Number(unit.obled);

      if (!Number.isFinite(currentBattleExp) || currentBattleExp < 0) {
        unit.battleExp = 0;
        hasChanges = true;
      }

      if (!Number.isFinite(currentBattleObled) || currentBattleObled < 0) {
        unit.battleObled = 0;
        hasChanges = true;
      }

      if (!Number.isFinite(currentObled) || currentObled < 0) {
        unit.obled = 0;
        hasChanges = true;
      }

      const currentStatuses = Array.isArray(unit.battleOutOfActionModels)
        ? unit.battleOutOfActionModels
        : [];

      if (currentStatuses.length !== modelCount) {
        unit.battleOutOfActionModels = Array.from(
          { length: modelCount },
          (_, index) => Boolean(currentStatuses[index]),
        );
        hasChanges = true;
      }
    });

    if (hasChanges) {
      setUnitList(updatedUnits);
    }
  }, [isPlayArmyView, unitList, setUnitList]);

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
        campaignNotes: normalizeCampaignNotes(campaignNotes),
        gameHistory: [],
      };

      if (arrayArmyNames.includes(armyName.trim())) {
        if (
          window.confirm(
            "Rozpiska o podanej nazwie już istnieje. Czy chcesz ją zastąpić?",
          )
        ) {
          const index = arrayOfSavedLists
            .map((item) => item.armyName)
            .indexOf(armyName);
          const existingHistory = Array.isArray(
            arrayOfSavedLists[index]?.gameHistory,
          )
            ? arrayOfSavedLists[index].gameHistory
            : [];
          arrayOfSavedLists[index] = {
            ...armyObj,
            gameHistory: existingHistory,
          };
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

  const handleSavePDFClick = async (e) => {
    e.preventDefault();

    if (errors !== 0) {
      alert("Napraw występujące błędy aby zapisać rozpiskę.");
      return;
    }

    const element = document.getElementById("armylist");
    if (!element) {
      alert("Nie znaleziono widoku do wydruku.");
      return;
    }

    // html2pdf lays the copy out at A4 width; measure page breaks the same way.
    const previousWidth = element.style.width;
    // On phones the sheet is hidden behind a toggle; it must be laid out to
    // measure page breaks and the canvas scale.
    const previousDisplay = element.style.display;
    element.style.display = "block";
    element.style.width = "21cm";
    const removeSpacers = avoidPdfPageBreaks(
      element,
      ".print-rule, .print-equipment-table",
    );
    const options = {
      ...OPTIONS,
      html2canvas: { ...OPTIONS.html2canvas, scale: getPdfScale(element) },
      filename: `${armyName || "Moja rozpiska"}.pdf`,
    };

    try {
      await html2pdf().from(element).set(options).save();
    } catch (err) {
      console.log(err);
      alert("Nie udało się zapisać PDF.");
    } finally {
      removeSpacers();
      element.style.width = previousWidth;
      element.style.display = previousDisplay;
    }
  };

  const handleResetArmyClick = () => {
    if (window.confirm("Czy na pewno chcesz zresetować rozpiskę?")) {
      setUnitList([]);
      setUnitName("");
      setMercenaryUnitName("");
      setArmyName("");
      setCampaignNotes(getDefaultCampaignNotes());
      setStandardBearer(null);
      setMusician(null);
    }
  };

  const resetCampaignNotes = () => {
    setCampaignNotes(getDefaultCampaignNotes());
  };

  const handleCustomArmyCostClick = () => {
    setIsCustomArmyCost(!isCustomArmyCost);
    setCustomArmyCost(0);
  };

  const handleCustomArmyCostChange = (e) => {
    e.preventDefault();
    setCustomArmyCost(e.target.value);
  };

  const finishCampaignBattle = async ({ units, notes, entry }) => {
    if (!currentUser?.user?.uid) return; // Guest campaigns remain in the device draft.
    if (!armyName.trim())
      throw new Error(
        "Nazwij i zapisz kompanię na koncie przed zakończeniem potyczki.",
      );
    const ref = doc(db, "lists", currentUser.user.uid);
    await runTransaction(db, async (transaction) => {
      const snapshot = await transaction.get(ref);
      const lists = [...(snapshot.data()?.lists || [])];
      const index = lists.findIndex(
        (item) =>
          item.armyName === armyName &&
          getArmyName(item.armyType) === army.name,
      );
      if (index === -1)
        throw new Error(
          "Najpierw zapisz kompanię na koncie przyciskiem Zapisz armię.",
        );
      const saved = lists[index];
      if (
        saved.campaignNotes?.campaign?.history?.some((h) => h.id === entry.id)
      )
        return;
      const knownIds = new Set(
        (campaignNotes.campaign?.history || []).map((h) => h.id),
      );
      if (
        (saved.campaignNotes?.campaign?.history || []).some(
          (h) => !knownIds.has(h.id),
        )
      ) {
        throw new Error(
          "Na koncie zapisano nowszą potyczkę. Zachowano lokalną wersję roboczą; uzgodnij zmiany przed zapisem.",
        );
      }
      lists[index] = {
        ...saved,
        armyList: normalizeUnitList(units),
        campaignNotes: notes,
        timestamp: Timestamp.now(),
        totalCost: getTotalCost(units),
        prestige: getPrestige(units)[0],
        gameHistory: [
          ...(saved.gameHistory || []),
          {
            id: entry.id,
            gameName: entry.gameName,
            finishedAt: Timestamp.now(),
            totalExpGained: entry.journal
              .filter((j) => j.type === "experience")
              .reduce((n, j) => n + (j.gained || 0), 0),
            totalObledGained: 0,
            outOfActionModels: [],
            unitResults: [],
            campaignEntryId: entry.id,
          },
        ],
      };
      transaction.update(ref, { lists });
    });
  };

  return (
    <CommandContext.Provider
      value={{ standardBearer, setStandardBearer, musician, setMusician }}
    >
      <div className="builder">
        {isPlayArmyView && (
          <CampaignManager
            unitList={unitList}
            setUnitList={setUnitList}
            army={army}
            campaignNotes={campaignNotes}
            setCampaignNotes={setCampaignNotes}
            onFinish={finishCampaignBattle}
          />
        )}
        <div className="builder-header">
          <div className="builder-header-main">
            <div className="builder-identity">
              <input
                className="builder-name-input"
                type="text"
                value={armyName}
                onChange={(e) => setArmyName(e.target.value)}
                placeholder="Nazwij kompanię…"
                aria-label="Nazwa kompanii"
              />
              {isSidePanelView && (
                <ArmySelect
                  army={army}
                  setArmy={setArmy}
                  setUnitList={setUnitList}
                  setUnitName={setUnitName}
                  setIdShown={setIdShown}
                  setMercenaryUnitName={setMercenaryUnitName}
                  setMercenaries={setMercenaries}
                  resetCampaignNotes={resetCampaignNotes}
                />
              )}
              {isEditArmyView && (
                <UnitSelect
                  army={army}
                  setUnitName={setUnitName}
                  unitName={unitName}
                  unitList={unitList}
                  setUnitList={setUnitList}
                />
              )}
            </div>

            <div className="builder-header-actions">
              <HeaderMenu label="PDF" icon="fa-solid fa-file-pdf" showCaret>
                {(close) => (
                  <>
                    <label className="header-menu-item header-menu-check">
                      <input
                        type="checkbox"
                        checked={Boolean(includeRulesInPdf)}
                        onChange={(e) => setIncludeRulesInPdf(e.target.checked)}
                      />
                      Dołącz zasady
                    </label>
                    <hr className="header-menu-separator" />
                    <button
                      type="button"
                      className="header-menu-item"
                      onClick={(e) => {
                        close();
                        handleSavePDFClick(e);
                      }}
                    >
                      <i
                        className="fa-solid fa-download"
                        aria-hidden="true"
                      ></i>
                      Zapisz PDF
                    </button>
                  </>
                )}
              </HeaderMenu>
              {currentUser && (
                <button type="button" className="button" onClick={saveArmy}>
                  <i className="fa-solid fa-floppy-disk" aria-hidden="true"></i>
                  Zapisz armię
                </button>
              )}
              {(isSidePanelView || !isPlayArmyView) && (
                <HeaderMenu
                  icon="fa-solid fa-ellipsis-vertical"
                  ariaLabel="Więcej opcji"
                  buttonClassName="button button-secondary button-icon"
                >
                  {(close) => (
                    <>
                      {isSidePanelView && (
                        <>
                          <label className="header-menu-item header-menu-check">
                            <input
                              type="checkbox"
                              checked={isCustomArmyCost}
                              onChange={handleCustomArmyCostClick}
                            />
                            Własny limit ZK
                          </label>
                          {isCustomArmyCost && (
                            <label className="header-menu-field">
                              Startowa liczba ZK
                              <input
                                type="text"
                                inputMode="numeric"
                                value={customArmyCost || ""}
                                onChange={handleCustomArmyCostChange}
                              />
                            </label>
                          )}
                        </>
                      )}
                      {isSidePanelView && !isPlayArmyView && (
                        <hr className="header-menu-separator" />
                      )}
                      {!isPlayArmyView && (
                        <button
                          type="button"
                          className="header-menu-item is-danger"
                          onClick={() => {
                            close();
                            handleResetArmyClick();
                          }}
                        >
                          <i
                            className="fa-solid fa-rotate-left"
                            aria-hidden="true"
                          ></i>
                          Resetuj armię
                        </button>
                      )}
                    </>
                  )}
                </HeaderMenu>
              )}
            </div>
          </div>

          <ArmyInfo
            prestige={prestige}
            totalCost={totalCost}
            army={army}
            isCustomArmyCost={isCustomArmyCost}
            customArmyCost={customArmyCost}
            unitList={unitList}
            errors={errors}
            setErrors={setErrors}
            onSelectUnit={handleSelectUnitFromError}
          />
        </div>

        <div
          className={`main-builder-container${
            isSidePanelView ? " has-side-panel" : ""
          }`}
        >
          <div className="side-builder-left">
            {isSidePanelView && (
              <button
                className="button side-panel-open-button"
                onClick={() => setIsPickerOpen(true)}
              >
                + Dodaj jednostkę
              </button>
            )}
            {isSidePanelView && unitList.length === 0 && (
              <div className="unit-list-empty">
                <i className="fa-solid fa-shield-halved"></i>
                <p className="unit-list-empty-title">Kompania jest pusta</p>
                <p>Wybierz jednostki z listy obok, aby je dodać.</p>
              </div>
            )}
            {!(
              isPlayArmyView && campaignNotes.campaign?.activeBattle?.post
            ) && (
              <UnitList
                unitList={unitList}
                setUnitList={setUnitList}
                idShown={idShown}
                setIdShown={setIdShown}
                heroes={army?.heroes}
                handleSetUnitExp={handleSetUnitExp}
                army={army}
                showDetailsInline={!isSidePanelView}
                campaign={campaignNotes.campaign}
              />
            )}
            {isEditArmyView && (
              <CampaignPointsEditor
                army={army}
                campaignNotes={campaignNotes}
                setCampaignNotes={setCampaignNotes}
              />
            )}
          </div>

          {isSidePanelView && (
            <aside
              ref={sidePanelRef}
              className={`side-builder-right${
                isSidePanelOpen ? " is-open" : ""
              }`}
            >
              <div className="side-panel-bar">
                <div className="side-panel-bar-nav">
                  {selectedUnit && (
                    <button
                      type="button"
                      className="side-panel-back"
                      onClick={handleSidePanelBack}
                    >
                      <i
                        className="fa-solid fa-arrow-left"
                        aria-hidden="true"
                      ></i>
                      Dodaj jednostki
                    </button>
                  )}
                  <button
                    type="button"
                    className="side-panel-close"
                    onClick={handleSidePanelClose}
                  >
                    <i className="fa-solid fa-xmark" aria-hidden="true"></i>
                    Wróć do kompanii
                  </button>
                </div>
                {selectedUnit ? (
                  <UnitDetailsHeader unit={selectedUnit} />
                ) : (
                  <h2 className="side-panel-title">Rekrutacja</h2>
                )}
              </div>

              {selectedUnit ? (
                <UnitDetails
                  key={selectedUnit.uniqueId}
                  heroes={army?.heroes}
                  unit={selectedUnit}
                  unitIndex={selectedUnitIndex}
                  unitList={unitList}
                  setUnitList={setUnitList}
                  handleSetUnitExp={handleSetUnitExp}
                  army={army}
                />
              ) : (
                <UnitPicker
                  army={army}
                  unitList={unitList}
                  setUnitList={setUnitList}
                  onUnitAdded={handleUnitAdded}
                />
              )}
            </aside>
          )}
        </div>
      </div>

      <Modal showModal={showNewArmyModal} setShowModal={setShowNewArmyModal} />
    </CommandContext.Provider>
  );
};

export default Builder;
