const disableOneOfChoices = (unitArr, unitList) => {
  const unitNames = unitList.map((a) => a.unitName);
  const optionsArray = Array.from(
    document.querySelectorAll("#unit-selection option")
  );

  if (unitArr.some((item) => unitNames.includes(item))) {
    unitArr.forEach((mainUnit) => {
      const removedUnitArr = unitArr.filter((e) => e !== mainUnit);

      if (unitNames.includes(mainUnit)) {
        removedUnitArr.forEach((unit) => {
          const opt = optionsArray.filter((x) => x.value === unit);
          opt[0].disabled = true;
        });
      }
    });
  } else {
    unitArr.forEach((mainUnit) => {
      const opt = optionsArray.filter((x) => x.value === mainUnit);
      opt[0].disabled = false;
    });
  }
};

export const getOneOfChoices = (army, unitList) => {
  const choices = {
    "Cyrkowcy z Ligii Ostermarku": [
      ["Magister magii", "Kapłan Ranalda"],
      ["Siłacz", "Żongler"],
      ["Ogr", "Niedźwiedź"],
      ["Zaprzęg", "Rydwan"],
    ],
    "Muszkieterzy z Nuln": [
      ["Magister magii", "Prezbiter Sigmara"],
      ["Rajtar", "Krasnoludzki Ranger"],
      ["Wóz bojowy", "Rydwan"],
    ],
    "Piechota Morska z Marienburga": [["Czarownik", "Kapłan Mannana"]],
    "Strażnicy dróg z Averlandu": [
      ["Magister magii", "Prezbiter Sigmara"],
      ["Rajtar", "Pogromca Trolli"],
      ["Zaprzęg", "Rydwan"],
    ],
    "Zbrojna kompania z Ostlandu": [
      ["Magister magii", "Prezbiter Sigmara"],
      ["Ogr", "Przepatrywacz"],
      ["Więźniarka", "Rydwan"],
    ],
    "Zbrojni z Middenheim": [
      ["Magister magii", "Kapłan Ulryka"],
      ["Wilczarz", "Przepatrywacz"],
      ["Zaprzęg", "Rydwan"],
    ],
    "Żołnierze z Reiklandu": [
      ["Rajtar", "Flagelant"],
      ["Zaprzęg", "Rydwan"],
    ],
    "Zbrojna chorągiew z Kisleva": [
      ["Kapłan Ursuna", "Magister Lodu"],
      ["Kozak", "Myśliwy"],
      ["Husarz", "Nomada"],
      ["Zaprzęg", "Rydwan"],
    ],
    "Piraci z Sartosy": [
      ["Kapłan Mannana", "Czarownik"],
      ["Przepatrywacz", "Ogr"],
      ["Więźniarka", "Rydwan"],
    ],
    "Psy Wojny": [
      ["Czarownik", "Kapłan Myrmidii"],
      ["Lansjer", "Ogr", "Ptasznik z Catrazzy"],
      ["Wóz bojowy", "Rydwan"],
    ],
    "Raubritterzy z Księstw Granicznych": [
      ["Myśliwy", "Zbójca"],
      ["Rozbójnik", "Ogr"],
      ["Więźniarka", "Rydwan"],
    ],
    "Kupiecka karawana z Arabii": [
      ["Dżinn", "Nomada"],
      ["Więźniarka", "Latający dywan"],
    ],
    "Amazonki z Lustrii": [
      ["Mara", "Zmora"],
      ["Więźniarka", "Rydwan"],
    ],
    "Gladiatorzy z Jałowej Krainy": [
      ["Szablozębny", "Pogromca Trolli"],
      ["Niedźwiedź", "Nomada", "Ogr"],
      ["Więźniarka", "Rydwan"],
    ],
    "Siostry Sigmara": [["Bitewny Ołtarz Sigmara", "Rydwan"]],
    "Leśni Elfowie z Athel Loren": [
      ["Tancerz Wojny", "Driada"],
      ["Jeździec Polany", "Drzewoduch"],
    ],
    "Elfowie Wysokiego Rodu z Ulthuan": [
      ["Rydwan z Tiranoc", "Lwi Rydwan z Chrace"],
    ],
    "Mroczni Elfowie z Naggaroth": [
      ["Widmo", "Wiedźma Khaina"],
      ["Jeździec Mroku", "Harpia"],
      ["Rydwan Zimnokrwistych", "Więźniarka"],
    ],
    "Khazadzi z Gór Krańca Świata": [
      ["Kowal Run", "Mistrz Inżynier"],
      ["Strzelec", "Górnik"],
    ],
    "Kult Pogromców z Karak Kadrin": [["Kowal Run", "Mistrz Inżynier"]],
    "Kompania Krasnoludzkich Piwowarów": [
      ["Kowal Run", "Mistrz Inżynier"],
      ["Pogromca Trolli", "Krasnoludzki Przepatrywacz"],
      ["Zaprzęg", "Powóz piwny"],
    ],
    "Szkutnicy z Barak Varr": [
      ["Kowal Run", "Mistrz Inżynier"],
      ["Ogr", "Ptasznik z Barak Varr"],
      ["Balon bojowy", "Żyrokopter"],
    ],
    "Jeźdzcy Wilków": [["Więźniarka", "Rydwan"]],
    "Zwiadowcza kompania z Królestw Ogrów": [
      ["Ogniobrzuchy", "Rzeźnik"],
      ["Gorger", "Yeti"],
    ],
    "Kult Ducha Chaosu": [
      ["Furia Chaosu", "Zwierzoczłek"],
      ["Ogr Chaosu", "Troll Chaosu"],
      ["Zaprzęg", "Rydwan Chaosu"],
    ],
    "Kult Karmazynowej Czaski": [
      ["Piekielny Ogar", "Khorngor"],
      ["Ogr Chaosu", "Troll Chaosu"],
      ["Zaprzęg", "Rydwan Chaosu"],
    ],
    "Kult Dzieci Zagłady": [
      ["Nurglingi", "Plagogor"],
      ["Ogr Chaosu", "Troll Chaosu"],
      ["Zaprzęg", "Rydwan Chaosu"],
    ],
    "Kult Purporowej Dłoni": [
      ["Tzaangor", "Różowy Strachulec"],
      ["Ogr Chaosu", "Smoczy Ogr", "Troll Chaosu"],
      ["Zaprzęg", "Rydwan Chaosu"],
    ],
    "Grasanci Chaosu": [
      ["Odrzucony", "Zwierzoczłek"],
      ["Kawalerzysta Chaosu", "Ogar Chaosu"],
      ["Ogr Chaosu", "Smoczy Ogr", "Troll Chaosu"],
      ["Więźniarka", "Rydwan Chaosu"],
    ],
    "Karnawał Chaosu": [
      ["Harlekin", "Mocarz"],
      [
        "Furia Chaosu",
        "Piekielny Ogar",
        "Nurglingi",
        "Bólożądna Pieszczota",
        "Różowy Strachulec",
      ],
      ["Tyralier", "Ogar Chaosu"],
      ["Ogr Chaosu", "Troll Chaosu"],
    ],
    "Zbrojne stado Zwierzoludzi": [["Grabieżcy", "Harpia"]],
    "Nieumarła świta Hrabiego Von Carstein": [
      ["Graveir", "Mroczny wilk"],
      ["Czarna Karoca", "Ścierwowóz"],
    ],
    "Nieumarły orszak księżnej Lahmi": [
      ["Gnilec", "Graveir"],
      ["Czarna Karoca", "Ścierwowóz"],
    ],
    "Nieumarły poczet Krwawych Smoków": [
      ["Ghoul", "Upiór"],
      ["Czarny Rycerz", "Graveir"],
      ["Czarna Karoca", "Ścierwowóz"],
    ],
    "Nieumarły sabat rodu Nekrarch": [
      ["Ghoul", "Upiór"],
      ["Graveir", "Rój nietoperzy"],
      ["Czarna Karoca", "Ścierwowóz"],
    ],
    "Nieumarły tabor ludu Strigosu": [
      ["Graveir", "Stregoica"],
      ["Czarna Karoca", "Ścierwowóz"],
    ],
    "Nieumarła horda Liczmistrza": [
      ["Ghoul", "Upiór"],
      ["Czarny Rycerz", "Graveir", "Mroczny wilk", "Rój nietoperzy"],
      ["Czarna Karoca", "Ścierwowóz"],
    ],
    "Nieumarły zastęp z Nehekhary": [
      ["Rój", "Nieumarły Nomada"],
      ["Gnilec", "Ushabti", "Grobowy Skorpion"],
    ],
    "Zwiadowcze stado klanu Eshin": [["Rydwan", "Więźniarka"]],
    "Poganiacze klanu Moulder": [["Rydwan", "Więźniarka"]],
    "Kult Zarazy klanu Pestilens": [["Rydwan", "Więźniarka"]],
    "Harcownicy klanu Skryre": [["Koło Zagłady", "Więźniarka"]],
    "Zbrojne stado klanu Mors": [["Rydwan", "Więźniarka"]],
    "Łowcze plemię Dzikich Orków": [
      ["Dziki Ork na Dziku", "Troll", "Wielki Pajonk"],
    ],
    "Plemię Leśnych Goblinów": [["Troll", "Wielki Pajonk"]],
    "Orkowie & Gobliny": [["Ork na Dziku", "Troll"]],
    "Nocne Gobliny": [
      ["Squig", "Nocny Hop-Goblin"],
      ["Troll", "Wielki Squig"],
      ["Rydwan Nocnych Goblinów", "Więźniarka"],
    ],
    "Załoga Zielonoskórych Kaprów": [
      ["Squig", "Kaper"],
      ["Troll", "Ośmiornica Bagienna"],
      ["Więźniarka", "Rydwan"],
    ],
    "Jaszczuroludzie z Lustrii": [
      ["Jeździec Zimnokrwistych", "Jeździec Terradonów"],
      ["Salamandra", "Kroxigor"],
    ],
  };

  if (choices[army.name] !== undefined) {
    choices[army.name].forEach((unit) => {
      disableOneOfChoices(unit, unitList);
    });
  }
};
