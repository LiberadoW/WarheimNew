import React, { useState, useContext, useRef } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Builder from "./Builder";
import ArmyList from "../Components/ArmyList";
import useShareStatesBetweenTabs from "react-share-states-between-tabs";
import Register from "../Registration/Register";
import Login from "../Registration/Login";
import armies from "../Data.js/Armies";
import { AuthContext } from "../Context/AuthContext";
import UserDashboard from "../Components/UserDashboard";
import MyLists from "../User/MyLists";

const App = () => {
  const RequireAuth = ({ children }) => {
    return currentUser ? children : <Navigate to="/login"></Navigate>;
  };
  const [unitList, setUnitList] = useShareStatesBetweenTabs("unitList", []);
  const [army, setArmy] = useShareStatesBetweenTabs(
    "army",
    window.localStorage.hasOwnProperty("army")
      ? JSON.parse(window.localStorage.getItem("army"))
      : "Cyrkowcy z Ligii Ostermarku"
  );

  const { currentUser } = useContext(AuthContext);

  const [unitName, setUnitName] = useState("");
  const [mercenaryUnitName, setMercenaryUnitName] = useState("");
  const [prestige, setPrestige] = useShareStatesBetweenTabs("prestige", 0);
  const [armyName, setArmyName] = useShareStatesBetweenTabs("army-name", "");
  const newUnitList = [...unitList];

  const numberOfHeroes = newUnitList.filter((x) => x.type === "Bohater").length;

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
    <div className="app">
      <main className="site-wrapper">
        <Router>
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
                  mercenaryUnitName={mercenaryUnitName}
                  setMercenaryUnitName={setMercenaryUnitName}
                  prestige={prestige}
                  setPrestige={setPrestige}
                  setArmyName={setArmyName}
                  armyName={armyName}
                />
              }
            />
            <Route
              path="/armylist"
              element={
                <ArmyList
                  unitList={newUnitList}
                  heroes={armies[army].heroes}
                  unitName={unitName}
                  setUnitList={setUnitList}
                  army={armies[army]}
                  prestige={prestige}
                  armyName={armyName}
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
    </div>
  );
};

export default App;
