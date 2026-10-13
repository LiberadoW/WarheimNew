// Source: Warheim.docx, Berserkerzy z Norski. See docs/army-data-audit.md.
export const army = {
  "heroes": {
    "Jarl": {
      "id": 0,
      "startingEquipment": ["Sztylet","Miecz"],
      "cost": 60,
      "number": 1,
      "equipmentList": {
        "Broń wielka": [10,0],
        "Buława/Maczuga/Młot bojowy": [5,0],
        "Cep bojowy": [10,0],
        "Gwiazda zaranna": [5,0],
        "Korbacz": [5,0],
        "Kostur": [5,0],
        "Łapacz": [10,0],
        "Miecz": [10,0],
        "Sztylet": [2,0],
        "Topór bojowy/Nadziak": [5,0],
        "Włócznia": [10,0],
        "Broń miotana (topory/młoty)": [15,1],
        "Łuk": [10,1],
        "Oszczep": [15,1],
        "Lekki": [5,2,"Zbroja"],
        "Średni": [15,2,"Zbroja"],
        "Ciężki": [30,2,"Zbroja"],
        "Tarcza": [5,2,"Tarcza"],
        "Hełm": [5,2]
      },
      "type": "Bohater",
      "stats": {
        "Początkowa": [4,4,4,3,3,2,4,1,8],
        "Maksymalna": [5,6,6,4,4,3,6,4,9]
      },
      "rules": ["Berserk","Dowódca","Twardziel","Zabobonny lęk"],
      "exp": 20,
      "skills": [0,2,3,4,5]
    },
    "Vitki": {
      "id": 1,
      "startingEquipment": ["Sztylet","Kostur"],
      "cost": 40,
      "number": 1,
      "equipmentList": {
        "Broń wielka": [10,0],
        "Buława/Maczuga/Młot bojowy": [5,0],
        "Cep bojowy": [10,0],
        "Gwiazda zaranna": [5,0],
        "Korbacz": [5,0],
        "Kostur": [5,0],
        "Łapacz": [10,0],
        "Miecz": [10,0],
        "Sztylet": [2,0],
        "Topór bojowy/Nadziak": [5,0],
        "Włócznia": [10,0],
        "Broń miotana (topory/młoty)": [15,1],
        "Łuk": [10,1],
        "Oszczep": [15,1],
        "Lekki": [5,2,"Zbroja"],
        "Średni": [15,2,"Zbroja"],
        "Ciężki": [30,2,"Zbroja"],
        "Tarcza": [5,2,"Tarcza"],
        "Hełm": [5,2],
        "Tradycja Bestii": [0,4,"Tradycja"],
        "Tradycja Cienia": [0,4,"Tradycja"],
        "Tradycja Metalu": [0,4,"Tradycja"],
        "Tradycja Niebios": [0,4,"Tradycja"],
        "Tradycja Ognia": [0,4,"Tradycja"],
        "Tradycja Śmierci": [0,4,"Tradycja"],
        "Tradycja Światła": [0,4,"Tradycja"],
        "Tradycja Życia": [0,4,"Tradycja"]
      },
      "type": "Bohater",
      "stats": {
        "Początkowa": [4,3,3,3,3,1,3,1,8],
        "Maksymalna": [5,6,6,4,4,3,6,4,9]
      },
      "rules": ["Berserk","Guślarstwo","Mag (Kolegia Magii)","Twardziel","Zabobonny lęk"],
      "exp": 12,
      "skills": [0,2,5],
      "requiredEquipmentGroups": ["Tradycja"]
    },
    "Skald": {
      "id": 2,
      "startingEquipment": ["Sztylet","Miecz"],
      "cost": 30,
      "number": 1,
      "equipmentList": {
        "Broń wielka": [10,0],
        "Buława/Maczuga/Młot bojowy": [5,0],
        "Cep bojowy": [10,0],
        "Gwiazda zaranna": [5,0],
        "Korbacz": [5,0],
        "Kostur": [5,0],
        "Łapacz": [10,0],
        "Miecz": [10,0],
        "Sztylet": [2,0],
        "Topór bojowy/Nadziak": [5,0],
        "Włócznia": [10,0],
        "Broń miotana (topory/młoty)": [15,1],
        "Łuk": [10,1],
        "Oszczep": [15,1],
        "Lekki": [5,2,"Zbroja"],
        "Średni": [15,2,"Zbroja"],
        "Ciężki": [30,2,"Zbroja"],
        "Tarcza": [5,2,"Tarcza"],
        "Hełm": [5,2]
      },
      "type": "Bohater",
      "stats": {
        "Początkowa": [4,3,3,3,3,1,3,1,7],
        "Maksymalna": [5,6,6,4,4,3,6,4,9]
      },
      "rules": ["Berserk","Pieśni loeca","Treser","Twardziel","Zabobonny lęk"],
      "exp": 8,
      "skills": [0,1,4,5]
    },
    "Łowca niewolników": {
      "id": 3,
      "startingEquipment": ["Sztylet","Łapacz"],
      "cost": 30,
      "number": 2,
      "equipmentList": {
        "Broń wielka": [10,0],
        "Buława/Maczuga/Młot bojowy": [5,0],
        "Cep bojowy": [10,0],
        "Gwiazda zaranna": [5,0],
        "Korbacz": [5,0],
        "Kostur": [5,0],
        "Łapacz": [10,0],
        "Miecz": [10,0],
        "Sztylet": [2,0],
        "Topór bojowy/Nadziak": [5,0],
        "Włócznia": [10,0],
        "Broń miotana (topory/młoty)": [15,1],
        "Łuk": [10,1],
        "Oszczep": [15,1],
        "Lekki": [5,2,"Zbroja"],
        "Średni": [15,2,"Zbroja"],
        "Ciężki": [30,2,"Zbroja"],
        "Tarcza": [5,2,"Tarcza"],
        "Hełm": [5,2]
      },
      "type": "Bohater",
      "stats": {
        "Początkowa": [4,3,3,3,3,1,3,1,7],
        "Maksymalna": [5,6,6,4,4,3,6,4,9]
      },
      "rules": ["Berserk","Handlarz niewolników","Twardziel","Zabobonny lęk","Żertwa"],
      "exp": 8,
      "skills": [0,3,5]
    },
    "Niewolnik": {
      "id": 4,
      "startingEquipment": ["Broń improwizowana"],
      "cost": 10,
      "number": 12,
      "equipmentList": {

      },
      "type": "Stronnik",
      "stats": {
        "Początkowa": [4,2,2,3,3,1,3,1,2],
        "Maksymalna": [5,6,6,4,4,3,6,4,9]
      },
      "rules": ["Mięso armatnie","Niewolnik","Rozmiar rzondzi"]
    },
    "Wojownik": {
      "id": 5,
      "startingEquipment": ["Sztylet"],
      "cost": 20,
      "number": 12,
      "equipmentList": {
        "Broń wielka": [10,0],
        "Buława/Maczuga/Młot bojowy": [5,0],
        "Cep bojowy": [10,0],
        "Gwiazda zaranna": [5,0],
        "Korbacz": [5,0],
        "Miecz": [10,0],
        "Sztylet": [2,0],
        "Topór bojowy/Nadziak": [5,0],
        "Włócznia": [10,0],
        "Broń miotana (topory/młoty)": [15,1],
        "Oszczep": [15,1],
        "Łuk": [10,1],
        "Sieć": [10,1],
        "Lekki": [5,2,"Zbroja"],
        "Średni": [15,2,"Zbroja"],
        "Tarcza": [5,2,"Tarcza"],
        "Hełm": [5,2]
      },
      "type": "Stronnik",
      "stats": {
        "Początkowa": [4,3,3,3,3,1,3,1,7],
        "Maksymalna": [5,6,6,4,4,3,6,4,9]
      },
      "rules": ["Berserk","Chorążowie & sygnaliści","Drużyna ciężkich broni (harpun)","Twardziel","Zabobonny lęk"]
    },
    "Berserker": {
      "id": 6,
      "startingEquipment": ["Topór bojowy/Nadziak","Płaszcz z wilczej skóry"],
      "cost": 40,
      "number": 5,
      "equipmentList": {
        "Broń wielka": [10,0],
        "Buława/Maczuga/Młot bojowy": [5,0],
        "Cep bojowy": [10,0],
        "Korbacz": [5,0],
        "Topór bojowy/Nadziak": [5,0]
      },
      "type": "Stronnik",
      "stats": {
        "Początkowa": [4,3,3,3,3,1,3,1,10],
        "Maksymalna": [5,6,6,4,4,3,6,4,9]
      },
      "rules": ["Berserk","Fanatyk","Furia","Szał","Twardziel","Zabobonny lęk"]
    },
    "Ogar Chaosu": {
      "id": 7,
      "startingEquipment": ["Broń naturalna"],
      "cost": 20,
      "number": 5,
      "equipmentList": {

      },
      "type": "Stronnik",
      "stats": {
        "Początkowa": [7,4,0,4,3,1,3,1,5],
        "Maksymalna": [7,4,0,4,3,1,3,1,5]
      },
      "rules": ["Rączy","Zwierzę"]
    },
    "Zniewolony Troll": {
      "id": 8,
      "startingEquipment": ["Broń naturalna"],
      "cost": 200,
      "number": 1,
      "equipmentList": {

      },
      "type": "Stronnik",
      "stats": {
        "Początkowa": [6,3,1,5,4,3,1,3,4],
        "Maksymalna": [6,3,1,5,4,3,1,3,4]
      },
      "rules": ["Bestia","Bycza szarża","Duży cel","Gatunki trolli","Głód trzewi","Głupota","Nieświadomy","Niezłomny","Ochronne tatuaże","Przepastne trzewia","Regeneracja","Strach","Wielkolud","Żrąca plwocina"]
    },
    "Yeti": {
      "id": 9,
      "startingEquipment": ["Broń naturalna (wspinaczka)"],
      "cost": 175,
      "number": 1,
      "equipmentList": {

      },
      "type": "Stronnik",
      "stats": {
        "Początkowa": [7,3,0,5,4,3,4,2,7],
        "Maksymalna": [7,6,0,5,5,5,6,5,8]
      },
      "rules": ["Bycza szarża","Duży cel","Głód trzewi","Niepokojący","Ograniczony","Przepastne trzewia","Stan niższy","Strach","Tempy","Wielkolud"]
    },
    "Więźniarka": {
      "id": 10,
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
      "rules": ["Duży cel","Machina wojenna","Powóz","Więźniarka"]
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
      "rules": ["Bitewny ołtarz","Duży cel","Machina wojenna","Strach","Powóz"]
    },
    "Drużyna ciężkich broni": {
      "id": 12,
      "startingEquipment": ["Sztylet"],
      "cost": 40,
      "number": 2,
      "equipmentList": {
        "Buława/Maczuga/Młot bojowy": [5,0],
        "Miecz": [10,0],
        "Sztylet": [2,0],
        "Włócznia": [10,0],
        "Harpun": [50,1],
        "Lekki": [5,2,"Zbroja"],
        "Średni": [15,2,"Zbroja"]
      },
      "type": "Stronnik",
      "stats": {
        "Początkowa": [4,3,3,3,3,1,3,1,7],
        "Maksymalna": [5,6,6,4,4,3,6,4,9]
      },
      "rules": ["Berserk","Twardziel","Zabobonny lęk","Drużyna ciężkich broni (harpun)","Drużyna wsparcia"],
      "crewBaseCost": 40
    }
  },
  "limit": 500,
  "minModels": 3,
  "maxModels": 12,
  "name": "Berserkerzy z Norski",
  "nature": "Zła",
  "armyRules": ["Podatek","Rozrzutność"],
  "mercenaries": ["Gladiator","Kartograf","Kupiec","Łowca nagród","Magus","Medyk","Miotacz ołowiu","Ochroniarz","Rozbójnik","Rycerz najemny","Szczurołap","Szpieg","Tileański kusznik","Trefniś","Woźnica","Wróżbita","Złodziej","Zwiadowca"]
};
