// Source: Warheim.docx, Eteryczny dwór Króla kurhanów. See docs/army-data-audit.md.
export const army = {
  "heroes": {
    "Król kurhanów": {
      "id": 0,
      "startingEquipment": ["Miecz"],
      "cost": 130,
      "number": 1,
      "equipmentList": {
        "Broń wielka": [10,0],
        "Buława/Maczuga/Młot bojowy": [5,0],
        "Gwiazda zaranna": [5,0],
        "Halabarda": [10,0],
        "Korbacz": [5,0],
        "Kostur": [5,0],
        "Miecz": [10,0],
        "Sztylet": [2,0],
        "Topór bojowy/Nadziak": [5,0],
        "Włócznia": [10,0],
        "Broń miotana (noże)": [10,1],
        "Lekki": [10,2,"Zbroja"],
        "Średni": [30,2,"Zbroja"],
        "Ciężki": [60,2,"Zbroja"],
        "Hełm": [5,2]
      },
      "type": "Bohater",
      "stats": {
        "Początkowa": [5,4,3,3,4,3,4,2,8],
        "Maksymalna": [6,6,6,4,5,5,6,4,10]
      },
      "rules": ["Dowódca","Głód trzewi","Istota eteryczna","Klątwa Księcia Grobowców","Przepastne trzewia","Strach","Wielkolud"],
      "exp": 20,
      "skills": [0,3,5]
    },
    "Profeta": {
      "id": 1,
      "startingEquipment": ["Kostur"],
      "cost": 120,
      "number": 1,
      "equipmentList": {
        "Broń wielka": [10,0],
        "Buława/Maczuga/Młot bojowy": [5,0],
        "Gwiazda zaranna": [5,0],
        "Halabarda": [10,0],
        "Korbacz": [5,0],
        "Kostur": [5,0],
        "Miecz": [10,0],
        "Sztylet": [2,0],
        "Topór bojowy/Nadziak": [5,0],
        "Włócznia": [10,0],
        "Broń miotana (noże)": [10,1],
        "Lekki": [10,2,"Zbroja"],
        "Średni": [30,2,"Zbroja"],
        "Ciężki": [60,2,"Zbroja"],
        "Hełm": [5,2],
        "Domena Nehekhary": [0,4,"Tradycja"],
        "Magia Żywiołów": [0,4,"Tradycja"]
      },
      "type": "Bohater",
      "stats": {
        "Początkowa": [5,2,2,3,3,3,3,2,7],
        "Maksymalna": [6,6,6,4,5,5,6,4,10]
      },
      "rules": ["Głód trzewi","Istota eteryczna","Mag (Domena Nehekhary albo Magia Żywiołów)","Przepastne trzewia","Wielkolud"],
      "exp": 10,
      "skills": [0,2,5],
      "requiredEquipmentGroups": ["Tradycja"]
    },
    "Protektor": {
      "id": 2,
      "startingEquipment": ["Broń wielka","Hełm"],
      "cost": 110,
      "number": 1,
      "equipmentList": {
        "Broń wielka": [10,0],
        "Buława/Maczuga/Młot bojowy": [5,0],
        "Gwiazda zaranna": [5,0],
        "Halabarda": [10,0],
        "Korbacz": [5,0],
        "Kostur": [5,0],
        "Miecz": [10,0],
        "Sztylet": [2,0],
        "Topór bojowy/Nadziak": [5,0],
        "Włócznia": [10,0],
        "Broń miotana (noże)": [10,1],
        "Lekki": [10,2,"Zbroja"],
        "Średni": [30,2,"Zbroja"],
        "Ciężki": [60,2,"Zbroja"],
        "Hełm": [5,2]
      },
      "type": "Bohater",
      "stats": {
        "Początkowa": [5,4,3,3,3,3,3,2,7],
        "Maksymalna": [6,6,6,4,5,5,6,4,10]
      },
      "rules": ["Głód trzewi","Istota eteryczna","Przepastne trzewia","Wielkolud","Żywa tarcza"],
      "exp": 8,
      "skills": [0,3,5]
    },
    "Duch": {
      "id": 3,
      "startingEquipment": ["Sztylet"],
      "cost": 30,
      "number": 12,
      "equipmentList": {
        "Buława/Maczuga/Młot bojowy": [5,0],
        "Gwiazda zaranna": [5,0],
        "Halabarda": [10,0],
        "Miecz": [10,0],
        "Sztylet": [2,0],
        "Topór bojowy/Nadziak": [5,0],
        "Broń miotana (noże)": [10,1],
        "Lekki": [5,2,"Zbroja"],
        "Hełm": [5,2]
      },
      "type": "Stronnik",
      "stats": {
        "Początkowa": [5,2,2,3,3,1,3,2,7],
        "Maksymalna": [5,2,2,3,3,1,3,2,7]
      },
      "rules": ["Chorążowie & sygnaliści","Istota eteryczna"]
    },
    "Błędny ognik": {
      "id": 4,
      "startingEquipment": ["Broń naturalna (magiczny atak)"],
      "cost": 50,
      "number": 3,
      "equipmentList": {

      },
      "type": "Stronnik",
      "stats": {
        "Początkowa": [6,2,2,2,2,1,1,1,7],
        "Maksymalna": [6,2,2,2,2,1,1,1,7]
      },
      "rules": ["Hipnotyczne spojrzenie","Istota eteryczna","Istota magiczna (Tradycja Cienia)","Kamuflaż","Podżeganie","Uwodzenie"]
    },
    "Upiór": {
      "id": 5,
      "startingEquipment": ["Sztylet"],
      "cost": 130,
      "number": 1,
      "equipmentList": {
        "Broń wielka": [10,0],
        "Buława/Maczuga/Młot bojowy": [5,0],
        "Gwiazda zaranna": [5,0],
        "Halabarda": [10,0],
        "Miecz": [10,0],
        "Sztylet": [2,0],
        "Topór bojowy/Nadziak": [5,0],
        "Włócznia": [10,0],
        "Broń miotana (noże)": [10,1],
        "Lekki": [10,2,"Zbroja"],
        "Średni": [30,2,"Zbroja"],
        "Hełm": [5,2]
      },
      "type": "Stronnik",
      "stats": {
        "Początkowa": [5,2,2,3,3,3,3,2,7],
        "Maksymalna": [6,6,6,4,5,5,6,4,10]
      },
      "rules": ["Dotyk upiora","Głód trzewi","Istota eteryczna","Przepastne trzewia","Świadomy","Wielkolud"]
    },
    "Zjawa": {
      "id": 6,
      "startingEquipment": ["Sztylet"],
      "cost": 130,
      "number": 1,
      "equipmentList": {
        "Broń wielka": [10,0],
        "Buława/Maczuga/Młot bojowy": [5,0],
        "Gwiazda zaranna": [5,0],
        "Halabarda": [10,0],
        "Miecz": [10,0],
        "Sztylet": [2,0],
        "Topór bojowy/Nadziak": [5,0],
        "Włócznia": [10,0],
        "Broń miotana (noże)": [10,1],
        "Lekki": [10,2,"Zbroja"],
        "Średni": [30,2,"Zbroja"],
        "Hełm": [5,2]
      },
      "type": "Stronnik",
      "stats": {
        "Początkowa": [5,2,2,3,3,3,3,2,7],
        "Maksymalna": [6,6,6,4,5,5,6,4,10]
      },
      "rules": ["Dotyk zjawy","Głód trzewi","Istota eteryczna","Przepastne trzewia","Świadomy","Wielkolud"]
    },
    "Widmo": {
      "id": 7,
      "startingEquipment": ["Sztylet"],
      "cost": 130,
      "number": 1,
      "equipmentList": {
        "Broń wielka": [10,0],
        "Buława/Maczuga/Młot bojowy": [5,0],
        "Gwiazda zaranna": [5,0],
        "Halabarda": [10,0],
        "Miecz": [10,0],
        "Sztylet": [2,0],
        "Topór bojowy/Nadziak": [5,0],
        "Włócznia": [10,0],
        "Broń miotana (noże)": [10,1],
        "Lekki": [10,2,"Zbroja"],
        "Średni": [30,2,"Zbroja"],
        "Hełm": [5,2]
      },
      "type": "Stronnik",
      "stats": {
        "Początkowa": [5,2,2,3,3,3,3,2,7],
        "Maksymalna": [6,6,6,4,5,5,6,4,10]
      },
      "rules": ["Głód trzewi","Istota eteryczna","Oplątanie","Przepastne trzewia","Rozmiar rzondzi","Świadomy","Wielkolud"]
    },
    "Banshee": {
      "id": 8,
      "startingEquipment": ["Sztylet"],
      "cost": 130,
      "number": 1,
      "equipmentList": {
        "Broń wielka": [10,0],
        "Buława/Maczuga/Młot bojowy": [5,0],
        "Gwiazda zaranna": [5,0],
        "Halabarda": [10,0],
        "Miecz": [10,0],
        "Sztylet": [2,0],
        "Topór bojowy/Nadziak": [5,0],
        "Włócznia": [10,0],
        "Broń miotana (noże)": [10,1],
        "Lekki": [10,2,"Zbroja"],
        "Średni": [30,2,"Zbroja"],
        "Hełm": [5,2]
      },
      "type": "Stronnik",
      "stats": {
        "Początkowa": [5,2,2,3,3,3,3,2,7],
        "Maksymalna": [6,6,6,4,5,5,6,4,10]
      },
      "rules": ["Głód trzewi","Istota eteryczna","Krzyk banshee","Przepastne trzewia","Świadomy","Wielkolud"]
    },
    "Łódź umarłych": {
      "id": 9,
      "startingEquipment": [],
      "cost": 150,
      "number": 1,
      "equipmentList": {

      },
      "type": "Machina",
      "stats": {
        "Powóz": [8,"-","-",4,8,8,"-","-","-"],
        "Furman": ["-",3,"-",3,"-","-",4,1,7]
      },
      "rules": ["Duży cel","Furman","Istota eteryczna","Karawan","Łódź umarłych","Machina wojenna","Powóz"]
    }
  },
  "limit": 500,
  "minModels": 3,
  "maxModels": 12,
  "name": "Eteryczny dwór Króla kurhanów",
  "nature": "Zła",
  "armyRules": ["Kontrolowanie ożywieńców","Rozrzutność"],
  "mercenaries": []
};
