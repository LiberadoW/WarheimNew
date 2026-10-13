// Source: Warheim.docx, Klan wojowników z Nipponu. See docs/army-data-audit.md.
export const army = {
  "heroes": {
    "Daimyo": {
      "id": 0,
      "startingEquipment": ["Wakizashi","Katana"],
      "cost": 55,
      "number": 1,
      "equipmentList": {
        "Broń wielka": [10,0],
        "Buława/Maczuga/Młot bojowy": [5,0],
        "Halabarda": [10,0],
        "Katana": [10,0],
        "Kostur": [5,0],
        "Topór bojowy/Nadziak": [5,0],
        "Trójząb": [15,0],
        "Wachlarz bojowy": [30,0],
        "Wakizashi": [5,0],
        "Włócznia": [10,0],
        "Broń miotana (gwiazdki)": [10,1],
        "Granat dymny": [25,1],
        "Łuk": [10,1],
        "Łuk długi": [20,1],
        "Oszczep": [15,1],
        "Lekki": [5,2,"Zbroja"],
        "Średni": [15,2,"Zbroja"],
        "Ciężki": [30,2,"Zbroja"],
        "Hełm": [5,2]
      },
      "type": "Bohater",
      "stats": {
        "Początkowa": [4,4,4,3,3,2,4,1,8],
        "Maksymalna": [5,6,6,4,4,3,6,4,9]
      },
      "rules": ["Dowódca","Nieustępliwy","Seppuku","Zimnokrwisty"],
      "exp": 20,
      "skills": [0,2,3,4,5]
    },
    "Yamabushi": {
      "id": 1,
      "startingEquipment": ["Wakizashi","Kostur"],
      "cost": 35,
      "number": 1,
      "equipmentList": {
        "Broń wielka": [10,0],
        "Buława/Maczuga/Młot bojowy": [5,0],
        "Halabarda": [10,0],
        "Katana": [10,0],
        "Kostur": [5,0],
        "Topór bojowy/Nadziak": [5,0],
        "Trójząb": [15,0],
        "Wachlarz bojowy": [30,0],
        "Wakizashi": [5,0],
        "Włócznia": [10,0],
        "Broń miotana (gwiazdki)": [10,1],
        "Granat dymny": [25,1],
        "Łuk": [10,1],
        "Łuk długi": [20,1],
        "Oszczep": [15,1],
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
      "rules": ["Guślarstwo","Mag (Kolegia Magii)","Odporność na magię (1)","Nieustępliwy","Seppuku","Sztuka cichej śmierci","Zimnokrwisty"],
      "exp": 12,
      "skills": [0,2,4,5],
      "requiredEquipmentGroups": ["Tradycja"]
    },
    "Hatamoto": {
      "id": 2,
      "startingEquipment": ["Wakizashi","Katana"],
      "cost": 25,
      "number": 2,
      "equipmentList": {
        "Broń wielka": [10,0],
        "Buława/Maczuga/Młot bojowy": [5,0],
        "Halabarda": [10,0],
        "Katana": [10,0],
        "Kostur": [5,0],
        "Topór bojowy/Nadziak": [5,0],
        "Trójząb": [15,0],
        "Wachlarz bojowy": [30,0],
        "Wakizashi": [5,0],
        "Włócznia": [10,0],
        "Broń miotana (gwiazdki)": [10,1],
        "Granat dymny": [25,1],
        "Łuk": [10,1],
        "Łuk długi": [20,1],
        "Oszczep": [15,1],
        "Lekki": [5,2,"Zbroja"],
        "Średni": [15,2,"Zbroja"],
        "Ciężki": [30,2,"Zbroja"],
        "Hełm": [5,2]
      },
      "type": "Bohater",
      "stats": {
        "Początkowa": [4,4,3,3,3,1,3,1,7],
        "Maksymalna": [5,6,6,4,4,3,6,4,9]
      },
      "rules": ["Nieustępliwy","Seppuku","Straż przyboczna","Zimnokrwisty","Żywa tarcza"],
      "exp": 8,
      "skills": [0,1,4,5]
    },
    "Sumo": {
      "id": 3,
      "startingEquipment": ["Broń naturalna"],
      "cost": 30,
      "number": 1,
      "equipmentList": {

      },
      "type": "Bohater",
      "stats": {
        "Początkowa": [4,3,3,4,4,1,3,1,7],
        "Maksymalna": [5,6,6,4,4,3,6,4,9]
      },
      "rules": ["Nieustępliwy","Seppuku","Sztuka cichej śmierci","Zimnokrwisty"],
      "exp": 8,
      "skills": [0,3,5]
    },
    "Ashigaru": {
      "id": 4,
      "startingEquipment": ["Wakizashi"],
      "cost": 15,
      "number": 15,
      "equipmentList": {
        "Broń wielka": [10,0],
        "Buława/Maczuga/Młot bojowy": [5,0],
        "Halabarda": [10,0],
        "Katana": [10,0],
        "Sztylet": [2,0],
        "Topór bojowy/Nadziak": [5,0],
        "Trójząb": [15,0],
        "Wakizashi": [5,0],
        "Włócznia": [10,0],
        "Broń miotana (gwiazdki)": [10,1],
        "Łuk": [10,1],
        "Łuk długi": [20,1],
        "Muszkiet": [25,1],
        "Oszczep": [15,1],
        "Proca": [5,1],
        "Sieć": [10,1],
        "Lekki": [5,2,"Zbroja"],
        "Średni": [15,2,"Zbroja"],
        "Hełm": [5,2]
      },
      "type": "Stronnik",
      "stats": {
        "Początkowa": [4,2,2,3,3,1,3,1,7],
        "Maksymalna": [5,6,6,4,4,3,6,4,9]
      },
      "rules": ["Chłopstwo","Drużyna obsługi","Stan niższy"]
    },
    "Samuraj": {
      "id": 5,
      "startingEquipment": ["Wakizashi","Katana"],
      "cost": 30,
      "number": 15,
      "equipmentList": {
        "Broń wielka": [10,0],
        "Buława/Maczuga/Młot bojowy": [5,0],
        "Halabarda": [10,0],
        "Katana": [10,0],
        "Sztylet": [2,0],
        "Topór bojowy/Nadziak": [5,0],
        "Trójząb": [15,0],
        "Wakizashi": [5,0],
        "Włócznia": [10,0],
        "Broń miotana (gwiazdki)": [10,1],
        "Łuk": [10,1],
        "Łuk długi": [20,1],
        "Muszkiet": [25,1],
        "Oszczep": [15,1],
        "Proca": [5,1],
        "Sieć": [10,1],
        "Lekki": [5,2,"Zbroja"],
        "Średni": [15,2,"Zbroja"],
        "Hełm": [5,2]
      },
      "type": "Stronnik",
      "stats": {
        "Początkowa": [4,4,3,3,3,1,3,1,7],
        "Maksymalna": [5,6,6,4,4,3,6,4,9]
      },
      "rules": ["Chorążowie & sygnaliści","Nieustępliwy","Seppuku","Szermierz","Zimnokrwisty","Żniwiarz"]
    },
    "Kabuki": {
      "id": 6,
      "startingEquipment": ["Wakizashi","Katana"],
      "cost": 40,
      "number": 3,
      "equipmentList": {
        "Broń wielka": [10,0],
        "Bicz": [15,0],
        "Katana": [10,0],
        "Saearath": [15,0],
        "Trójząb": [15,0],
        "Wachlarz bojowy": [30,0],
        "Włócznia": [10,0],
        "Broń miotana (gwiazdki)": [15,1]
      },
      "type": "Stronnik",
      "stats": {
        "Początkowa": [4,4,3,3,3,1,3,1,10],
        "Maksymalna": [5,6,6,4,4,3,6,4,10]
      },
      "rules": ["Fanatyk","Ochronne tatuaże","Szermierz","Zatruty atak","Żniwiarz"]
    },
    "Yabusame": {
      "id": 7,
      "startingEquipment": ["Wakizashi","Katana","Łuk długi","Rumak Elfów","Siodło & uprząż"],
      "cost": 70,
      "number": 3,
      "equipmentList": {
        "Katana": [10,0],
        "Wakizashi": [2,0],
        "Włócznia": [10,0],
        "Broń miotana (gwiazdki)": [15,1],
        "Łuk krótki": [5,1],
        "Łuk długi": [20,1],
        "Oszczep": [15,1],
        "Lekki": [5,2,"Zbroja"],
        "Hełm": [5,2]
      },
      "type": "Stronnik",
      "stats": {
        "Początkowa": [4,3,4,3,3,1,3,1,7],
        "Maksymalna": [5,6,6,4,4,3,6,4,9],
        "Rumak elfów": [9,3,0,3,3,1,4,1,5]
      },
      "rules": ["Kawalerzysta","Lekka jazda","Nieustępliwy","Seppuku","Pewny strzał","Ranger","Zimnokrwisty","Zwiadowca"]
    },
    "Oni": {
      "id": 8,
      "startingEquipment": ["Broń naturalna (wspinaczka)"],
      "cost": 200,
      "number": 1,
      "equipmentList": {

      },
      "type": "Stronnik",
      "stats": {
        "Początkowa": [6,3,0,5,4,3,2,2,8],
        "Maksymalna": [6,6,0,5,5,5,6,5,8]
      },
      "rules": ["Bycza szarża","Duży cel","Głód krwi","Głód trzewi","Nieustępliwy","Ochronne tatuaże","Odporność na magię (1)","Ograniczony","Przepastne trzewia","Seppuku","Stan niższy","Strach","Sztuka cichej śmierci","Tempy","Wielkolud","Zabójczy cios","Zimnokrwisty"]
    },
    "Tengu": {
      "id": 9,
      "startingEquipment": ["Wakizashi","Katana","Mechaniczne skrzydła"],
      "cost": 50,
      "number": 3,
      "equipmentList": {
        "Broń wielka": [10,0],
        "Buława/Maczuga/Młot bojowy": [5,0],
        "Halabarda": [10,0],
        "Katana": [10,0],
        "Sztylet": [2,0],
        "Topór bojowy/Nadziak": [5,0],
        "Trójząb": [15,0],
        "Wakizashi": [5,0],
        "Włócznia": [10,0],
        "Broń miotana (gwiazdki)": [10,1],
        "Łuk": [10,1],
        "Łuk długi": [20,1],
        "Muszkiet": [25,1],
        "Oszczep": [15,1],
        "Proca": [5,1],
        "Sieć": [10,1],
        "Lekki": [5,2,"Zbroja"],
        "Średni": [15,2,"Zbroja"],
        "Hełm": [5,2]
      },
      "type": "Stronnik",
      "stats": {
        "Początkowa": [4,3,3,3,3,1,3,1,7],
        "Maksymalna": [5,6,6,4,4,3,6,4,9]
      },
      "rules": ["Lot","Nieustępliwy","Seppuku","Ptasznik","Ranger","Zimnokrwisty","Zwiadowca"]
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
      "rules": ["Bombardowanie","Duży cel","Lot","Łatwopalny","Machina wojenna","Stanowisko strzeleckie","Trafienie z uderzenia","Uporczywość","Zawis","Zwiadowca"]
    },
    "Wóz bojowy": {
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
      "rules": ["Duży cel","Machina wojenna","Powóz","Wóz bojowy"]
    }
  },
  "limit": 500,
  "minModels": 3,
  "maxModels": 15,
  "name": "Klan wojowników z Nipponu",
  "nature": "Neutralna",
  "armyRules": ["Podatek","Rozrzutność","Seppuku"],
  "mercenaries": ["Balistyk","Bombardier","Czarownica","Kartograf","Kupiec","Magus","Medyk","Miotacz ołowiu","Ochroniarz","Rycerz najemny","Skryba","Szpieg","Woźnica","Wróżbita"],
  "unitRatios": [
    {
      "unit": "Samuraj",
      "required": "Ashigaru",
      "ratio": 1
    }
  ]
};
