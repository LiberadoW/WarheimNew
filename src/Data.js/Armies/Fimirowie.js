// Source: Warheim.docx, Łupieżcza kompania Fimirów. See docs/army-data-audit.md.
export const army = {
  "heroes": {
    "Meargh": {
      "id": 0,
      "startingEquipment": ["Sztylet","Kostur"],
      "cost": 80,
      "number": 1,
      "equipmentList": {
        "Kostur": [5,0],
        "Buława/Maczuga/Młot bojowy": [5,0],
        "Sztylet": [2,0],
        "Broń miotana (noże)": [10,1]
      },
      "type": "Bohater",
      "stats": {
        "Początkowa": [4,3,1,3,4,2,5,1,8],
        "Maksymalna": [5,6,3,4,5,4,6,4,9]
      },
      "rules": ["Czarna magia","Dowódca","Łuskowata skóra (6+)","Mag (Magia Demonów)","Stygmat Khorna (kolczasty ogon)","Wodny","Zasadzka","Zimnokrwisty"],
      "exp": 20,
      "skills": [0,2,3,5]
    },
    "Dirach": {
      "id": 1,
      "startingEquipment": ["Sztylet","Kostur"],
      "cost": 60,
      "number": 1,
      "equipmentList": {
        "Kostur": [5,0],
        "Buława/Maczuga/Młot bojowy": [5,0],
        "Sztylet": [2,0],
        "Broń miotana (noże)": [10,1]
      },
      "type": "Bohater",
      "stats": {
        "Początkowa": [4,3,1,3,4,1,4,1,7],
        "Maksymalna": [5,6,3,4,5,4,6,4,9]
      },
      "rules": ["Łuskowata skóra (6+)","Mag (Magia Demonów)","Stygmat Khorna (kolczasty ogon)","Wodny","Zasadzka","Zimnokrwisty"],
      "exp": 10,
      "skills": [0,3,5]
    },
    "Szlachcic Fimm": {
      "id": 2,
      "startingEquipment": ["Sztylet","Broń wielka"],
      "cost": 55,
      "number": 2,
      "equipmentList": {
        "Broń wielka": [10,0],
        "Buława/Maczuga/Młot bojowy": [5,0],
        "Gwiazda zaranna": [5,0],
        "Halabarda": [10,0],
        "Łapacz": [10,0],
        "Miecz": [10,0],
        "Sztylet": [2,0],
        "Topór bojowy/Nadziak": [5,0],
        "Włócznia": [10,0],
        "Broń miotana (noże)": [10,1],
        "Lekki": [5,2,"Zbroja"],
        "Średni": [15,2,"Zbroja"],
        "Ciężki": [30,2,"Zbroja"],
        "Tarcza": [5,2,"Tarcza"],
        "Hełm": [5,2]
      },
      "type": "Bohater",
      "stats": {
        "Początkowa": [4,4,1,3,4,1,3,1,7],
        "Maksymalna": [5,6,3,4,5,4,6,4,9]
      },
      "rules": ["Handlarz niewolników","Łuskowata skóra (6+)","Stygmat Khorna (kolczasty ogon)","Wodny","Zasadzka","Zimnokrwisty","Żertwa","Żywa tarcza"],
      "exp": 8,
      "skills": [0,3,5]
    },
    "Niewolnik": {
      "id": 3,
      "startingEquipment": ["Broń improwizowana"],
      "cost": 10,
      "number": 15,
      "equipmentList": {

      },
      "type": "Stronnik",
      "stats": {
        "Początkowa": [4,2,2,3,3,1,3,1,2],
        "Maksymalna": [5,6,6,4,4,3,6,4,9]
      },
      "rules": ["Mięso armatnie","Niewolnik","Rozmiar rzondzi"]
    },
    "Shearl": {
      "id": 4,
      "startingEquipment": ["Sztylet","Maczuga ogrów"],
      "cost": 30,
      "number": 15,
      "equipmentList": {
        "Broń wielka": [10,0],
        "Buława/Maczuga/Młot bojowy": [5,0],
        "Gwiazda zaranna": [5,0],
        "Sztylet": [2,0],
        "Topór bojowy/Nadziak": [5,0],
        "Włócznia": [10,0],
        "Broń miotana (noże)": [10,1],
        "Lekki": [5,2,"Zbroja"],
        "Tarcza": [5,2,"Tarcza"],
        "Hełm": [5,2]
      },
      "type": "Stronnik",
      "stats": {
        "Początkowa": [4,3,1,3,4,1,2,1,6],
        "Maksymalna": [5,6,3,4,5,4,6,4,9]
      },
      "rules": ["Łuskowata skóra (6+)","Stan niższy","Stygmat Khorna (kolczasty ogon)","Wodny","Zasadzka","Zimnokrwisty","Żywa tarcza"]
    },
    "Wojownik fimm": {
      "id": 5,
      "startingEquipment": ["Broń wielka","Hełm"],
      "cost": 45,
      "number": 5,
      "equipmentList": {
        "Broń wielka": [10,0],
        "Buława/Maczuga/Młot bojowy": [5,0],
        "Gwiazda zaranna": [5,0],
        "Halabarda": [10,0],
        "Łapacz": [10,0],
        "Miecz": [10,0],
        "Sztylet": [2,0],
        "Topór bojowy/Nadziak": [5,0],
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
        "Początkowa": [4,4,1,3,4,1,2,1,6],
        "Maksymalna": [5,6,3,4,5,4,6,4,9]
      },
      "rules": ["Chorążowie & sygnaliści","Łuskowata skóra (6+)","Stygmat Khorna (kolczasty ogon)","Szermierz","Wodny","Zasadzka","Zimnokrwisty","Żywa tarcza"]
    },
    "Mniejszy demon": {
      "id": 6,
      "startingEquipment": ["Broń naturalna (szybki)"],
      "cost": 45,
      "number": 5,
      "equipmentList": {

      },
      "type": "Stronnik",
      "stats": {
        "Początkowa": [4,4,0,4,3,1,4,2,6],
        "Maksymalna": [4,4,0,4,3,4,4,2,6]
      },
      "rules": ["Demon","Głód krwi","Lot"]
    },
    "Ośmiornica Bagienna": {
      "id": 7,
      "startingEquipment": ["Broń naturalna (przebicie pancerza)"],
      "cost": 200,
      "number": 1,
      "equipmentList": {

      },
      "type": "Stronnik",
      "stats": {
        "Początkowa": ["2K6",3,"-",4,5,3,2,"K6+1",5],
        "Maksymalna": ["2K6",3,"-",4,5,3,2,"K6+1",5]
      },
      "rules": ["Głód krwi","Głód trzewi","Kamuflaż","Murołaz","No to hooop!","Potwór","Stygmaty Nurgla (odór)","Ugryzienie","Wodny","Zbrojne kończyny","Zimnokrwisty","Zwiadowca","Zwierzę"]
    },
    "Bagienna Bestia": {
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
      "rules": ["Bycza szarża","Demon","Duży cel","Konstrukt","Łuskowata skóra (4+)","Przepastne trzewia","Regeneracja","Stygmaty nurgla (rój much)","Wielkolud","Wodny","Żrąca plwocina"]
    },
    "Więźniarka": {
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
      "rules": ["Duży cel","Machina wojenna","Powóz","Więźniarka"]
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
    }
  },
  "limit": 500,
  "minModels": 3,
  "maxModels": 15,
  "name": "Łupieżcza kompania Fimirów",
  "nature": "Zła",
  "armyRules": ["Podatek","Stworzenia mgły i mroku"],
  "mercenaries": []
};
