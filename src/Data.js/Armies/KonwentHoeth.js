// Source: Warheim.docx, Konwent magów Wieży Hoeth. See docs/army-data-audit.md.
export const army = {
  "heroes": {
    "Mistrz magii Hoeth": {
      "id": 0,
      "startingEquipment": ["Sztylet","Kostur"],
      "cost": 80,
      "number": 1,
      "equipmentList": {
        "Kostur": [5,0],
        "Miecz": [10,0],
        "Sztylet": [2,0],
        "Włócznia": [10,0],
        "Broń miotana (noże)": [10,1]
      },
      "type": "Bohater",
      "stats": {
        "Początkowa": [5,4,4,3,3,2,6,1,9],
        "Maksymalna": [6,7,7,4,3,3,9,4,10]
      },
      "rules": ["Dowódca","Mag (Wysoka Magia)","Mistrz Magii","Mistrz mrocznej magii","Wiedza tajemna (Kolegia Magii)","Szósty zmysł"],
      "exp": 20,
      "skills": [0,2,4,5]
    },
    "Reflektant": {
      "id": 1,
      "startingEquipment": ["Sztylet","Kostur"],
      "cost": 50,
      "number": 2,
      "equipmentList": {
        "Kostur": [5,0],
        "Miecz": [10,0],
        "Sztylet": [2,0],
        "Włócznia": [10,0],
        "Broń miotana (noże)": [10,1],
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
        "Początkowa": [5,4,4,3,3,1,5,1,8],
        "Maksymalna": [6,7,7,4,3,3,9,4,10]
      },
      "rules": ["Mag (Kolegia Magii)","Szósty zmysł","Reflektant"],
      "exp": 11,
      "skills": [0,2,4,5],
      "requiredEquipmentGroups": ["Tradycja"]
    },
    "Mistrz miecza Hoeth": {
      "id": 2,
      "startingEquipment": ["Sztylet","Broń wielka"],
      "cost": 60,
      "number": 1,
      "equipmentList": {
        "Broń wielka": [10,0],
        "Halabarda": [10,0],
        "Łamacz mieczy": [25,0],
        "Miecz": [10,0],
        "Rapier": [10,0],
        "Sztylet": [2,0],
        "Topór bojowy": [5,0],
        "Włócznia": [10,0],
        "Broń miotana (noże)": [10,1],
        "Łuk": [10,1],
        "Łuk długi": [20,1],
        "Oszczep": [15,1],
        "Lekki": [5,2,"Zbroja"],
        "Średni": [15,2,"Zbroja"],
        "Ciężki": [30,2,"Zbroja"],
        "Pancerz z Ithilmaru": [50,2],
        "Tarcza": [5,2,"Tarcza"],
        "Hełm": [5,2]
      },
      "type": "Bohater",
      "stats": {
        "Początkowa": [5,6,4,3,3,1,5,1,8],
        "Maksymalna": [6,7,7,4,3,3,9,4,10]
      },
      "rules": ["Mistrz miecza","Szósty zmysł","Żywa tarcza"],
      "exp": 11,
      "skills": [0,2,3,4,5]
    },
    "Łucznik": {
      "id": 3,
      "startingEquipment": ["Sztylet","Łuk długi"],
      "cost": 45,
      "number": 12,
      "equipmentList": {
        "Broń wielka": [10,0],
        "Halabarda": [10,0],
        "Miecz": [10,0],
        "Sztylet": [2,0],
        "Topór bojowy": [5,0],
        "Włócznia": [10,0],
        "Broń miotana (noże)": [10,1],
        "Łuk": [10,1],
        "Łuk długi": [20,1],
        "Oszczep": [15,1],
        "Lekki": [5,2,"Zbroja"],
        "Średni": [15,2,"Zbroja"],
        "Puklerz": [3,2,"Tarcza"],
        "Tarcza": [5,2,"Tarcza"],
        "Hełm": [5,2]
      },
      "type": "Stronnik",
      "stats": {
        "Początkowa": [5,4,4,3,3,1,5,1,8],
        "Maksymalna": [6,7,7,4,3,3,9,4,10]
      },
      "rules": ["Chorążowie & sygnaliści","Drużyna obsługi","Szósty zmysł"]
    },
    "Włócznik": {
      "id": 4,
      "startingEquipment": ["Sztylet","Włócznia"],
      "cost": 45,
      "number": 5,
      "equipmentList": {
        "Broń wielka": [10,0],
        "Halabarda": [10,0],
        "Miecz": [10,0],
        "Sztylet": [2,0],
        "Topór bojowy": [5,0],
        "Włócznia": [10,0],
        "Broń miotana (noże)": [10,1],
        "Łuk": [10,1],
        "Łuk długi": [20,1],
        "Oszczep": [15,1],
        "Lekki": [5,2,"Zbroja"],
        "Średni": [15,2,"Zbroja"],
        "Puklerz": [3,2,"Tarcza"],
        "Tarcza": [5,2,"Tarcza"],
        "Hełm": [5,2]
      },
      "type": "Stronnik",
      "stats": {
        "Początkowa": [5,4,4,3,3,1,5,1,8],
        "Maksymalna": [6,7,7,4,3,3,9,4,10]
      },
      "rules": ["Szermierz","Szósty zmysł"]
    },
    "Jeździec z Ellyrionu": {
      "id": 5,
      "startingEquipment": ["Sztylet","Włócznia","Łuk długi","Rumak Elfów","Siodło & uprząż"],
      "cost": 80,
      "number": 3,
      "equipmentList": {
        "Miecz": [10,0],
        "Sztylet": [2,0],
        "Włócznia": [10,0],
        "Broń miotana (noże)": [10,1],
        "Łuk długi": [20,1],
        "Oszczep": [15,1],
        "Lekki": [5,2,"Zbroja"],
        "Średni": [15,2,"Zbroja"],
        "Tarcza": [5,2,"Tarcza"],
        "Hełm": [5,2]
      },
      "type": "Stronnik",
      "stats": {
        "Początkowa": [5,4,4,3,3,1,5,1,8],
        "Maksymalna": [6,7,7,4,3,3,9,4,10],
        "Rumak elfów": [9,3,0,3,"-","-",4,1,5]
      },
      "rules": ["Kawalerzysta","Lekka jazda","Pewny strzał","Szósty zmysł","Zwiadowca"]
    },
    "Wielki orzeł": {
      "id": 6,
      "startingEquipment": ["Broń naturalna (przebicie pancerza)"],
      "cost": 150,
      "number": 1,
      "equipmentList": {

      },
      "type": "Stronnik",
      "stats": {
        "Początkowa": [2,5,0,4,4,3,4,2,8],
        "Maksymalna": [2,5,0,4,4,3,4,2,8]
      },
      "rules": ["Lot","Potwór","Wierzchowiec","Zwierzę"]
    },
    "Balon bojowy": {
      "id": 7,
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
      "rules": ["Bombardowanie","Duży cel","Lot","Łatwopalny","Machina wojenna","Stanowisko strzeleckie","Trafienie z uderzenia","Uporczywość","Zawis","Zwiadowca"]
    },
    "Relikwiarz mocy": {
      "id": 8,
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
      "rules": ["Duży cel","Kontakty handlowe (1)","Kufer mocy","Machina wojenna","Powóz"]
    }
  },
  "limit": 500,
  "minModels": 3,
  "maxModels": 12,
  "name": "Konwent magów Wieży Hoeth",
  "nature": "Neutralna",
  "armyRules": ["Podatek","Rozrzutność"],
  "mercenaries": ["Minstrel","Strażnik Morski z Lothern","Zwiadowca"]
};
