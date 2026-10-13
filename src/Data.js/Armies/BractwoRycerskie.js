// Source: Warheim.docx, Bractwo Rycerskie. See docs/army-data-audit.md.
export const army = {
  "heroes": {
    "Komtur": {
      "id": 0,
      "startingEquipment": ["Sztylet","Kopia"],
      "cost": 60,
      "number": 1,
      "equipmentList": {
        "Broń wielka": [10,0],
        "Buława/Maczuga/Młot bojowy": [5,0],
        "Gwiazda zaranna": [5,0],
        "Halabarda": [10,0],
        "Kopia": [30,0],
        "Łamacz": [25,0],
        "Miecz": [10,0],
        "Mizerykordia": [5,0],
        "Młot ulrykański": [15,0],
        "Sztylet": [2,0],
        "Topór bojowy/Nadziak": [5,0],
        "Trójząb": [15,0],
        "Włócznia": [10,0],
        "Broń miotana (topory/młoty)": [15,1],
        "Lekki": [5,2,"Zbroja"],
        "Średni": [15,2,"Zbroja"],
        "Ciężki": [30,2,"Zbroja"],
        "Puklerz": [3,2,"Tarcza"],
        "Tarcza": [5,2,"Tarcza"],
        "Hełm": [5,2],
        "Koń bojowy": [40,3]
      },
      "type": "Bohater",
      "stats": {
        "Początkowa": [4,5,3,3,3,2,4,1,8],
        "Maksymalna": [5,6,6,4,4,3,6,4,9]
      },
      "rules": ["Dowódca","Duży cel (wierzchem)","Kawalerzysta","Nieustępliwy","Niezłomny","Przepastne trzewia","Konny"],
      "exp": 20,
      "skills": [0,2,3,4,5]
    },
    "Templariusz": {
      "id": 2,
      "startingEquipment": ["Sztylet","Kopia"],
      "cost": 35,
      "number": 1,
      "equipmentList": {
        "Broń wielka": [10,0],
        "Buława/Maczuga/Młot bojowy": [5,0],
        "Gwiazda zaranna": [5,0],
        "Halabarda": [10,0],
        "Kopia": [30,0],
        "Łamacz": [25,0],
        "Miecz": [10,0],
        "Mizerykordia": [5,0],
        "Młot ulrykański": [15,0],
        "Sztylet": [2,0],
        "Topór bojowy/Nadziak": [5,0],
        "Trójząb": [15,0],
        "Włócznia": [10,0],
        "Broń miotana (topory/młoty)": [15,1],
        "Lekki": [5,2,"Zbroja"],
        "Średni": [15,2,"Zbroja"],
        "Ciężki": [30,2,"Zbroja"],
        "Puklerz": [3,2,"Tarcza"],
        "Tarcza": [5,2,"Tarcza"],
        "Hełm": [5,2],
        "Koń bojowy": [40,3]
      },
      "type": "Bohater",
      "stats": {
        "Początkowa": [4,4,3,3,3,1,3,1,7],
        "Maksymalna": [5,6,6,4,4,3,6,4,9]
      },
      "rules": ["Duży cel (wierzchem)","Kawalerzysta","Przepastne trzewia","Konny"],
      "exp": 8,
      "skills": [0,3,4,5]
    },
    "Giermek": {
      "id": 3,
      "startingEquipment": ["Sztylet"],
      "cost": 15,
      "number": 2,
      "equipmentList": {
        "Broń wielka": [10,0],
        "Buława/Maczuga/Młot bojowy": [5,0],
        "Gwiazda zaranna": [5,0],
        "Halabarda": [10,0],
        "Kopia": [30,0],
        "Łamacz": [25,0],
        "Miecz": [10,0],
        "Mizerykordia": [5,0],
        "Młot ulrykański": [15,0],
        "Sztylet": [2,0],
        "Topór bojowy/Nadziak": [5,0],
        "Trójząb": [15,0],
        "Włócznia": [10,0],
        "Broń miotana (topory/młoty)": [15,1],
        "Lekki": [5,2,"Zbroja"],
        "Średni": [15,2,"Zbroja"],
        "Ciężki": [30,2,"Zbroja"],
        "Puklerz": [3,2,"Tarcza"],
        "Tarcza": [5,2,"Tarcza"],
        "Hełm": [5,2],
        "Koń bojowy": [40,3]
      },
      "type": "Bohater",
      "stats": {
        "Początkowa": [4,2,2,3,3,1,3,1,6],
        "Maksymalna": [5,6,6,4,4,3,6,4,9]
      },
      "rules": ["Duży cel (wierzchem)","Kawalerzysta","Przyboczny","Konny"],
      "exp": 0,
      "skills": [0,3,4,5]
    },
    "Zbrojny": {
      "id": 4,
      "startingEquipment": ["Sztylet"],
      "cost": 20,
      "number": 12,
      "equipmentList": {
        "Broń wielka": [10,0],
        "Buława/Maczuga/Młot bojowy": [5,0],
        "Cep bojowy": [10,0],
        "Gwiazda zaranna": [5,0],
        "Halabarda": [10,0],
        "Korbacz": [5,0],
        "Miecz": [10,0],
        "Sztylet": [2,0],
        "Włócznia": [10,0],
        "Broń miotana (topory/młoty)": [15,1],
        "Łuk": [10,1],
        "Łuk długi": [20,1],
        "Oszczep": [15,1],
        "Proca": [5,1],
        "Sieć": [10,1],
        "Lekki": [5,2,"Zbroja"],
        "Średni": [15,2,"Zbroja"],
        "Puklerz": [3,2,"Tarcza"],
        "Tarcza": [5,2,"Tarcza"],
        "Hełm": [5,2]
      },
      "type": "Stronnik",
      "stats": {
        "Początkowa": [4,3,3,4,3,1,3,1,7],
        "Maksymalna": [5,6,6,4,4,3,6,4,9]
      },
      "rules": ["Chorążowie & sygnaliści","Drużyna obsługi"]
    },
    "Flagelant": {
      "id": 5,
      "startingEquipment": ["Cep bojowy"],
      "cost": 40,
      "number": 5,
      "equipmentList": {
        "Broń wielka": [10,0],
        "Bicz": [15,0],
        "Buława/Maczuga/Młot bojowy": [5,0],
        "Cep bojowy": [10,0],
        "Gwiazda zaranna": [5,0],
        "Kadzielnica ognia": [20,0],
        "Korbacz": [5,0]
      },
      "type": "Stronnik",
      "stats": {
        "Początkowa": [4,3,3,4,4,1,3,1,10],
        "Maksymalna": [5,6,6,4,4,3,6,4,9]
      },
      "rules": ["Fanatyk","Furia"]
    },
    "Gwardzista": {
      "id": 6,
      "startingEquipment": ["Sztylet","Broń wielka"],
      "cost": 35,
      "number": 5,
      "equipmentList": {
        "Broń wielka": [10,0],
        "Buława/Maczuga/Młot bojowy": [5,0],
        "Cep bojowy": [10,0],
        "Gwiazda zaranna": [5,0],
        "Halabarda": [10,0],
        "Korbacz": [5,0],
        "Miecz": [10,0],
        "Sztylet": [2,0],
        "Włócznia": [10,0],
        "Broń miotana (topory/młoty)": [15,1],
        "Łuk": [10,1],
        "Łuk długi": [20,1],
        "Oszczep": [15,1],
        "Proca": [5,1],
        "Sieć": [10,1],
        "Lekki": [5,2,"Zbroja"],
        "Średni": [15,2,"Zbroja"],
        "Puklerz": [3,2,"Tarcza"],
        "Tarcza": [5,2,"Tarcza"],
        "Hełm": [5,2]
      },
      "type": "Stronnik",
      "stats": {
        "Początkowa": [4,4,3,3,3,1,3,1,7],
        "Maksymalna": [5,6,6,4,4,3,6,4,9]
      },
      "rules": ["Drużyna wsparcia","Nieustępliwy","Siłacz","Szermierz"]
    },
    "Rycerz zakonny": {
      "id": 7,
      "startingEquipment": ["Sztylet","Miecz","Koń bojowy","Siodło & uprząż"],
      "cost": 70,
      "number": 3,
      "equipmentList": {
        "Broń wielka": [10,0],
        "Buława/Maczuga/Młot bojowy": [5,0],
        "Kopia": [30,0],
        "Miecz": [10,0],
        "Mizerykordia": [5,0],
        "Sztylet": [2,0],
        "Włócznia": [10,0],
        "Broń miotana (noże)": [10,1],
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
      "rules": ["Duży cel (wierzchem)","Kawalerzysta","Szermierz","Zabójczy cios"]
    },
    "Półgryfon": {
      "id": 8,
      "startingEquipment": ["Broń naturalna (precyzyjne uderzenie)"],
      "cost": 175,
      "number": 1,
      "equipmentList": {
        "Kropierz": [30,3]
      },
      "type": "Stronnik",
      "stats": {
        "Początkowa": [7,4,0,5,4,3,4,2,7],
        "Maksymalna": [7,4,0,5,4,3,4,2,7]
      },
      "rules": ["Głód krwi","Krzepki","Potwór","Ugryzienie","Wierzchowiec","Zwierzę"]
    },
    "Bitewny ołtarz": {
      "id": 9,
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
      "rules": ["Bitewny ołtarz","Duży cel","Machina wojenna","Strach","Powóz"]
    },
    "Rydwan": {
      "id": 10,
      "startingEquipment": [],
      "cost": 125,
      "number": 1,
      "equipmentList": {

      },
      "type": "Machina",
      "stats": {
        "Rydwan": ["-","-","-",5,5,8,"-","-","-"],
        "Koń bojowy": [8,3,0,3,"-","-",3,1,5],
        "Koń bojowy ": [8,3,0,3,"-","-",3,1,5]
      },
      "rules": ["Duży cel","Machina wojenna","Rydwan"]
    },
    "Kapłan Mananna": {
      "id": 11,
      "startingEquipment": ["Sztylet","Trójząb"],
      "cost": 35,
      "number": 1,
      "equipmentList": {
        "Broń wielka": [10,0],
        "Miecz": [10,0],
        "Sztylet": [2,0],
        "Trójząb": [15,0],
        "Włócznia": [10,0],
        "Broń miotana (noże)": [10,1],
        "Oszczep": [15,1],
        "Lekki": [5,2,"Zbroja"],
        "Średni": [15,2,"Zbroja"],
        "Ciężki": [30,2,"Zbroja"],
        "Puklerz": [3,2,"Tarcza"],
        "Tarcza": [5,2,"Tarcza"]
      },
      "type": "Bohater",
      "stats": {
        "Początkowa": [4,3,3,3,3,1,3,1,8],
        "Maksymalna": [5,6,6,4,4,3,6,4,9]
      },
      "rules": ["Czarostwo","Duchowny (modlitwy do Mananna)","Modlitwa","Pogarda","Rozproszenie magii (2)"],
      "exp": 12,
      "skills": [0,2,3,5]
    },
    "Kapłan Morra": {
      "id": 12,
      "startingEquipment": ["Sztylet","Kosa"],
      "cost": 35,
      "number": 1,
      "equipmentList": {
        "Kosa": [15,0],
        "Kostur": [5,0],
        "Miecz": [10,0],
        "Sztylet": [2,0],
        "Włócznia": [10,0],
        "Broń miotana (noże)": [10,1],
        "Lekki": [5,2,"Zbroja"]
      },
      "type": "Bohater",
      "stats": {
        "Początkowa": [4,2,2,3,3,1,3,1,9],
        "Maksymalna": [5,6,6,4,4,3,6,4,9]
      },
      "rules": ["Duchowny (modlitwy do Morra)","Kamienny spokój","Modlitwa","Rozproszenie magii (2)"],
      "exp": 12,
      "skills": [0,2,4,5]
    },
    "Kapłan Myrmidii": {
      "id": 13,
      "startingEquipment": ["Sztylet","Włócznia"],
      "cost": 35,
      "number": 1,
      "equipmentList": {
        "Broń wielka": [10,0],
        "Miecz": [10,0],
        "Sztylet": [2,0],
        "Włócznia": [10,0],
        "Broń miotana (noże)": [10,1],
        "Oszczep": [15,1],
        "Pistolet": [10,1],
        "Pistolet pojedynkowy": [20,1],
        "Lekki": [5,2,"Zbroja"],
        "Średni": [15,2,"Zbroja"],
        "Ciężki": [30,2,"Zbroja"],
        "Puklerz": [3,2,"Tarcza"],
        "Tarcza": [5,2,"Tarcza"]
      },
      "type": "Bohater",
      "stats": {
        "Początkowa": [4,3,3,3,3,1,3,1,8],
        "Maksymalna": [5,6,6,4,4,3,6,4,9]
      },
      "rules": ["Czarostwo","Duchowny (modlitwy do Myrmidii)","Modlitwa","Rozproszenie magii (2)","Szermierz"],
      "exp": 12,
      "skills": [0,2,4,5]
    },
    "Kapłan Ranalda": {
      "id": 14,
      "startingEquipment": ["Sztylet","Kostur"],
      "cost": 35,
      "number": 1,
      "equipmentList": {
        "Kostur": [5,0],
        "Miecz": [10,0],
        "Sztylet": [2,0],
        "Broń miotana (noże)": [10,1],
        "Bolas": [10,1]
      },
      "type": "Bohater",
      "stats": {
        "Początkowa": [4,2,2,3,3,1,4,1,8],
        "Maksymalna": [5,6,6,4,4,3,6,4,9]
      },
      "rules": ["Duchowny (modlitwy do Ranalda)","Gadanina","Modlitwa","Rewelator","Rozproszenie magii (2)","Wzgardzony"],
      "exp": 12,
      "skills": [0,2,4,5]
    },
    "Kapłan Ulryka": {
      "id": 15,
      "startingEquipment": ["Płaszcz z wilczej skóry","Sztylet","Topór bojowy/Nadziak"],
      "cost": 35,
      "number": 1,
      "equipmentList": {
        "Broń wielka": [10,0],
        "Buława/Maczuga/Młot bojowy": [5,0],
        "Młot ulrykański": [15,0],
        "Sztylet": [2,0],
        "Topór bojowy": [5,0],
        "Broń miotana (topory/młoty)": [15,1],
        "Oszczep": [15,1],
        "Lekki": [5,2,"Zbroja"],
        "Średni": [15,2,"Zbroja"],
        "Ciężki": [30,2,"Zbroja"],
        "Tarcza": [5,2,"Tarcza"]
      },
      "type": "Bohater",
      "stats": {
        "Początkowa": [4,4,3,4,3,1,3,1,8],
        "Maksymalna": [5,6,6,4,4,3,6,4,9]
      },
      "rules": ["Czarostwo","Duchowny (modlitwy do Ulryka)","Modlitwa","Pogarda","Rozproszenie magii (2)"],
      "exp": 12,
      "skills": [0,2,3,5]
    },
    "Kapłan Ursuna": {
      "id": 16,
      "startingEquipment": ["Sztylet","Topór bojowy/Nadziak"],
      "cost": 35,
      "number": 1,
      "equipmentList": {
        "Broń wielka": [10,0],
        "Buława/Maczuga/Młot bojowy": [5,0],
        "Sztylet": [2,0],
        "Topór bojowy": [5,0],
        "Topór krasnoludów": [10,0],
        "Broń miotana (topory/młoty)": [15,1],
        "Oszczep": [15,1],
        "Lekki": [5,2,"Zbroja"],
        "Średni": [15,2,"Zbroja"],
        "Ciężki": [30,2,"Zbroja"],
        "Tarcza": [5,2,"Tarcza"]
      },
      "type": "Bohater",
      "stats": {
        "Początkowa": [4,4,3,3,3,1,3,1,8],
        "Maksymalna": [5,6,6,4,4,3,6,4,9]
      },
      "rules": ["Czarostwo","Duchowny (modlitwy do Ursuna)","Modlitwa","Pogarda","Rozproszenie magii (2)"],
      "exp": 12,
      "skills": [0,2,3,5]
    },
    "Prezbiter Sigmara": {
      "id": 17,
      "startingEquipment": ["Sztylet","Buława/Maczuga/Młot bojowy"],
      "cost": 35,
      "number": 1,
      "equipmentList": {
        "Broń wielka": [10,0],
        "Buława/Maczuga/Młot bojowy": [5,0],
        "Młot ulrykański": [15,0],
        "Sztylet": [2,0],
        "Broń miotana (noże)": [10,1],
        "Pistolet": [10,1],
        "Pistolet pojedynkowy": [20,1],
        "Lekki": [5,2,"Zbroja"],
        "Średni": [15,2,"Zbroja"],
        "Ciężki": [30,2,"Zbroja"],
        "Puklerz": [3,2,"Tarcza"],
        "Tarcza": [5,2,"Tarcza"]
      },
      "type": "Bohater",
      "stats": {
        "Początkowa": [4,3,3,3,3,1,3,1,8],
        "Maksymalna": [5,6,6,4,4,3,6,4,9]
      },
      "rules": ["Czarostwo","Duchowny (modlitwy do Sigmara)","Modlitwa","Nienawiść","Przepastne trzewia","Rozproszenie magii (2)"],
      "exp": 12,
      "skills": [0,2,3,5]
    }
  },
  "limit": 600,
  "minModels": 3,
  "maxModels": 12,
  "name": "Bractwo Rycerskie",
  "nature": "Neutralna",
  "armyRules": ["Kontakty handlowe (3)","Podatek","Rozrzutność","Zamożność"],
  "mercenaries": ["Balistyk","Bombardier","Kartograf","Kupiec","Łowca czarownic","Łowca nagród","Medyk","Miotacz ołowiu","Ochroniarz","Ordynans","Pogromca Trolli","Rycerz najemny","Skryba","Strażnik dróg","Szczurołap","Szpieg","Tileański kusznik","Woźnica","Zwiadowca"]
};
