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
    unitArr.forEach(mainUnit=>{
      const opt = optionsArray.filter((x) => x.value === mainUnit);
      opt[0].disabled = false;
    })
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
    "Khazadzi z Gór Krańca Świata": [
      ["Kowal Run", "Mistrz Inżynier"],
      ["Strzelec", "Górnik"],
    ],
  };

  if (choices[army.name] !== undefined) {
    choices[army.name].forEach((unit) => {
      disableOneOfChoices(unit, unitList);
    });
  }
};
