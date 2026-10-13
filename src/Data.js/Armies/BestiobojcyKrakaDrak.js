// Source: Warheim.docx, Bestiobójcy z Kraka Drak. See docs/army-data-audit.md.
export const army = {
  "heroes": {
    "Łowczy": {
      "id": 0,
      "startingEquipment": ["Sztylet","Włócznia","Płaszcz z łusek morskiego smoka"],
      "cost": 75,
      "number": 1,
      "equipmentList": {
        "Broń wielka": [10,0],
        "Buława/Maczuga/Młot bojowy": [5,0],
        "Cep bojowy": [10,0],
        "Łapacz": [10,0],
        "Miecz": [10,0],
        "Sztylet": [2,0],
        "Topór bojowy/Nadziak": [5,0],
        "Włócznia": [10,0],
        "Broń miotana (topory/młoty)": [15,1],
        "Kusza": [25,1],
        "Łuk": [10,1],
        "Łuk krótki": [5,1],
        "Oszczep": [15,1],
        "Lekki": [5,2,"Zbroja"],
        "Średni": [15,2,"Zbroja"],
        "Ciężki": [30,2,"Zbroja"],
        "Tarcza": [5,2,"Tarcza"]
      },
      "type": "Bohater",
      "stats": {
        "Początkowa": [3,4,4,4,4,2,3,1,9],
        "Maksymalna": [4,7,6,4,5,3,5,4,10]
      },
      "rules": ["Dowódca","Krzepki","Nieustępliwy","Odporność na magię (2)","Rankor","Ranger","Smokobójca","Treser","Trudny do zabicia","Uporczywość","Wspinaczka","Zabobonny lęk","Zabójca potworów","Zasadzka"],
      "exp": 20,
      "skills": [0,1,3,5]
    },
    "Kowal Run": {
      "id": 1,
      "startingEquipment": ["Sztylet","Buława/Maczuga/Młot bojowy"],
      "cost": 50,
      "number": 1,
      "equipmentList": {
        "Broń wielka": [10,0],
        "Buława/Maczuga/Młot bojowy": [5,0],
        "Cep bojowy": [10,0],
        "Łapacz": [10,0],
        "Miecz": [10,0],
        "Sztylet": [2,0],
        "Topór bojowy/Nadziak": [5,0],
        "Włócznia": [10,0],
        "Broń miotana (topory/młoty)": [15,1],
        "Kusza": [25,1],
        "Łuk": [10,1],
        "Łuk krótki": [5,1],
        "Oszczep": [15,1],
        "Lekki": [5,2,"Zbroja"],
        "Średni": [15,2,"Zbroja"],
        "Ciężki": [30,2,"Zbroja"],
        "Tarcza": [5,2,"Tarcza"]
      },
      "type": "Bohater",
      "stats": {
        "Początkowa": [3,4,4,3,4,1,2,1,9],
        "Maksymalna": [4,7,6,4,5,3,5,4,10]
      },
      "rules": ["Błogosławieństwo Valayi","Kowal Run","Krzepki","Nieustępliwy","Odporność na magię (2)","Rankor","Rozproszenie magii (1)","Trudny do zabicia","Uporczywość","Wspinaczka","Zabójca potworów","Zabobonny lęk"],
      "exp": 12,
      "skills": [0,2,3,5]
    },
    "Pawężnik": {
      "id": 2,
      "startingEquipment": ["Sztylet","Włócznia","Pawęż"],
      "cost": 45,
      "number": 1,
      "equipmentList": {
        "Broń wielka": [10,0],
        "Buława/Maczuga/Młot bojowy": [5,0],
        "Cep bojowy": [10,0],
        "Łapacz": [10,0],
        "Miecz": [10,0],
        "Sztylet": [2,0],
        "Topór bojowy/Nadziak": [5,0],
        "Włócznia": [10,0],
        "Broń miotana (topory/młoty)": [15,1],
        "Kusza": [25,1],
        "Łuk": [10,1],
        "Łuk krótki": [5,1],
        "Oszczep": [15,1],
        "Lekki": [5,2,"Zbroja"],
        "Średni": [15,2,"Zbroja"],
        "Ciężki": [30,2,"Zbroja"],
        "Tarcza": [5,2,"Tarcza"]
      },
      "type": "Bohater",
      "stats": {
        "Początkowa": [3,4,3,3,4,1,2,1,9],
        "Maksymalna": [4,7,6,4,5,3,5,4,10]
      },
      "rules": ["Krzepki","Nieustępliwy","Odporność na magię (2)","Rankor","Trudny do zabicia","Uporczywość","Wspinaczka","Zabobonny lęk","Zabójca potworów","Zasadzka","Żelazoskóry"],
      "exp": 10,
      "skills": [0,3,5]
    },
    "Tropiciel": {
      "id": 3,
      "startingEquipment": ["Sztylet","Kusza"],
      "cost": 45,
      "number": 1,
      "equipmentList": {
        "Broń wielka": [10,0],
        "Buława/Maczuga/Młot bojowy": [5,0],
        "Cep bojowy": [10,0],
        "Łapacz": [10,0],
        "Miecz": [10,0],
        "Sztylet": [2,0],
        "Topór bojowy/Nadziak": [5,0],
        "Włócznia": [10,0],
        "Broń miotana (topory/młoty)": [15,1],
        "Kusza": [25,1],
        "Łuk": [10,1],
        "Łuk krótki": [5,1],
        "Oszczep": [15,1],
        "Lekki": [5,2,"Zbroja"],
        "Średni": [15,2,"Zbroja"],
        "Ciężki": [30,2,"Zbroja"],
        "Tarcza": [5,2,"Tarcza"]
      },
      "type": "Bohater",
      "stats": {
        "Początkowa": [3,4,4,3,4,1,2,1,9],
        "Maksymalna": [4,7,6,4,5,3,5,4,10]
      },
      "rules": ["Krzepki","Nieustępliwy","Odporność na magię (2)","Pułapkarz","Ranger","Rankor","Trudny do zabicia","Uporczywość","Wspinaczka","Zabobonny lęk","Zabójca potworów","Zasadzka"],
      "exp": 10,
      "skills": [0,1,4,5]
    },
    "Wojownik klanowy": {
      "id": 4,
      "startingEquipment": ["Sztylet"],
      "cost": 25,
      "number": 12,
      "equipmentList": {
        "Broń wielka": [10,0],
        "Buława/Maczuga/Młot bojowy": [5,0],
        "Cep bojowy": [10,0],
        "Miecz": [10,0],
        "Sztylet": [2,0],
        "Topór bojowy/Nadziak": [5,0],
        "Włócznia": [10,0],
        "Broń miotana (topory/młoty)": [15,1],
        "Kusza": [25,1],
        "Łuk": [10,1],
        "Łuk krótki": [5,1],
        "Proca": [5,1],
        "Sieć": [10,1],
        "Lekki": [5,2,"Zbroja"],
        "Średni": [15,2,"Zbroja"],
        "Tarcza": [5,2,"Tarcza"]
      },
      "type": "Stronnik",
      "stats": {
        "Początkowa": [3,4,3,3,4,1,2,1,9],
        "Maksymalna": [4,7,6,4,5,3,5,4,10]
      },
      "rules": ["Chorążowie & sygnaliści","Drużyna ciężkich broni (harpun)","Drużyna obsługi","Krzepki","Nieustępliwy","Odporność na magię (2)","Rankor","Trudny do zabicia","Uporczywość","Wspinaczka","Zabobonny lęk","Zabójca potworów"]
    },
    "Oblężnik z Kraka Drak": {
      "id": 5,
      "startingEquipment": ["Sztylet","Kusza","Pawęż"],
      "cost": 45,
      "number": 5,
      "equipmentList": {
        "Broń wielka": [10,0],
        "Buława/Maczuga/Młot bojowy": [5,0],
        "Cep bojowy": [10,0],
        "Miecz": [10,0],
        "Sztylet": [2,0],
        "Topór bojowy/Nadziak": [5,0],
        "Włócznia": [10,0],
        "Broń miotana (topory/młoty)": [15,1],
        "Kusza": [25,1],
        "Łuk": [10,1],
        "Łuk krótki": [5,1],
        "Proca": [5,1],
        "Sieć": [10,1],
        "Lekki": [5,2,"Zbroja"],
        "Średni": [15,2,"Zbroja"],
        "Tarcza": [5,2,"Tarcza"]
      },
      "type": "Stronnik",
      "stats": {
        "Początkowa": [3,4,3,3,4,1,2,1,9],
        "Maksymalna": [4,7,6,4,5,3,5,4,10]
      },
      "rules": ["Błyskawiczne przeładowanie","Krzepki","Nieustępliwy","Odporność na magię (2)","Ranger","Rankor","Trudny do zabicia","Uporczywość","Wspinaczka","Zabobonny lęk","Zabójca potworów","Zasadzka"]
    },
    "Pogromca Trolli": {
      "id": 6,
      "startingEquipment": ["Topór krasnoludów","Topór krasnoludów","Broń wielka"],
      "cost": 45,
      "number": 3,
      "equipmentList": {
        "Broń wielka": [10,0],
        "Buława/Maczuga/Młot bojowy": [5,0],
        "Cep bojowy": [10,0],
        "Topór bojowy/Nadziak": [5,0],
        "Topór krasnoludów": [10,0]
      },
      "type": "Stronnik",
      "stats": {
        "Początkowa": [3,4,3,3,4,1,2,1,10],
        "Maksymalna": [4,7,6,4,5,3,5,4,10]
      },
      "rules": ["Fanatyk","Krzepki","Nieustępliwy","Ochronne tatuaże","Odporność na magię (2)","Pogromca","Rankor","Topory pogromcy","Trudny do zabicia","Uporczywość","Wspinaczka","Zabobonny lęk"]
    },
    "Szablozębny": {
      "id": 7,
      "startingEquipment": ["Broń naturalna (precyzyjne uderzenie)"],
      "cost": 70,
      "number": 2,
      "equipmentList": {

      },
      "type": "Stronnik",
      "stats": {
        "Początkowa": [8,4,0,4,4,2,4,2,4],
        "Maksymalna": [8,4,0,4,4,2,4,2,4]
      },
      "rules": ["Duży cel","Głód krwi","Nienawiść","Rączy","Strach","Zwiadowca","Zwierzę"]
    },
    "Zniewolony troll": {
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
    "Niedźwiedź": {
      "id": 9,
      "startingEquipment": ["Broń naturalna"],
      "cost": 125,
      "number": 1,
      "equipmentList": {

      },
      "type": "Stronnik",
      "stats": {
        "Początkowa": [6,4,0,5,4,3,4,3,6],
        "Maksymalna": [6,4,0,5,4,3,4,3,6]
      },
      "rules": ["Bestia","Głód trzewi","Potwór","Zwiadowca","Zwierzę"]
    },
    "Wóz bojowy": {
      "id": 10,
      "startingEquipment": [],
      "cost": 175,
      "number": 1,
      "equipmentList": {

      },
      "type": "Machina",
      "stats": {
        "Powóz": ["-","-","-",4,8,8,"-","-","-"],
        "Kuc": [6,2,0,4,"-","-",2,1,5],
        "Kuc ": [6,2,0,4,"-","-",2,1,5]
      },
      "rules": ["Duży cel","Machina wojenna","Powóz","Wóz bojowy"]
    },
    "Drużyna ciężkich broni": {
      "id": 11,
      "startingEquipment": ["Sztylet"],
      "cost": 50,
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
        "Początkowa": [3,4,3,3,4,1,2,1,9],
        "Maksymalna": [4,7,6,4,5,3,5,4,10]
      },
      "rules": ["Drużyna obsługi","Krzepki","Nieustępliwy","Odporność na magię (2)","Rankor","Trudny do zabicia","Uporczywość","Wspinaczka","Zabobonny lęk","Zabójca potworów","Drużyna ciężkich broni (harpun)","Drużyna wsparcia"],
      "crewBaseCost": 50
    }
  },
  "limit": 500,
  "minModels": 3,
  "maxModels": 12,
  "name": "Bestiobójcy z Kraka Drak",
  "nature": "Neutralna",
  "armyRules": ["Alchemicy","Podatek","Zhańbiony"],
  "mercenaries": ["Goniec","Miotacz ołowiu","Ochroniarz","Ogniomistrz","Poszukiwacz złota","Strażnik dróg","Zwiadowca"]
};
