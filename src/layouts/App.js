import React, { useState, useContext, useEffect, createContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import Builder from "./Builder";
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

const App = () => {
  const RequireAuth = ({ children }) => {
    return currentUser ? children : <Navigate to="/login"></Navigate>;
  };
  const [unitList, setUnitList] = useState([]);
  const [army, setArmy] = useState("Cyrkowcy z Ligii Ostermarku");
  const { currentUser } = useContext(AuthContext);
  const [unitName, setUnitName] = useState("");
  const [mercenaries, setMercenaries] = useState(() =>
    filterMercenaries(mercenariesList, armies[army])
  );
  const [mercenaryUnitName, setMercenaryUnitName] = useState("");
  const [prestige, setPrestige] = useState(0);
  const [armyName, setArmyName] = useState("");
  const defaultDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const [theme, setTheme] = useLocalStorage(
    "theme",
    defaultDark ? "dark" : "light"
  );

  const [isEditArmyView, setIsEditArmyView] = useState(false);

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
      unit.type === "Najemne Ostrze"
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
      <EditArmyContext.Provider value={{ isEditArmyView, setIsEditArmyView }}>
        <main className="site-wrapper">
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
                    handleSetUnitExp={handleSetUnitExp}
                    theme={theme}
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
                    handleSetUnitExp={handleSetUnitExp}
                    theme={theme}
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
                    />
                  </RequireAuth>
                }
              />
            </Routes>
          </Router>
        </main>
      </EditArmyContext.Provider>
      <div id="armylist">
        <ArmyList
          unitList={newUnitList}
          heroes={armies?.[army]?.heroes}
          unitName={unitName}
          setUnitList={setUnitList}
          army={armies?.[army]}
          prestige={prestige}
          armyName={armyName}
        />
      </div>
    </div>
  );
};

export default App;
