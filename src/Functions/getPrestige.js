export const mountList = {
  Dzik: 50,
  "Jaskiniowy squig": 50,
  "Koń bojowy": 50,
  Kuc: 20,
  "Lew bojowy": 80,
  "Mechaniczny wierzchowiec": 80,
  Muł: 20,
  "Nieumarły koń": 60,
  Nosorżnik: 80,
  "Obmierzły pajonk": 50,
  Rumak: 65,
  "Rumak chaosu": 65,
  "Rumak Elfów": 70,
  "Rumak Slaanesha": 60,
  Terradon: 70,
  "Wielki wilk": 65,
  Tuskgor: 60,
  Wilkoszczur: 35,
  Zimnokrwisty: 50,
};

const specialEquipmentList = {
  Bat: 10,
  Czosnek: 5,
  Kaganek: 1,
  "Karty tarota": 25,
  "Klucz nastawny": 10,
  "Kransoludzki proch": 10,
  Kropierz: 30,
  "Kucharska Księga": 30,
  Latarnia: 10,
  "Lina & hak": 5,
  Luneta: 25,
  "Magis invocationem Nehek": 50,
  Mapy: 5,
  "Mechaniczne skrzydła": 35,
  Pawęża: 10,
  Pilotka: 10,
  "Płaszcz Elfów": 20,
  "Płaszcz ze skóry lwa": 25,
  "Płaszcz ze skóry niedźwiedzia": 15,
  "Płaszcz z łusek smoka": 35,
  "Płaszcz z wilczej skóry": 35,
  Pochodnia: 2,
  "Siodło & uprząż": 10,
  "Woda błogosławiona": 5,
};

const getCustomEquipmentPrice = (equipment) => {
  if (!equipment || typeof equipment !== "object" || Array.isArray(equipment)) {
    return 0;
  }

  const parsedPrice = Number(equipment.price);
  return Number.isFinite(parsedPrice) && parsedPrice > 0 ? parsedPrice : 0;
};

export const getPrestige = (arr) => {
  arr = arr.flatMap((unit) => {
    if (!unit || !unit.campaignModelStatus?.length) return unit ? [unit] : [];
    const count = Number(unit.selectedNumber) || 1;
    const active = Array.from(
      { length: count },
      (_, i) => unit.campaignModelStatus[i],
    ).filter(
      (status) => !status?.dead && !status?.captured && !(status?.skip > 0),
    ).length;
    return active ? [{ ...unit, selectedNumber: active }] : [];
  });
  const prestigeValues = {
    heroesTotalExp: 0,
    henchmenTotalExp: 0,
    modelsNumber: 0,
    mountsNumber: 0,
    bigTargetsNumber: 0,
    warmachinesNumber: 0,
    monstersNumber: 0,
    equipmentTotalValue: 0,
    mercenariesTotalPrestige: 0,
    modelWithMountRule: 0,
    magicalItems: 0,
  };
  arr.forEach((item) => {
    if (item.unitName !== "" && item !== null) {
      prestigeValues.magicalItems +=
        (item.campaignEquipment || []).filter(
          (eq) => eq.category.startsWith("Magicz") || eq.category === "Arkana",
        ).length * (Number(item.selectedNumber) || 1);
      if (item.type === "Stronnik" || item.type === "Najemne Ostrze") {
        prestigeValues.henchmenTotalExp += item.exp * item.selectedNumber;
      }

      if (!["Najemne Ostrze", "Postać Dramatu"].includes(item.type)) {
        if (item.type === "Bohater") {
          prestigeValues.heroesTotalExp += item.exp;
        }

        if (
          item.rules.includes("Wierzchowiec") &&
          !item.rules.includes("Potwór") &&
          !item.rules.includes("Wielkolud")
        ) {
          prestigeValues.modelWithMountRule += Number(item.selectedNumber);
        }

        prestigeValues.modelsNumber += Number(item.selectedNumber);
        if (
          item.rules.includes("Wielkolud") &&
          !item.rules.includes("Potwór")
        ) {
          prestigeValues.bigTargetsNumber += Number(item.selectedNumber);
        }
        if (item.rules.includes("Potwór")) {
          prestigeValues.monstersNumber += Number(item.selectedNumber);
        }
        if (item.rules.includes("Machina wojenna")) {
          prestigeValues.warmachinesNumber += Number(item.selectedNumber);
        }
        const equipment = item.startingEquipment.concat(item.optionalEquipment);

        const equipmentList = item.equipmentList;

        equipment.forEach((eq) => {
          if (Object.keys(mountList).includes(eq)) {
            prestigeValues.mountsNumber += Number(item.selectedNumber);
            prestigeValues.equipmentTotalValue +=
              mountList[eq] * item.selectedNumber;
          }
        });

        equipment.forEach((eq) => {
          if (Object.keys(specialEquipmentList).includes(eq)) {
            prestigeValues.equipmentTotalValue +=
              specialEquipmentList[eq] * item.selectedNumber;
          }
        });

        equipment.forEach((eq) => {
          if (
            Object.keys(equipmentList).includes(eq) &&
            !Object.keys(mountList).includes(eq)
          ) {
            if (
              [
                "Harpun",
                "Ołowiomiotacz",
                "Kulomiot",
                "Miotacz spaczognia",
                "Moździerz trującego wichru",
                "Spaczrusznica",
              ].includes(eq)
            ) {
              prestigeValues.equipmentTotalValue += equipmentList[eq][0];
            } else
              prestigeValues.equipmentTotalValue +=
                equipmentList[eq][0] * item.selectedNumber;
          }
        });

        if (Array.isArray(item.customEquipment)) {
          const modelCount = Number(item.selectedNumber) || 1;
          item.customEquipment.forEach((equipment) => {
            prestigeValues.equipmentTotalValue +=
              getCustomEquipmentPrice(equipment) * modelCount;
          });
        }

        if (item.unitName === "Duże Dźgacze") {
          prestigeValues.equipmentTotalValue -= 30;
        }

        // if (item.unitName === "Drużyna ciężkich broni") {
        //   prestigeValues.equipmentTotalValue -= 50;
        // }

        // equipment.forEach((eq) => {
        //   keysSplit.forEach((key) => {
        //     if (typeof key[0] == "object") {
        //       if (key[0].includes(eq)) {
        //         prestigeValues.equipmentTotalValue +=
        //           equipmentList[keys[key[1]]][0] * item.selectedNumber;
        //       }
        //     } else if (key[0] === eq) {
        //       prestigeValues.equipmentTotalValue +=
        //         equipmentList[keys[key[1]]][0] * item.selectedNumber;
        //     }
        //   });
        // });
      } else {
        prestigeValues.mercenariesTotalPrestige += Number(item.prestige) || 0;
        if (item.type === "Postać Dramatu") {
          prestigeValues.heroesTotalExp += Math.max(
            0,
            (Number(item.exp) || 0) - 12,
          );
          for (const name of item.optionalEquipment || [])
            prestigeValues.equipmentTotalValue +=
              Number(item.equipmentList?.[name]?.[0]) || 0;
        }
        if (Array.isArray(item.customEquipment)) {
          const modelCount = Number(item.selectedNumber) || 1;
          item.customEquipment.forEach((equipment) => {
            prestigeValues.equipmentTotalValue +=
              getCustomEquipmentPrice(equipment) * modelCount;
          });
        }
      }
    }
  });
  const prestige =
    prestigeValues.heroesTotalExp +
    prestigeValues.henchmenTotalExp +
    prestigeValues.modelsNumber * 5 +
    (prestigeValues.mountsNumber + prestigeValues.modelWithMountRule) * 5 +
    prestigeValues.bigTargetsNumber * 20 +
    prestigeValues.warmachinesNumber * 25 +
    prestigeValues.monstersNumber * 50 +
    prestigeValues.equipmentTotalValue / 10 +
    prestigeValues.mercenariesTotalPrestige +
    prestigeValues.magicalItems * 5;

  return [Math.round(prestige), prestigeValues];
};
