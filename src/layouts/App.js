import React, { useState, useContext, useEffect, createContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Builder from "./Builder";
import useCampaignDraft from "../campaign/useCampaignDraft";
import ArmyList from "../Components/ArmyList";
import Register from "../Registration/Register";
import Login from "../Registration/Login";
import armies from "../Data.js/Armies";
import { AuthContext } from "../Context/AuthContext";
import UserDashboard from "../Components/UserDashboard";
import MyLists from "../User/MyLists";
import Header from "./Header";
import { mercenariesList } from "../Data.js/Mercenaries";
import { filterMercenaries } from "../Functions/filterMercenaries";
import useLocalStorage from "use-local-storage";
import "../index.css";

export const EditArmyContext = createContext();

const DEFAULT_CAMPAIGN_NOTES = {
  determinacja: "",
  gniew: "",
  odpornosc: "",
  specialRules: [],
  kosztownosci: "",
  skarbiec: "",
};

export const getDefaultCampaignNotes = () => ({ ...DEFAULT_CAMPAIGN_NOTES });

const App = () => {
  const RequireAuth = ({ children }) => {
    return currentUser ? children : <Navigate to="/login"></Navigate>;
  };
  const { currentUser } = useContext(AuthContext);
  const [draft, setDraftField, storageError] = useCampaignDraft(
    currentUser?.user?.uid || "guest",
  );
  const unitList = draft.unitList;
  const army = draft.army;
  const armyName = draft.armyName;
  const campaignNotes = {
    ...getDefaultCampaignNotes(),
    ...draft.campaignNotes,
  };
  const setUnitList = React.useCallback(
    (value) => setDraftField("unitList", value),
    [setDraftField],
  );
  const setArmy = React.useCallback(
    (value) => setDraftField("army", value),
    [setDraftField],
  );
  const setArmyName = React.useCallback(
    (value) => setDraftField("armyName", value),
    [setDraftField],
  );
  const setCampaignNotes = React.useCallback(
    (value) => setDraftField("campaignNotes", value),
    [setDraftField],
  );
  const [unitName, setUnitName] = useState("");
  const [mercenaries, setMercenaries] = useState(() =>
    filterMercenaries(mercenariesList, armies[army]),
  );
  const [mercenaryUnitName, setMercenaryUnitName] = useState("");
  const [prestige, setPrestige] = useState(0);
  const [showPrintPreview, setShowPrintPreview] = useState(false);
  const defaultDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const [theme, setTheme] = useLocalStorage(
    "theme",
    defaultDark ? "dark" : "light",
  );

  const [includeRulesInPdf, setIncludeRulesInPdf] = useLocalStorage(
    "includeRulesInPdf",
    false,
  );

  const [isEditArmyView, setIsEditArmyView] = useState(false);
  const [isPlayArmyView, setIsPlayArmyView] = useState(false);

  const handleSwitchTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const newUnitList = [...unitList];

  const numberOfHeroes = newUnitList.filter((x) => x.type === "Bohater").length;

  // const allRules = [];

  // for (const [key, value1] of Object.entries(armies)) {
  //   for (const [key, value] of Object.entries(value1.heroes)) {
  //     value.rules.forEach((rule) => allRules.push(rule));
  //   }
  // }

  // const uniqueAllRulesArray = [...new Set(allRules)];

  // const filteredElements = uniqueAllRulesArray.filter(
  //   (e) =>
  //     e.includes("Łuskowata") ||
  //     e.includes("Mag (") ||
  //     e.includes("Duchowny") ||
  //     e.includes("Odporność na magię")
  // );

  const handleSetUnitExp = (unitId, exp) => {
    const newUnitList = [...unitList];
    newUnitList.find((unit) => unit.uniqueId === unitId).exp = exp;
    setUnitList([...newUnitList]);
  };

  useEffect(() => {
    setMercenaries(filterMercenaries(mercenariesList, armies[army]));
  }, [army]);

  for (let i = 0; i < 6 - numberOfHeroes; i++) {
    newUnitList.push({
      unitName: "",
      unitDisplayName: "",
      id: 1000,
      optionalEquipment: [],
      cost: 0,
      totalCost: 0,
      startingEquipment: [],
      stats: {
        Początkowa: ["", "", "", "", "", "", "", "", ""],
        Maksymalna: ["", "", "", "", "", "", "", "", ""],
      },
      rules: [],
      exp: "",
      skills: [""],
      injuries: [],
      type: "Bohater",
      number: "",
      selectedNumber: "",
    });
  }

  const numberOfHenchmen = newUnitList.filter(
    (unit) =>
      unit.type === "Stronnik" ||
      unit.type === "Machina" ||
      unit.type === "Najemne Ostrze",
  ).length;

  for (let i = 0; i < 7 - numberOfHenchmen; i++) {
    newUnitList.push({
      unitName: "",
      unitDisplayName: "",
      id: 1000,
      optionalEquipment: [],
      cost: 0,
      totalCost: 0,
      startingEquipment: [],
      stats: {
        Początkowa: ["", "", "", "", "", "", "", "", ""],
        Maksymalna: ["", "", "", "", "", "", "", "", ""],
      },
      rules: [],
      exp: "",
      skills: [""],
      type: "Stronnik",
      number: "  ",
      selectedNumber: "  ",
    });
  }

  return (
    <div className="app" id="app" data-theme={theme}>
      <EditArmyContext.Provider
        value={{
          isEditArmyView,
          setIsEditArmyView,
          isPlayArmyView,
          setIsPlayArmyView,
        }}
      >
        <main className="site-wrapper">
          {storageError && <p role="alert">{storageError}</p>}
          <Router>
            <Header handleSwitchTheme={handleSwitchTheme} theme={theme} />
            <Routes>
              <Route
                path="/"
                element={
                  <Builder
                    unitList={unitList}
                    setUnitList={setUnitList}
                    army={armies[army]}
                    setArmy={setArmy}
                    unitName={unitName}
                    setUnitName={setUnitName}
                    mercenaries={mercenaries}
                    setMercenaries={setMercenaries}
                    mercenaryUnitName={mercenaryUnitName}
                    setMercenaryUnitName={setMercenaryUnitName}
                    prestige={prestige}
                    setPrestige={setPrestige}
                    setArmyName={setArmyName}
                    armyName={armyName}
                    campaignNotes={campaignNotes}
                    setCampaignNotes={setCampaignNotes}
                    handleSetUnitExp={handleSetUnitExp}
                    theme={theme}
                    includeRulesInPdf={includeRulesInPdf}
                    setIncludeRulesInPdf={setIncludeRulesInPdf}
                  />
                }
              />
              <Route
                path="/edit"
                element={
                  <Builder
                    unitList={unitList}
                    setUnitList={setUnitList}
                    army={armies[army]}
                    setArmy={setArmy}
                    unitName={unitName}
                    setUnitName={setUnitName}
                    mercenaries={mercenaries}
                    setMercenaries={setMercenaries}
                    mercenaryUnitName={mercenaryUnitName}
                    setMercenaryUnitName={setMercenaryUnitName}
                    prestige={prestige}
                    setPrestige={setPrestige}
                    setArmyName={setArmyName}
                    armyName={armyName}
                    campaignNotes={campaignNotes}
                    setCampaignNotes={setCampaignNotes}
                    handleSetUnitExp={handleSetUnitExp}
                    theme={theme}
                    includeRulesInPdf={includeRulesInPdf}
                    setIncludeRulesInPdf={setIncludeRulesInPdf}
                  />
                }
              />
              <Route
                path="/play"
                element={
                  <Builder
                    unitList={unitList}
                    setUnitList={setUnitList}
                    army={armies[army]}
                    setArmy={setArmy}
                    unitName={unitName}
                    setUnitName={setUnitName}
                    mercenaries={mercenaries}
                    setMercenaries={setMercenaries}
                    mercenaryUnitName={mercenaryUnitName}
                    setMercenaryUnitName={setMercenaryUnitName}
                    prestige={prestige}
                    setPrestige={setPrestige}
                    setArmyName={setArmyName}
                    armyName={armyName}
                    campaignNotes={campaignNotes}
                    setCampaignNotes={setCampaignNotes}
                    handleSetUnitExp={handleSetUnitExp}
                    theme={theme}
                    includeRulesInPdf={includeRulesInPdf}
                    setIncludeRulesInPdf={setIncludeRulesInPdf}
                  />
                }
              />

              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route
                path="/userDashboard"
                element={
                  <RequireAuth>
                    <UserDashboard />
                  </RequireAuth>
                }
              />
              <Route
                path="/myLists"
                element={
                  <RequireAuth>
                    <MyLists
                      setUnitList={setUnitList}
                      setArmy={setArmy}
                      setArmyName={setArmyName}
                      setCampaignNotes={setCampaignNotes}
                    />
                  </RequireAuth>
                }
              />
            </Routes>
          </Router>
        </main>
      </EditArmyContext.Provider>
      <div className={`armylist-shell${showPrintPreview ? " is-open" : ""}`}>
        <button
          type="button"
          className="armylist-toggle"
          aria-expanded={showPrintPreview}
          onClick={() => setShowPrintPreview((v) => !v)}
        >
          {showPrintPreview ? "Ukryj kartę do druku" : "Pokaż kartę do druku"}
        </button>
      <div id="armylist">
        <ArmyList
          unitList={newUnitList}
          heroes={armies?.[army]?.heroes}
          unitName={unitName}
          setUnitList={setUnitList}
          army={armies?.[army]}
          prestige={prestige}
          armyName={armyName}
          campaignNotes={campaignNotes}
          includeRules={includeRulesInPdf}
        />
      </div>
      </div>
    </div>
  );
};

export default App;
