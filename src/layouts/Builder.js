import { getArmyName } from "../Data.js/RulebookNames";
import React, {
  useContext,
  useEffect,
  useRef,
  useState,
  createContext,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { doc, getDoc, Timestamp, updateDoc } from "firebase/firestore";
import html2pdf from "html2pdf.js";
import { avoidPdfPageBreaks } from "../Functions/avoidPdfPageBreaks";
import "@sweetalert2/themes/bootstrap-4";
import ArmySelect from "../Components/ArmySelect";
import ArmyInfo from "../Components/ArmyInfo";
import CampaignPointsEditor from "../Components/CampaignPointsEditor";
import Modal from "../Components/Modal";
import UnitDetails from "../Components/UnitDetails";
import UnitSelect from "./UnitSelect";
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

const getDisplayUnitLabel = (unit) => {
  const displayName =
    typeof unit.unitDisplayName === "string" ? unit.unitDisplayName.trim() : "";

  if (displayName.length > 0 && displayName !== unit.unitName) {
    return `${unit.unitName} (${displayName})`;
  }

  return unit.unitName;
};

const getDefaultBattleName = () => {
  return `Bitwa ${new Date().toLocaleString("pl-PL")}`;
};

const buildBattleSummary = (unitList) => {
  const updatedUnits = [];
  const outOfActionModels = [];
  const unitResults = [];
  let totalExpGained = 0;
  let totalObledGained = 0;

  unitList.forEach((unit) => {
    if (!unit || unit.unitName === "") {
      return;
    }

    const battleExp = Math.max(0, Number(unit.battleExp) || 0);
    const battleObled = Math.max(0, Number(unit.battleObled) || 0);
    const modelCount = getBattleModelCount(unit);
    const statuses = Array.isArray(unit.battleOutOfActionModels)
      ? unit.battleOutOfActionModels
      : Array.from({ length: modelCount }, () => false);
    const unitLabel = getDisplayUnitLabel(unit);

    const modelResults = Array.from({ length: modelCount }, (_, index) => {
      const modelLabel =
        modelCount > 1 ? `${unitLabel} #${index + 1}` : unitLabel;
      const isOutOfAction = Boolean(statuses[index]);

      if (isOutOfAction) {
        outOfActionModels.push(modelLabel);
      }

      return {
        modelNumber: index + 1,
        modelLabel,
        isOutOfAction,
      };
    });

    totalExpGained += battleExp;
    totalObledGained += battleObled;

    const outOfActionCount = modelResults.filter(
      (modelResult) => modelResult.isOutOfAction,
    ).length;
    const remainingModels = Math.max(modelCount - outOfActionCount, 0);

    unitResults.push({
      unitLabel,
      gainedExp: battleExp,
      gainedObled: battleObled,
      outOfActionCount,
      remainingModels,
      modelResults,
    });

    if (remainingModels <= 0) {
      return;
    }

    unit.exp = (Number(unit.exp) || 0) + battleExp;
    unit.obled = (Number(unit.obled) || 0) + battleObled;
    unit.selectedNumber = remainingModels;
    unit.totalCost = (Number(unit.cost) || 0) * remainingModels;
    unit.battleExp = 0;
    unit.battleObled = 0;
    unit.battleOutOfActionModels = Array.from(
      { length: remainingModels },
      () => false,
    );

    updatedUnits.push(unit);
  });

  return {
    updatedUnits,
    summary: {
      totalExpGained,
      totalObledGained,
      outOfActionModels,
      unitResults,
    },
  };
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
  const navigate = useNavigate();
  const [showBattleModal, setShowBattleModal] = useState(false);
  const [battleModalStep, setBattleModalStep] = useState("confirm");
  const [battleSummary, setBattleSummary] = useState(null);
  const [isFinishingBattle, setIsFinishingBattle] = useState(false);
  const [battleSaveError, setBattleSaveError] = useState("");
  const [battleName, setBattleName] = useState("");

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

  const handleEndBattleClick = () => {
    setBattleModalStep("confirm");
    setBattleSummary(null);
    setBattleSaveError("");
    setBattleName(getDefaultBattleName());
    setShowBattleModal(true);
  };

  const handleCancelBattleModal = () => {
    if (isFinishingBattle) {
      return;
    }
    setShowBattleModal(false);
  };

  const saveBattleHistory = async (updatedUnits, summary, gameName) => {
    if (!currentUser?.user?.uid || armyName.trim().length === 0) {
      throw new Error("Brak danych do zapisu historii bitwy.");
    }

    const userListsRef = doc(db, "lists", currentUser.user.uid);
    const savedListsDoc = await getDoc(userListsRef);
    const savedListsData = savedListsDoc.data();
    const arrayOfSavedLists = Array.isArray(savedListsData?.lists)
      ? [...savedListsData.lists]
      : [];
    const listIndex = arrayOfSavedLists.findIndex(
      (item) => item.armyName === armyName && getArmyName(item.armyType) === army.name,
    );

    if (listIndex === -1) {
      throw new Error("Nie znaleziono rozpiski do aktualizacji historii.");
    }

    const selectedList = arrayOfSavedLists[listIndex];
    const currentHistory = Array.isArray(selectedList.gameHistory)
      ? selectedList.gameHistory
      : [];

    const historyEntry = {
      finishedAt: Timestamp.now(),
      gameName,
      totalExpGained: summary.totalExpGained,
      totalObledGained: summary.totalObledGained,
      outOfActionModels: summary.outOfActionModels,
      unitResults: summary.unitResults.map((unitResult) => ({
        unitLabel: unitResult.unitLabel,
        gainedExp: unitResult.gainedExp,
        gainedObled: unitResult.gainedObled,
        modelResults: unitResult.modelResults.map((modelResult) => ({
          modelNumber: modelResult.modelNumber,
          modelLabel: modelResult.modelLabel,
          isOutOfAction: modelResult.isOutOfAction,
        })),
      })),
    };

    const updatedPrestige = getPrestige(updatedUnits)[0];
    const updatedCost = getTotalCost(updatedUnits);

    arrayOfSavedLists[listIndex] = {
      ...selectedList,
      armyType: army.name,
      armyList: normalizeUnitList(updatedUnits),
      timestamp: Timestamp.now(),
      totalCost: updatedCost,
      prestige: updatedPrestige,
      campaignNotes: normalizeCampaignNotes(campaignNotes),
      gameHistory: [...currentHistory, historyEntry],
    };

    await updateDoc(userListsRef, {
      lists: arrayOfSavedLists,
    });
  };

  const handleConfirmEndBattle = async () => {
    if (isFinishingBattle) {
      return;
    }

    setIsFinishingBattle(true);
    setBattleSaveError("");
    const normalizedBattleName = battleName.trim() || getDefaultBattleName();

    const { updatedUnits, summary } = buildBattleSummary(unitList);
    setUnitList(updatedUnits);

    if (currentUser?.user?.uid && armyName.trim().length > 0) {
      try {
        await saveBattleHistory(updatedUnits, summary, normalizedBattleName);
      } catch (err) {
        console.log(err);
        setBattleSaveError(
          "Nie udało się zapisać historii bitwy. Możesz nadal zapisać armię ręcznie.",
        );
      }
    } else {
      setBattleSaveError(
        "Brak zalogowanego użytkownika lub nazwy rozpiski. Historia nie została zapisana.",
      );
    }

    setBattleSummary({
      ...summary,
      gameName: normalizedBattleName,
    });
    setBattleModalStep("summary");
    setIsFinishingBattle(false);
  };

  const handleCloseBattleSummary = () => {
    setShowBattleModal(false);
    setBattleModalStep("confirm");
    navigate("/myLists");
  };

  return (
    <CommandContext.Provider
      value={{ standardBearer, setStandardBearer, musician, setMusician }}
    >
      <div className="builder">
        <div className="builder-header">
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
            theme={theme}
          />

          <div className="builder-header-actions">
            {isSidePanelView && (
              <div className="builder-custom-cost">
                <label>
                  <input
                    type="checkbox"
                    onClick={handleCustomArmyCostClick}
                  ></input>
                  Własny limit ZK
                </label>
                {isCustomArmyCost && (
                  <input
                    type="text"
                    inputMode="numeric"
                    onChange={handleCustomArmyCostChange}
                    aria-label="Startowa liczba ZK"
                  />
                )}
              </div>
            )}
            {!isPlayArmyView && (
              <button
                className="button button-ghost"
                onClick={handleResetArmyClick}
              >
                Resetuj
              </button>
            )}
            <label
              className="builder-pdf-rules"
              title="Dołącz do PDF opisy zasad postaci, ekwipunku i zaklęć"
            >
              <input
                type="checkbox"
                checked={Boolean(includeRulesInPdf)}
                onChange={(e) => setIncludeRulesInPdf(e.target.checked)}
              />
              Zasady w PDF
            </label>
            <button
              className="button button-secondary"
              onClick={handleSavePDFClick}
            >
              <i className="fa-solid fa-file-pdf"></i> Zapisz PDF
            </button>
            {isPlayArmyView && (
              <button className="button" onClick={handleEndBattleClick}>
                Zakończ bitwę
              </button>
            )}
            {currentUser && (
              <button className="button" onClick={saveArmy}>
                <i className="fa-solid fa-floppy-disk"></i> Zapisz armię
              </button>
            )}
          </div>
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
            <UnitList
              unitList={unitList}
              setUnitList={setUnitList}
              idShown={idShown}
              setIdShown={setIdShown}
              heroes={army?.heroes}
              handleSetUnitExp={handleSetUnitExp}
              army={army}
              showDetailsInline={!isSidePanelView}
            />
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
                {selectedUnit ? (
                  <button
                    className="side-panel-back"
                    onClick={handleSidePanelBack}
                  >
                    <i className="fa-solid fa-arrow-left"></i> Dodaj jednostki
                  </button>
                ) : (
                  <span className="side-panel-title">Rekrutacja</span>
                )}
                <button
                  className="side-panel-close"
                  onClick={handleSidePanelClose}
                  aria-label="Zamknij"
                >
                  ×
                </button>
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

      {showBattleModal && (
        <div className="battle-end-modal-overlay">
          <div className="battle-end-modal">
            {battleModalStep === "confirm" ? (
              <>
                <h3>Zakończyć bitwę?</h3>
                <p>
                  Ta akcja doda zdobyte PD i Obłęd do modeli oraz zapisze
                  historię bitwy.
                </p>
                <div className="battle-end-name-field">
                  <label htmlFor="battle-name-input" className="bold-text">
                    Nazwa bitwy
                  </label>
                  <input
                    id="battle-name-input"
                    type="text"
                    value={battleName}
                    onChange={(e) => setBattleName(e.target.value)}
                    placeholder="Np. Bitwa o Most Czaszek"
                  />
                </div>
                <div className="battle-end-modal-actions">
                  <button className="button" onClick={handleCancelBattleModal}>
                    Anuluj
                  </button>
                  <button
                    className="button"
                    onClick={handleConfirmEndBattle}
                    disabled={
                      isFinishingBattle || battleName.trim().length === 0
                    }
                  >
                    {isFinishingBattle
                      ? "Zapisywanie..."
                      : "Potwierdź zakończenie"}
                  </button>
                </div>
              </>
            ) : (
              <>
                <h3>Bitwa zakończona</h3>
                <div className="battle-end-summary">
                  <p>
                    <span className="bold-text">Nazwa bitwy:</span>{" "}
                    {battleSummary?.gameName || "-"}
                  </p>
                  <p>
                    <span className="bold-text">Zdobyte PD:</span>{" "}
                    {battleSummary?.totalExpGained || 0}
                  </p>
                  <p>
                    <span className="bold-text">Zdobyty Obłęd:</span>{" "}
                    {battleSummary?.totalObledGained || 0}
                  </p>

                  <div className="battle-end-summary-section">
                    <p className="bold-text">Modele WzA:</p>
                    {battleSummary?.outOfActionModels?.length ? (
                      <ul className="battle-end-list">
                        {battleSummary.outOfActionModels.map(
                          (modelLabel, index) => (
                            <li key={`${modelLabel}-${index}`}>{modelLabel}</li>
                          ),
                        )}
                      </ul>
                    ) : (
                      <p>Brak modeli WzA.</p>
                    )}
                  </div>

                  <div className="battle-end-summary-section">
                    <p className="bold-text">Podsumowanie jednostek:</p>
                    <div className="battle-end-units">
                      {(battleSummary?.unitResults || []).map(
                        (unitResult, index) => {
                          const unitOutOfActionModels =
                            unitResult.modelResults.filter(
                              (modelResult) => modelResult.isOutOfAction,
                            );
                          return (
                            <div
                              className="battle-end-unit-row"
                              key={`${unitResult.unitLabel}-${index}`}
                            >
                              <p className="bold-text">
                                {unitResult.unitLabel}
                              </p>
                              <p>
                                {`PD: +${unitResult.gainedExp} | Obłęd: +${unitResult.gainedObled}`}
                              </p>
                              <p>
                                {unitOutOfActionModels.length > 0
                                  ? `WzA: ${unitOutOfActionModels
                                      .map(
                                        (modelResult) => modelResult.modelLabel,
                                      )
                                      .join(", ")}`
                                  : "WzA: brak"}
                              </p>
                            </div>
                          );
                        },
                      )}
                    </div>
                  </div>

                  {battleSaveError.length > 0 && (
                    <p className="battle-end-error">{battleSaveError}</p>
                  )}
                </div>
                <button className="button" onClick={handleCloseBattleSummary}>
                  Zamknij i przejdź do moich rozpisek
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </CommandContext.Provider>
  );
};

export default Builder;
