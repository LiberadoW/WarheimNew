import React, { useEffect, useState } from "react";
import Header from "./Header";
import ArmySelect from "../Components/ArmySelect";
import UnitSelect from "./UnitSelect";
import UnitList from "./UnitList";
import UnitTable from "../Components/UnitTable";
import "../styles/Builder.css";
import { getPrestige } from "../Functions/getPrestige";
import { getOneOfChoices } from "../Functions/getOneOfChoices";
import MercenariesSelect from "./MercenariesSelect";
import { mercenaries } from "../Data.js/Mercenaries";
import ArmyInfo from "../Components/ArmyInfo";
import UnitInfo from "../Components/UnitInfo";

export const heroEquipment = {
  witchHunters: [
    {
      "Broń wielka": [10, 0],
      "Buława/Maczuga/Młot bojowy": [5, 0],
      "Gwiazda zaranna": [5, 0],
      "Kadzielnica Ognia": [20, 0],
      Miecz: [10, 0],
      Sztylet: [2, 0],
      "Topór bojowy/Nadziak": [5, 0],
      "Broń miotana": [10, 1],
      Kusza: [25, 1],
      Pistolet: [10, 1],
      "Pistolet pojedynkowy": [20, 1],
      "Pistolet strzałkowy": [20, 1],
      Lekki: [5, 2, "Zbroja"],
      Średni: [15, 2, "Zbroja"],
      Ciężki: [30, 2, "Zbroja"],
      Puklerz: [3, 2, "Tarcza"],
      Tarcza: [5, 2, "Tarcza"],
      Hełm: [5, 2],
    },
    {
      "Broń wielka": [10, 0],
      "Buława/Maczuga/Młot bojowy": [5, 0],
      "Cep bojowy": [10, 0],
      "Gwiazda zaranna": [5, 0],
      Korbacz: [5, 0],
      Sztylet: [2, 0],
      "Broń miotana": [10, 1],
      Łuk: [10, 1],
      "Łuk długi": [20, 1],
      Oszczep: [15, 1],
      Proca: [5, 1],
      Sieć: [10, 1],
      Lekki: [5, 2, "Zbroja"],
      Średni: [15, 2, "Zbroja"],
      Puklerz: [3, 2, "Tarcza"],
      Tarcza: [5, 2, "Tarcza"],
      Hełm: [5, 2],
    },
    {
      "Broń wielka": [10, 0],
      Bicz: [15, 0],
      "Buława/Maczuga/Młot bojowy": [5, 0],
      "Cep bojowy": [10, 0],
      "Gwiazda zaranna": [5, 0],
      "Kadzielnica Ognia": [20, 0],
      Korbacz: [5, 0],
    },
    {
      "Broń wielka": [10, 0],
      "Buława/Maczuga/Młot bojowy": [5, 0],
      Kopia: [30, 0],
      Miecz: [10, 0],
      Sztylet: [2, 0],
      Włócznia: [10, 0],
      "Broń miotana": [10, 1],
      Lekki: [5, 2, "Zbroja"],
      Średni: [15, 2, "Zbroja"],
      Puklerz: [3, 2, "Tarcza"],
      Tarcza: [5, 2, "Tarcza"],
      Hełm: [5, 2],
    },
    {
      "Broń wielka": [10, 0],
      "Buława/Maczuga/Młot bojowy": [5, 0],
      "Młot ulrykański": [15, 0],
      Sztylet: [2, 0],
      "Broń miotana": [10, 1],
      Pistolet: [10, 1],
      "Pistolet pojedynkowy": [20, 1],
      Lekki: [5, 2, "Zbroja"],
      Średni: [15, 2, "Zbroja"],
      Ciężki: [30, 2, "Zbroja"],
      Puklerz: [3, 2, "Tarcza"],
      Tarcza: [5, 2, "Tarcza"],
    },
  ],
  cyrkowcy: {
    Bohaterowie: {
      "Broń wielka": [10, 0],
      Bicz: [15, 0],
      "Buława/Maczuga/Młot bojowy": [5, 0],
      Kostur: [5, 0],
      Łapacz: [10, 0],
      Miecz: [10, 0],
      Sztylet: [2, 0],
      "Topór bojowy/Nadziak": [5, 0],
      Włócznia: [10, 0],
      "Broń miotana": [10, 1],
      Kusza: [25, 1],
      Pistolet: [10, 1],
      "Pistolet pojedynkowy": [20, 1],
      Lekki: [5, 2, "Zbroja"],
      Średni: [15, 2, "Zbroja"],
      Ciężki: [30, 2, "Zbroja"],
      Puklerz: [3, 2, "Tarcza"],
      Tarcza: [5, 2, "Tarcza"],
      Hełm: [5, 2],
    },
    "Magister magii": {
      Kostur: [5, 0],
      Miecz: [10, 0],
      Sztylet: [2, 0],
      "Broń miotana": [10, 1],
    },
    "Kapłan Ranalda": {
      Kostur: [5, 0],
      Miecz: [10, 0],
      Sztylet: [2, 0],
      "Broń miotana": [10, 1],
      Bolas: [10, 1],
    },
    Stronnicy: {
      "Broń wielka": [10, 0],
      "Buława/Maczuga/Młot bojowy": [5, 0],
      Halabarda: [10, 0],
      Miecz: [10, 0],
      Sztylet: [2, 0],
      "Topór bojowy/Nadziak": [5, 0],
      Włócznia: [10, 0],
      "Broń miotana": [10, 1],
      Łuk: [10, 1],
      "Łuk krótki": [5, 1],
      Lekki: [5, 2, "Zbroja"],
      Średni: [15, 2, "Zbroja"],
      Puklerz: [3, 2, "Tarcza"],
      Tarcza: [5, 2, "Tarcza"],
      Hełm: [5, 2],
    },
    Ogr: {
      "Broń wielka": [10, 0],
      "Buława/Maczuga/Młot bojowy": [5, 0],
      "Cep bojowcy": [10, 0],
      "Karwasz bojowy": [15, 0],
      Miecz: [10, 0],
      "Maczuga ogrów": [5, 0],
      "Topór bojowy/Nadziak": [5, 0],
      "Broń miotana": [10, 1],
      Ołowiomiotacz: [50, 1],
      Lekki: [10, 2, "Zbroja"],
      Średni: [30, 2, "Zbroja"],
    },
  },
};

export const armies = {
  witchHunters: {
    heroes: {
      Inkwizytor: {
        id: 0,
        startingEquipment: ["Sztylet", "Młot bojowy"],
        cost: 75,
        number: 1,
        equipmentList: heroEquipment.witchHunters[0],
        type: "Bohater",
        stats: {
          Początkowa: [4, 4, 4, 3, 3, 2, 4, 1, 8],
          Maksymalna: [5, 6, 6, 4, 4, 3, 6, 4, 9],
        },
        rules: [
          "Arcykapłan",
          "Błogosławieństwo bogów",
          "Czarostwo",
          "Duchowny (modlitwy do Sigmara)",
          "Dowodzenie",
          "Dowódca",
          "Modlitwa",
          "Nienawiść",
        ],
        exp: 20,
        skills: [0, 1, 2, 3, 4, 5],
      },
      "Prezbiter Sigmara": {
        id: 1,
        startingEquipment: ["Sztylet", "Młot bojowy"],
        cost: 40,
        number: 1,
        equipmentList: heroEquipment.witchHunters[4],
        type: "Bohater",
        stats: {
          Początkowa: [4, 3, 3, 3, 3, 1, 3, 1, 8],
          Maksymalna: [5, 6, 6, 4, 4, 3, 6, 4, 9],
        },
        rules: [
          "Błogosławieństwo bogów",
          "Czarostwo",
          "Duchowny (modlitwy do Sigmara)",
          "Modlitwa",
          "Nienawiść",
          "Przepastne trzewia",
        ],
        exp: 12,
        skills: [0, 2, 3, 5],
      },
      "Łowca czarownic": {
        id: 2,
        startingEquipment: ["Sztylet", "Miecz"],
        cost: 30,
        number: 3,
        equipmentList: heroEquipment.witchHunters[0],
        type: "Bohater",
        stats: {
          Początkowa: [4, 3, 3, 3, 3, 1, 3, 1, 7],
          Maksymalna: [5, 6, 6, 4, 4, 3, 6, 4, 9],
        },
        rules: ["Nienawiść"],
        exp: 8,
        skills: [0, 1, 4, 5],
      },
      Zelota: {
        id: 3,
        startingEquipment: ["Sztylet"],
        cost: 20,
        number: 99,
        equipmentList: heroEquipment.witchHunters[1],
        type: "Stronnik",
        stats: {
          Początkowa: [4, 3, 3, 3, 3, 1, 3, 1, 7],
          Maksymalna: [5, 6, 6, 4, 4, 3, 6, 4, 9],
        },
        rules: ["Chorążowie & sygnaliści"],
      },
      Flagelant: {
        id: 4,
        startingEquipment: ["Cep bojowy"],
        cost: 45,
        number: 5,
        equipmentList: heroEquipment.witchHunters[2],
        type: "Stronnik",
        stats: {
          Początkowa: [4, 3, 3, 4, 4, 1, 3, 1, 10],
          Maksymalna: [5, 6, 6, 4, 4, 3, 6, 4, 9],
        },
        rules: ["Fanatyk, Furia"],
      },
      "Pies bojowy": {
        id: 5,
        startingEquipment: [],
        cost: 15,
        number: 5,
        equipmentList: {},
        type: "Stronnik",
        stats: {
          Początkowa: [6, 4, 0, 4, 3, 1, 4, 1, 5],
          Maksymalna: [6, 4, 0, 4, 3, 1, 4, 1, 5],
        },
        rules: ["Sfora", "Zwierzę"],
      },
      "Rycerz zakonny": {
        id: 6,
        startingEquipment: [
          "Sztylet",
          "Miecz",
          "Koń bojowy",
          "Siodło & uprząż",
        ],
        cost: 100,
        number: 3,
        equipmentList: heroEquipment.witchHunters[3],
        type: "Stronnik",
        stats: {
          Początkowa: [4, 3, 3, 3, 3, 1, 3, 1, 7],
          Maksymalna: [5, 6, 6, 4, 4, 3, 6, 4, 9],
          "Koń bojowy": [8, 3, 0, 3, "-", "-", 3, 1, 5],
        },
        rules: ["Duży cel (wierzchem)", "Kawalerzysta", "Szermierz"],
      },
      Pokutnik: {
        id: 7,
        startingEquipment: [],
        cost: 200,
        number: 1,
        equipmentList: {},
        type: "Machina",
        stats: {
          Powóz: ["-", "-", "-", 4, 8, 8, "-", "-", "-"],
          Koń: [8, 3, 1, 3, "-", "-", 3, 1, 5],
          "Koń ": [8, 3, 1, 3, "-", "-", 3, 1, 5],
        },
        rules: ["Duży cel", "Machina wojenna", "Pokutnik", "Powóz", "Strach"],
        exp: 0,
        skills: [],
      },
    },
    limit: 500,
    minModels: 3,
    maxModels: 12,
  },
  cyrkowcy: {
    heroes: {
      Mecenas: {
        id: 0,
        startingEquipment: ["Sztylet", "Miecz"],
        cost: 60,
        number: 1,
        equipmentList: heroEquipment.cyrkowcy.Bohaterowie,
        type: "Bohater",
        stats: {
          Początkowa: [4, 4, 4, 3, 3, 2, 4, 1, 8],
          Maksymalna: [5, 6, 6, 4, 4, 3, 6, 4, 9],
        },
        rules: ["Dowódca"],
        exp: 20,
        skills: [0, 1, 2, 3, 4, 5],
      },
      "Magister magii": {
        id: 1,
        startingEquipment: ["Sztylet", "Kostur"],
        cost: 40,
        number: 1,
        equipmentList: heroEquipment.cyrkowcy["Magister magii"],
        type: "Bohater",
        stats: {
          Początkowa: [4, 3, 3, 3, 3, 1, 3, 1, 8],
          Maksymalna: [5, 6, 6, 4, 4, 3, 6, 4, 9],
        },
        rules: ["Mag (Tradycja Cienia)"],
        exp: 12,
        skills: [0, 2, 4, 5],
      },
      "Kapłan Ranalda": {
        id: 2,
        startingEquipment: ["Sztylet", "Kostur"],
        cost: 45,
        number: 1,
        equipmentList: heroEquipment.cyrkowcy["Kapłan Ranalda"],
        type: "Bohater",
        stats: {
          Początkowa: [4, 2, 2, 3, 3, 1, 4, 1, 8],
          Maksymalna: [5, 6, 6, 4, 4, 3, 6, 4, 9],
        },
        rules: [
          "Błogosławieństwo bogów",
          "Duchowny (modlitwy do Ranalda)",
          "Kamuflaż",
          "Kieszonkowiec",
          "Modlitwa",
          "Wzgardzony",
        ],
        exp: 12,
        skills: [0, 2, 4, 5],
      },
      Szarlatan: {
        id: 3,
        startingEquipment: ["Sztylet", "Miecz"],
        cost: 35,
        number: 2,
        equipmentList: heroEquipment.cyrkowcy.Bohaterowie,
        type: "Bohater",
        stats: {
          Początkowa: [4, 3, 3, 3, 3, 1, 3, 1, 7],
          Maksymalna: [5, 6, 6, 4, 4, 3, 6, 4, 9],
        },
        rules: ["Niepokojący"],
        exp: 8,
        skills: [0, 1, 4, 5],
      },
      Treser: {
        id: 4,
        startingEquipment: ["Sztylet", "Łapacz"],
        cost: 25,
        number: 1,
        equipmentList: heroEquipment.cyrkowcy.Bohaterowie,
        type: "Bohater",
        stats: {
          Początkowa: [4, 3, 3, 3, 3, 1, 3, 1, 7],
          Maksymalna: [5, 6, 6, 4, 4, 3, 6, 4, 9],
        },
        rules: ["Treser"],
        exp: 8,
        skills: [0, 3, 4, 5],
      },
      Cyrkowiec: {
        id: 5,
        startingEquipment: ["Sztylet"],
        cost: 30,
        number: 7,
        equipmentList: heroEquipment.cyrkowcy.Stronnicy,
        type: "Stronnik",
        stats: {
          Początkowa: [4, 3, 3, 3, 3, 1, 3, 1, 7],
          Maksymalna: [5, 6, 6, 4, 4, 3, 6, 4, 9],
        },
        rules: [
          "Akrobata",
          "Chorążowie & sygnaliści",
          "Drużyna obsługi",
          "Wspinaczka",
        ],
      },
      Siłacz: {
        id: 6,
        startingEquipment: ["Sztylet", "Miecz"],
        cost: 45,
        number: 3,
        equipmentList: heroEquipment.cyrkowcy.Stronnicy,
        type: "Stronnik",
        stats: {
          Początkowa: [4, 3, 3, 4, 3, 1, 3, 1, 7],
          Maksymalna: [5, 6, 6, 4, 4, 3, 6, 4, 9],
        },
        rules: ["Akrobata", "Siłacz", "Wspinaczka"],
      },
      Żongler: {
        id: 7,
        startingEquipment: ["Sztylet", "Broń miotana"],
        cost: 45,
        number: 3,
        equipmentList: heroEquipment.cyrkowcy.Stronnicy,
        type: "Stronnik",
        stats: {
          Początkowa: [4, 3, 4, 3, 3, 1, 3, 1, 7],
          Maksymalna: [5, 6, 6, 4, 4, 3, 6, 4, 9],
        },
        rules: ["Akrobata", "Nożownik", "Wspinaczka"],
      },
      Woltyżer: {
        id: 8,
        startingEquipment: [
          "Sztylet",
          "Miecz",
          "Łuk",
          "Koń bojowy",
          "Siodło & uprząż",
        ],
        cost: 80,
        number: 3,
        equipmentList: heroEquipment.cyrkowcy.Stronnicy,
        type: "Stronnik",
        stats: {
          Początkowa: [4, 3, 3, 3, 3, 1, 3, 1, 7],
          Maksymalna: [5, 6, 6, 4, 4, 3, 6, 4, 9],
          "Koń bojowy": [8, 3, 0, 3, "-", "-", 3, 1, 5],
        },
        rules: [
          "Akrobata",
          "Kawalerzysta",
          "Lekka jazda",
          "Pewny strzał",
          "Wspinaczka",
        ],
      },
      Szablozębny: {
        id: 9,
        startingEquipment: ["Broń naturalna (precyzyjne uderzenie)"],
        cost: 70,
        number: 2,
        equipmentList: {},
        type: "Stronnik",
        stats: {
          Początkowa: [8, 4, 0, 4, 4, 2, 4, 2, 4],
          Maksymalna: [8, 4, 0, 4, 4, 2, 4, 2, 4],
        },
        rules: [
          "Duży cel",
          "Głód krwi",
          "Nienawiść",
          "Rączy",
          "Strach",
          "Zwiadowca",
          "Zwierzę",
        ],
      },
      Ogr: {
        id: 10,
        startingEquipment: ["Maczuga ogrów"],
        cost: 160,
        number: 1,
        equipmentList: heroEquipment.cyrkowcy.Ogr,
        type: "Stronnik",
        stats: {
          Początkowa: [6, 3, 2, 4, 4, 3, 2, 2, 7],
          Maksymalna: [6, 6, 5, 5, 5, 5, 6, 5, 9],
        },
        rules: [
          "Bycza szarża",
          "Duży cel",
          "Głód trzewi",
          "Oznakowany gnoblar (gnobal-uwaga)",
          "Przepastne trzewia",
          "Strach",
          "Tempy",
          "Wielkolud",
        ],
      },
      Niedźwiedź: {
        id: 11,
        startingEquipment: ["Broń naturalna"],
        cost: 125,
        number: 1,
        equipmentList: {},
        type: "Stronnik",
        stats: {
          Początkowa: [6, 4, 0, 5, 4, 3, 4, 3, 6],
          Maksymalna: [6, 4, 0, 5, 4, 3, 4, 3, 6],
        },
        rules: [
          "Bestia",
          "Bycza szarża",
          "Duży cel",
          "Głód trzewi",
          "Przepastne trzewia",
          "Rączy",
          "Strach",
          "Wielkolud",
          "Zwiadowca",
          "Zwierzę",
        ],
      },
      Zaprzęg: {
        id: 12,
        startingEquipment: [],
        cost: 175,
        number: 1,
        equipmentList: {},
        type: "Machina",
        stats: {
          Powóz: ["-", "-", "-", 4, 8, 8, "-", "-", "-"],
          Koń: [8, 3, 0, 3, "-", "-", 3, 1, 5],
          "Koń ": [8, 3, 0, 3, "-", "-", 3, 1, 5],
        },
        rules: ["Duży cel", "Kontakty handlowe(3)", "Machina wojenna", "Powóz"],
      },
      Rydwan: {
        id: 13,
        startingEquipment: [],
        cost: 125,
        number: 1,
        equipmentList: {},
        type: "Machina",
        stats: {
          Rydwan: ["-", "-", "-", 5, 5, 8, "-", "-", "-"],
          Koń: [8, 3, 0, 3, "-", "-", 3, 1, 5],
          "Koń ": [8, 3, 0, 3, "-", "-", 3, 1, 5],
        },
        rules: ["Duży cel", "Machina wojenna", "Rydwan"],
      },
    },
    limit: 500,
    minModels: 3,
    maxModels: 12,
    name: "Cyrkowcy z Ligii Ostermarku",
    nature: "Neutralna",
    armyRules: ["Kontakty handlowe (3)", "Rozrzutni"],
  },
};

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
  prestige,
  setPrestige,
  setArmyName
}) => {
  const [mercenaryUnitName, setMercenaryUnitName] = useState("");
  const [totalCost, setTotalCost] = useState(0);
  
  const [idShown, setIdShown] = useState(null);

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
  });

  useEffect(() => {
    setPrestige(getPrestige(unitList, armies[army])[0]);
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

  return (
    <div className="builder">
      <Header />
      <div className="builder-select-container">
        <ArmySelect army={army} setArmy={setArmy} setUnitList={setUnitList} />

        <UnitSelect
          heroes={armies[army].heroes}
          setUnitName={setUnitName}
          unitName={unitName}
          unitList={unitList}
          setUnitList={setUnitList}
        />

        <MercenariesSelect
          mercenaries={mercenaries}
          setUnitName={setMercenaryUnitName}
          unitName={mercenaryUnitName}
          unitList={unitList}
          setUnitList={setUnitList}
        />
      </div>

      <ArmyInfo
        prestige={prestige}
        totalCost={totalCost}
        army={army}
        unitList={unitList}
        setArmyName={setArmyName}
      />

      <div className="main-builder-container">
        <div className="side-builder-left">
          <UnitList
            unitList={unitList}
            setUnitList={setUnitList}
            idShown={idShown}
            setIdShown={setIdShown}
          />
        </div>

        <UnitInfo
          heroes={armies[army].heroes}
          mercenaries={mercenaries}
          unitName={unitName}
          unitList={unitList}
          setUnitList={setUnitList}
          handleClickShow={handleClickShow}
          idShown={idShown}
        />

        {/* <UnitTable
          unitList={unitList}
          heroes={armies[army].heroes}
          unitName={unitName}
        /> */}
      </div>
    </div>
  );
};

export default Builder;
