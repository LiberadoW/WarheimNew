// Source: Warheim.docx, Emisariusze Smoczego Cesarza. See docs/army-data-audit.md.
export const army = {
  "heroes": {
    "Emisariusz": {
      "id": 0,
      "startingEquipment": ["Sztylet","Miecz"],
      "cost": 55,
      "number": 1,
      "equipmentList": {
        "Broń wielka": [10,0],
        "Buława/Maczuga/Młot bojowy": [5,0],
        "Halabarda": [10,0],
        "Kopia": [30,0],
        "Kostur": [5,0],
        "Miecz": [10,0],
        "Sztylet": [2,0],
        "Trójząb": [15,0],
        "Włócznia": [10,0],
        "Broń miotana (noże)": [10,1],
        "Granat dymny": [25,1],
        "Łuk": [10,1],
        "Łuk długi": [20,1],
        "Kusza": [25,1],
        "Kusza powtarzalna": [25,1],
        "Oszczep": [15,1],
        "Pistolet": [10,1],
        "Lekki": [5,2,"Zbroja"],
        "Średni": [15,2,"Zbroja"],
        "Ciężki": [30,2,"Zbroja"],
        "Puklerz": [3,2,"Tarcza"],
        "Tarcza": [5,2,"Tarcza"],
        "Hełm": [5,2],
        "Dualizm (Yin)": [0,3,"Dualizm"],
        "Dualizm (Yang)": [0,3,"Dualizm"]
      },
      "type": "Bohater",
      "stats": {
        "Początkowa": [4,3,3,3,3,2,4,1,8],
        "Maksymalna": [5,6,6,4,4,3,6,4,9]
      },
      "rules": ["Dowódca","Dualizm (Yin lub Yang)","Podżeganie"],
      "exp": 20,
      "skills": [0,1,2,3,4,5],
      "requiredEquipmentGroups": ["Dualizm"]
    },
    "Kanclerz": {
      "id": 1,
      "startingEquipment": ["Sztylet","Kostur"],
      "cost": 35,
      "number": 1,
      "equipmentList": {
        "Broń wielka": [10,0],
        "Buława/Maczuga/Młot bojowy": [5,0],
        "Halabarda": [10,0],
        "Kopia": [30,0],
        "Kostur": [5,0],
        "Miecz": [10,0],
        "Sztylet": [2,0],
        "Trójząb": [15,0],
        "Włócznia": [10,0],
        "Broń miotana (noże)": [10,1],
        "Granat dymny": [25,1],
        "Łuk": [10,1],
        "Łuk długi": [20,1],
        "Kusza": [25,1],
        "Kusza powtarzalna": [25,1],
        "Oszczep": [15,1],
        "Pistolet": [10,1],
        "Lekki": [5,2,"Zbroja"],
        "Średni": [15,2,"Zbroja"],
        "Ciężki": [30,2,"Zbroja"],
        "Puklerz": [3,2,"Tarcza"],
        "Tarcza": [5,2,"Tarcza"],
        "Hełm": [5,2],
        "Dualizm (Yin)": [0,3,"Dualizm"],
        "Dualizm (Yang)": [0,3,"Dualizm"]
      },
      "type": "Bohater",
      "stats": {
        "Początkowa": [4,3,3,3,3,1,3,1,8],
        "Maksymalna": [5,6,6,4,4,3,6,4,9]
      },
      "rules": ["Dualizm (Yin lub Yang)","Mag (Dziedzina Dao)"],
      "exp": 12,
      "skills": [0,2,4,5],
      "requiredEquipmentGroups": ["Dualizm"]
    },
    "Inwestor": {
      "id": 2,
      "startingEquipment": ["Sztylet","Miecz"],
      "cost": 25,
      "number": 2,
      "equipmentList": {
        "Broń wielka": [10,0],
        "Buława/Maczuga/Młot bojowy": [5,0],
        "Halabarda": [10,0],
        "Kopia": [30,0],
        "Kostur": [5,0],
        "Miecz": [10,0],
        "Sztylet": [2,0],
        "Trójząb": [15,0],
        "Włócznia": [10,0],
        "Broń miotana (noże)": [10,1],
        "Granat dymny": [25,1],
        "Łuk": [10,1],
        "Łuk długi": [20,1],
        "Kusza": [25,1],
        "Kusza powtarzalna": [25,1],
        "Oszczep": [15,1],
        "Pistolet": [10,1],
        "Lekki": [5,2,"Zbroja"],
        "Średni": [15,2,"Zbroja"],
        "Ciężki": [30,2,"Zbroja"],
        "Puklerz": [3,2,"Tarcza"],
        "Tarcza": [5,2,"Tarcza"],
        "Hełm": [5,2]
      },
      "type": "Bohater",
      "stats": {
        "Początkowa": [4,3,3,3,3,1,3,1,7],
        "Maksymalna": [5,6,6,4,4,3,6,4,9]
      },
      "rules": ["Dualizm (Yin)","Handlarz","Kontakty handlowe (3)"],
      "exp": 8,
      "skills": [0,2,5]
    },
    "Strażnik": {
      "id": 3,
      "startingEquipment": ["Sztylet","Miecz"],
      "cost": 25,
      "number": 1,
      "equipmentList": {
        "Broń wielka": [10,0],
        "Buława/Maczuga/Młot bojowy": [5,0],
        "Halabarda": [10,0],
        "Kopia": [30,0],
        "Kostur": [5,0],
        "Miecz": [10,0],
        "Sztylet": [2,0],
        "Trójząb": [15,0],
        "Włócznia": [10,0],
        "Broń miotana (noże)": [10,1],
        "Granat dymny": [25,1],
        "Łuk": [10,1],
        "Łuk długi": [20,1],
        "Kusza": [25,1],
        "Kusza powtarzalna": [25,1],
        "Oszczep": [15,1],
        "Pistolet": [10,1],
        "Lekki": [5,2,"Zbroja"],
        "Średni": [15,2,"Zbroja"],
        "Ciężki": [30,2,"Zbroja"],
        "Puklerz": [3,2,"Tarcza"],
        "Tarcza": [5,2,"Tarcza"],
        "Hełm": [5,2]
      },
      "type": "Bohater",
      "stats": {
        "Początkowa": [4,4,3,3,3,1,3,1,7],
        "Maksymalna": [5,6,6,4,4,3,6,4,9]
      },
      "rules": ["Dualizm (Yang)","Szermierz","Żywa tarcza"],
      "exp": 0,
      "skills": [0,1,3,5]
    },
    "Piechur": {
      "id": 4,
      "startingEquipment": ["Sztylet"],
      "cost": 15,
      "number": 15,
      "equipmentList": {
        "Broń wielka": [10,0],
        "Buława/Maczuga/Młot bojowy": [5,0],
        "Halabarda": [10,0],
        "Miecz": [10,0],
        "Sztylet": [2,0],
        "Topór bojowy/Nadziak": [5,0],
        "Trójząb": [15,0],
        "Włócznia": [10,0],
        "Broń miotana (noże)": [10,1],
        "Łuk": [10,1],
        "Łuk długi": [20,1],
        "Kusza": [25,1],
        "Kusza powtarzalna": [25,1],
        "Muszkiet": [25,1],
        "Oszczep": [15,1],
        "Lekki": [5,2,"Zbroja"],
        "Średni": [15,2,"Zbroja"],
        "Puklerz": [3,2,"Tarcza"],
        "Tarcza": [5,2,"Tarcza"],
        "Hełm": [5,2]
      },
      "type": "Stronnik",
      "stats": {
        "Początkowa": [4,2,2,3,3,1,3,1,7],
        "Maksymalna": [5,6,6,4,4,3,6,4,9]
      },
      "rules": ["Chłopstwo","Chorążowie & sygnaliści","Drużyna obsługi","Dualizm (Yang)","Stan niższy"]
    },
    "Strzelec": {
      "id": 5,
      "startingEquipment": ["Sztylet"],
      "cost": 20,
      "number": 7,
      "equipmentList": {
        "Broń wielka": [10,0],
        "Buława/Maczuga/Młot bojowy": [5,0],
        "Halabarda": [10,0],
        "Miecz": [10,0],
        "Sztylet": [2,0],
        "Topór bojowy/Nadziak": [5,0],
        "Trójząb": [15,0],
        "Włócznia": [10,0],
        "Broń miotana (noże)": [10,1],
        "Łuk": [10,1],
        "Łuk długi": [20,1],
        "Kusza": [25,1],
        "Kusza powtarzalna": [0,1,"Startowy"],
        "Muszkiet": [0,1,"Startowy"],
        "Oszczep": [15,1],
        "Lekki": [5,2,"Zbroja"],
        "Średni": [15,2,"Zbroja"],
        "Puklerz": [3,2,"Tarcza"],
        "Tarcza": [5,2,"Tarcza"],
        "Hełm": [5,2]
      },
      "type": "Stronnik",
      "stats": {
        "Początkowa": [4,3,3,3,3,1,3,1,7],
        "Maksymalna": [5,6,6,4,4,3,6,4,9]
      },
      "rules": ["Błyskawiczne przeładowanie","Chłopstwo","Dualizm (Yin)","Stan niższy"]
    },
    "Smoczy lansjer": {
      "id": 6,
      "startingEquipment": ["Sztylet","Miecz","Włócznia","Koń bojowy","Siodło & uprząż"],
      "cost": 70,
      "number": 3,
      "equipmentList": {
        "Broń wielka": [10,0],
        "Buława/Maczuga/Młot bojowy": [5,0],
        "Miecz": [10,0],
        "Mizerykordia": [5,0],
        "Sztylet": [2,0],
        "Włócznia": [10,0],
        "Broń miotana (topory/młoty)": [15,1],
        "Lekki": [5,2,"Zbroja"],
        "Średni": [15,2,"Zbroja"],
        "Ciężki": [30,2,"Zbroja"],
        "Tarcza": [5,2,"Tarcza"],
        "Hełm": [5,2]
      },
      "type": "Stronnik",
      "stats": {
        "Początkowa": [4,3,3,3,3,1,3,1,7],
        "Maksymalna": [5,6,6,4,4,3,6,4,9],
        "Koń bojowy": [8,3,0,3,"-","-",3,1,5]
      },
      "rules": ["Dualizm (Yang)","Duży cel (wierzchem)","Kawalerzysta","Sfora"]
    },
    "Nomada": {
      "id": 7,
      "startingEquipment": ["Sztylet","Miecz","Łuk krótki","Koń bojowy","Siodło & uprząż"],
      "cost": 70,
      "number": 3,
      "equipmentList": {
        "Topór bojowy/Nadziak": [5,0],
        "Buława/Maczuga/Młot bojowy": [5,0],
        "Miecz": [10,0],
        "Sztylet": [2,0],
        "Włócznia": [10,0],
        "Broń miotana (topory/młoty)": [15,1],
        "Łuk krótki": [5,1],
        "Oszczep": [15,1],
        "Lekki": [5,2,"Zbroja"],
        "Tarcza": [5,2,"Tarcza"],
        "Hełm": [5,2]
      },
      "type": "Stronnik",
      "stats": {
        "Początkowa": [4,3,4,3,3,1,3,1,7],
        "Maksymalna": [5,6,6,4,4,3,6,4,9],
        "Koń bojowy": [8,3,0,3,"-","-",3,1,5]
      },
      "rules": ["Dualizm (Yin)","Kawalerzysta","Lekka jazda","Ranger","Stan niższy","Zwiadowca"]
    },
    "Kirin": {
      "id": 8,
      "startingEquipment": ["Broń naturalna"],
      "cost": 150,
      "number": 1,
      "equipmentList": {

      },
      "type": "Stronnik",
      "stats": {
        "Początkowa": [8,3,0,4,4,3,4,2,7],
        "Maksymalna": [8,3,0,4,4,3,4,2,7]
      },
      "rules": ["Dualizm (Yin)","Leśny duch","Lot","Potwór","Szarża dzików","Wierzchowiec"]
    },
    "Pies świątynny": {
      "id": 9,
      "startingEquipment": ["Broń naturalna (uderza jako ostatni)"],
      "cost": 70,
      "number": 2,
      "equipmentList": {

      },
      "type": "Stronnik",
      "stats": {
        "Początkowa": [6,4,0,4,4,2,1,2,4],
        "Maksymalna": [6,4,0,4,4,2,1,2,4]
      },
      "rules": ["Dualizm (Yang)","Duży cel","Leśny duch","Rączy","Trudny do zabicia"]
    },
    "Balon bojowy": {
      "id": 10,
      "startingEquipment": [],
      "cost": 150,
      "number": 1,
      "equipmentList": {

      },
      "type": "Machina",
      "stats": {
        "Początkowa": [2,"-","-",4,5,5,"-","-","-"],
        "Maksymalna": [2,"-","-",4,5,5,"-","-","-"]
      },
      "rules": ["Bombardowanie","Dualizm (Yang)","Duży cel","Lot","Łatwopalny","Machina wojenna","Trafienie z uderzenia","Uporczywość","Zawis","Zwiadowca","Ambona myśliwska"]
    },
    "Bitewny ołtarz": {
      "id": 11,
      "startingEquipment": [],
      "cost": 175,
      "number": 1,
      "equipmentList": {

      },
      "type": "Machina",
      "stats": {
        "Powóz": ["-","-","-",4,8,8,"-","-","-"],
        "Koń bojowy": [8,3,0,3,"-","-",3,1,5],
        "Koń bojowy ": [8,3,0,3,"-","-",3,1,5]
      },
      "rules": ["Bitewny ołtarz","Dualizm (Yin)","Duży cel","Machina wojenna","Strach","Powóz"]
    }
  },
  "limit": 500,
  "minModels": 3,
  "maxModels": 15,
  "name": "Emisariusze Smoczego Cesarza",
  "nature": "Neutralna",
  "armyRules": ["Pazerność","Podatek","Rozrzutność"],
  "mercenaries": ["Balistyk","Bombardier","Kartograf","Kupiec","Latarnik","Magus","Medyk","Minstrel","Miotacz ołowiu","Ochroniarz","Skryba","Strażnik dróg","Szczurołap","Szpieg","Trefniś","Tileański kusznik","Woźnica","Wróżbita","Złodziej","Zwiadowca"]
};
