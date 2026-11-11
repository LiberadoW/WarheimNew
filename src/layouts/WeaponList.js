import React, { useContext, useState } from "react";
import "../styles/WeaponList.css";
import { addCommandCost } from "../Functions/addCommandCost";
import { setCommandNumberModels } from "../Functions/setCommandNumberModels";
import mageEquipmentList from "../Data.js/MageEquipmentList";
import { getItemText } from "../Functions/getItemText";
import { CommandContext } from "./Builder";
import { getValueOfOptionalEquipment } from "../Functions/getValueOfOptionalEquipment";
import RulesModal from "../Components/RulesModal";
import { getRuleText, getWeaponRuleNames } from "../Functions/getRuleText";
import { getEquipmentStats } from "../Data.js/EquipmentStats";
import {
  EQUIPMENT_CATEGORIES,
  countOccurrences,
  countStartingChoices,
  getDefaultAlias,
  getEquipmentAliases,
  getEquipmentOptions,
  getSelectedAliases,
  getWeaponLimit,
} from "../Functions/equipmentSelection";

const ADD_LABELS = [
  "+ Dodaj broń do walki wręcz",
  "+ Dodaj broń dystansową",
  "+ Dodaj pancerz",
  "+ Dodaj wyposażenie specjalne",
  "+ Wybierz kolegium magii",
];

const countCommandModels = (unit) =>
  unit.optionalEquipment.filter(
    (item) => item === "Chorąży" || item === "Sygnalista"
  ).length;

const EquipmentStatsLine = ({ name, unit }) => {
  const stats = getEquipmentStats(name);

  if (!stats) {
    const text = getItemText(name, unit);
    return text ? <p className="equipment-item-text">{text}</p> : null;
  }

  return (
    <dl className="equipment-item-stats">
      {stats.armour ? (
        <div>
          <dt>Ochrona</dt>
          <dd>{stats.armour}</dd>
        </div>
      ) : (
        <>
          <div>
            <dt>Zasięg</dt>
            <dd>{stats.range}</dd>
          </div>
          <div>
            <dt>Siła</dt>
            <dd>{stats.strength}</dd>
          </div>
        </>
      )}
      {stats.rules && (
        <div className="equipment-item-rules">
          <dt>Zasady</dt>
          <dd>{stats.rules}</dd>
        </div>
      )}
    </dl>
  );
};

const WeaponList = ({ heroes, id, unitList, setUnitList, army }) => {
  const [inspectedEquipment, setInspectedEquipment] = useState(null);
  const { standardBearer, setStandardBearer, musician, setMusician } =
    useContext(CommandContext);

  const baseCost =
    unitList[id].type !== "Najemne Ostrze"
      ? heroes[unitList[id].unitName].cost
      : null;

  const isCommandGroup = unitList[id].rules.includes("Chorążowie & sygnaliści");

  const handleWeaponListClick = (target) => {
    const unit = unitList[target.className];
    const equipmentList = unit.optionalEquipment;
    const canonicalName = target.name;
    const selectedAlias = target.getAttribute("data-alias");
    const equipmentAliases = getEquipmentAliases(canonicalName);
    const hasStartingCanonical = unit.startingEquipment.includes(canonicalName);
    const defaultAlias = getDefaultAlias(canonicalName);
    const isSplitAliasOption = Boolean(
      selectedAlias && equipmentAliases.includes(selectedAlias)
    );
    let isHandledByAliasLogic = false;

    if (isSplitAliasOption) {
      if (!unit.equipmentAliasSelections) {
        unit.equipmentAliasSelections = {};
      }

      const selectedAliases = getSelectedAliases(unit, canonicalName);
      const isBaseStartingAlias =
        hasStartingCanonical &&
        selectedAlias === defaultAlias &&
        !selectedAliases.includes(selectedAlias);

      if (!target.checked && isBaseStartingAlias) {
        setUnitList([...unitList]);
        return;
      }

      if (target.checked) {
        if (!selectedAliases.includes(selectedAlias)) {
          selectedAliases.push(selectedAlias);
          equipmentList.push(canonicalName);
        }
      } else {
        const aliasIndex = selectedAliases.indexOf(selectedAlias);
        if (aliasIndex !== -1) {
          selectedAliases.splice(aliasIndex, 1);
        }

        const canonicalIndex = equipmentList.indexOf(canonicalName);
        if (canonicalIndex !== -1) {
          equipmentList.splice(canonicalIndex, 1);
        }
      }

      if (selectedAliases.length > 0) {
        unit.equipmentAliasSelections[canonicalName] = selectedAliases;
      } else {
        delete unit.equipmentAliasSelections[canonicalName];
      }

      isHandledByAliasLogic = true;
    }

    if (unit.unitName === "Troll") {
      if (target.name === "Troll Górski" && target.checked === true) {
        unit.rules = [
          "Bycza szarża",
          "Duży cel",
          "Głód trzewi",
          "Głupota",
          "Nieświadomy",
          "Niezłomny",
          "Ochronne tatuaże",
          "Przepastne trzewia",
          "Regeneracja",
          "Strach",
          "Wielkolud",
          "Żrąca plwocina",
          "Odporność na magię (2)",
          "Łuskowata skóra (5+)",
          "Pomiot podmroku",
        ];
      } else if (
        target.name === "Troll Rzeczny" &&
        target.checked === true
      ) {
        unit.rules = [
          "Bycza szarża",
          "Duży cel",
          "Głód trzewi",
          "Głupota",
          "Nieświadomy",
          "Niezłomny",
          "Ochronne tatuaże",
          "Przepastne trzewia",
          "Regeneracja",
          "Strach",
          "Wielkolud",
          "Żrąca plwocina",
          "Nurek",
          "Stygmat Nurgla (odór)",
          "Wodny",
        ];
      } else {
        unit.rules = [
          "Bycza szarża",
          "Duży cel",
          "Głód trzewi",
          "Głupota",
          "Nieświadomy",
          "Niezłomny",
          "Ochronne tatuaże",
          "Przepastne trzewia",
          "Regeneracja",
          "Strach",
          "Wielkolud",
          "Żrąca plwocina",
        ];
      }
    }

    const spellSchools = Object.fromEntries(
      Object.entries(unit.equipmentList).filter(
        ([key, value]) => value[1] === 4
      )
    );

    if (unit.equipmentList[target.name]?.[1] === 4) {
      const mageEquipment = mageEquipmentList[target.name]?.equipment || {};
      const usesLoreEquipment = !Object.values(heroes[unit.unitName]?.equipmentList || {}).some(
        (value) => value[1] < 3
      );


      if (unit.rules.includes(target.name)) {
        unit.rules.splice(unit.rules.indexOf(target.name), 1);
      } else {
        unit.rules.push(target.name);
      }

      if (target.checked === true) {
        if (usesLoreEquipment &&
          Object.values(unit.equipmentList).filter((x) => x.length === 2)
            .length === 0
        ) {
          Object.entries(mageEquipment).forEach(([key, value]) => {
            unit.equipmentList[key] = value;
          });
        }

        if (unit.unitName !== "Panna Graala") {
          if (heroes[unit.unitName].skills?.length === 0 && mageEquipmentList[target.name]) {
            unit.skills = mageEquipmentList[target.name].skills;
          }
        } else {
          unit.equipmentList["Rumak"] = [55, 3];
        }
      } else {
        const differentEquipmentNames = Object.keys(unit.equipmentList).filter(
          (x) => Object.keys(mageEquipment).includes(x)
        );

        if (usesLoreEquipment && Object.keys(mageEquipment).length > 0 &&
          JSON.stringify(differentEquipmentNames) ===
          JSON.stringify(Object.keys(mageEquipment))
        ) {
          unit.equipmentList = spellSchools;
        }

        if (usesLoreEquipment) {
          unit.optionalEquipment = [];
          unit.cost = heroes[unit.unitName].cost;
        }

        if (unit.unitName !== "Panna Graala") {
          if (heroes[unit.unitName].skills?.length === 0 && mageEquipmentList[target.name]) {
            unit.skills = [];
          }
        } else {
          unit.equipmentList["Rumak"] = [55, 3];
        }
      }
    } else if (!isHandledByAliasLogic) {
      if (equipmentList.includes(canonicalName)) {
        equipmentList.splice(equipmentList.indexOf(canonicalName), 1);
      } else {
        equipmentList.push(canonicalName);
      }
    }

    if (target.name === "Rumak" || target.name === "Koń bojowy") {
      if (target.checked === true) {
        unit.stats[target.name] = [8, 3, 0, 3, "-", "-", 3, 1, 5];
      } else {
        delete unit.stats[target.name];
      }
    }

    if (target.name === "Wielki wilk") {
      if (target.checked === true) {
        unit.stats["Wielki wilk"] = [9, 3, 0, 4, "-", "-", 3, 1, 3];
      } else {
        delete unit.stats["Wielki wilk"];
      }
    }

    // for units which have options for starting weapons
    if (target.group === "Startowy") {
      const howManyChecked = countStartingChoices(unit);

      const valueOfOptionalEquipment = getValueOfOptionalEquipment([
        unitList[id],
      ]);

      // if (unitList[id].unitName === "Debeściak" || unitList[id].unitName === "Debeściak Dzikich Orków") {
      //   if (target.name === "Rembak" && target.checked === true) {
      //     unitList[id].optionalEquipment.push("Sztylet")
      //   } else if (target.name === "Rembak" && target.checked === false) {
      //     unitList[id].optionalEquipment.splice(unitList[id].optionalEquipment.indexOf("Sztylet"),1)
      //   }
      // }

      if (howManyChecked === 1) {
        unit.cost = target.checked
          ? unit.cost + 0
          : unit.cost - Number(target.value);
      } else if (howManyChecked === 0) {
        unit.cost = baseCost + valueOfOptionalEquipment;
      } else {
        unit.cost = target.checked
          ? unit.cost + Number(target.value)
          : unit.cost - Number(target.value);
      }
    } else {
      unit.cost = target.checked
        ? unit.cost + Number(target.value)
        : unit.cost - Number(target.value);
    }

    if (isCommandGroup) {
      const howManyCommandChecked = countCommandModels(unit);
      unit.totalCost =
        unit.cost * unit.selectedNumber + howManyCommandChecked * 20;
    } else if (heroes[unit.unitName]?.crewBaseCost) {
      const sharedWeaponCost = unit.optionalEquipment.reduce((sum, name) =>
        sum + (["Harpun", "Ołowiomiotacz"].includes(name) ? unit.equipmentList[name][0] : 0), 0);
      unit.totalCost = unit.cost * unit.selectedNumber - heroes[unit.unitName].crewBaseCost - sharedWeaponCost;
    } else if (unitList[id].unitName === "Duże Dźgacze") {
      unit.totalCost = unit.cost * unit.selectedNumber - 100;
    } else if (
      unitList[id].unitName === "Drużyna ciężkich broni" &&
      !unitList[id].rules.includes("Animozja") &&
      army.name !== "Piechota Morska z Marienburga" &&
      army.name !== "Piraci z Sartosy"
    ) {
      if (
        [
          "Kulomiot",
          "Miotacz spaczognia",
          "Moździerz trującego wichru",
          "Spaczrusznica",
        ].some((element) => unitList[id].optionalEquipment.includes(element))
      ) {
        unit.totalCost = unit.cost * unit.selectedNumber - 110;
      } else {
        unit.totalCost = unit.cost * unit.selectedNumber - 60;
      }
    } else if (
      unitList[id].unitName === "Drużyna ciężkich broni" &&
      unitList[id].rules.includes("Animozja")
    ) {
      if (
        ["Harpun", "Ołowiomiotacz"].some((element) =>
          unitList[id].optionalEquipment.includes(element)
        )
      ) {
        unit.totalCost = unit.cost * unit.selectedNumber - 80;
      } else {
        unit.totalCost = unit.cost * unit.selectedNumber - 30;
      }
    } else if (
      unitList[id].unitName === "Drużyna ciężkich broni" &&
      army.name === "Piechota Morska z Marienburga"
    ) {
      if (
        ["Harpun", "Ołowiomiotacz"].some((element) =>
          unitList[id].optionalEquipment.includes(element)
        )
      ) {
        unit.totalCost = unit.cost * unit.selectedNumber - 110;
      } else {
        unit.totalCost = unit.cost * unit.selectedNumber - 60;
      }
    } else if (
      unitList[id].unitName === "Drużyna ciężkich broni" &&
      army.name === "Piraci z Sartosy"
    ) {
      if (
        ["Harpun", "Ołowiomiotacz"].some((element) =>
          unitList[id].optionalEquipment.includes(element)
        )
      ) {
        unit.totalCost = unit.cost * unit.selectedNumber - 90;
      } else {
        unit.totalCost = unit.cost * unit.selectedNumber - 40;
      }
    } else {
      unit.totalCost = unit.cost * unit.selectedNumber;
    }

    const newUnitList = [...unitList];
    setUnitList(newUnitList);
  };

  const handleWeaponListClick2 = (target) => {
    const unit = unitList[target.className];
    const equipmentList = unitList[target.className].optionalEquipment;
    const canonicalName = target.name;
    const selectedAlias = target.getAttribute("data-alias");
    const equipmentAliases = getEquipmentAliases(canonicalName);
    const isSplitAliasOption = Boolean(
      selectedAlias && equipmentAliases.includes(selectedAlias)
    );

    if (isSplitAliasOption) {
      if (!unit.equipmentAliasSelections) {
        unit.equipmentAliasSelections = {};
      }

      const selectedAliases = getSelectedAliases(unit, canonicalName);
      const hasStartingCanonical = unit.startingEquipment.includes(canonicalName);
      const defaultAlias = getDefaultAlias(canonicalName);
      const startingAliasCount =
        hasStartingCanonical && selectedAlias === defaultAlias
          ? countOccurrences(unit.startingEquipment, canonicalName)
          : 0;
      const selectedAliasCount = countOccurrences(selectedAliases, selectedAlias);
      const totalAliasCount = startingAliasCount + selectedAliasCount;

      // second checkbox can only extend an already-selected alias
      if (target.checked && totalAliasCount < 1) {
        setUnitList([...unitList]);
        return;
      }

      if (target.checked) {
        selectedAliases.push(selectedAlias);
        equipmentList.push(canonicalName);
      } else if (selectedAliasCount > 0) {
        const aliasIndex = selectedAliases.lastIndexOf(selectedAlias);
        if (aliasIndex !== -1) {
          selectedAliases.splice(aliasIndex, 1);
        }

        const canonicalIndex = equipmentList.indexOf(canonicalName);
        if (canonicalIndex !== -1) {
          equipmentList.splice(canonicalIndex, 1);
        }
      } else {
        setUnitList([...unitList]);
        return;
      }

      if (selectedAliases.length > 0) {
        unit.equipmentAliasSelections[canonicalName] = selectedAliases;
      } else {
        delete unit.equipmentAliasSelections[canonicalName];
      }
    } else if (
      equipmentList
        .concat(unitList[id].startingEquipment)
        .filter((x) => x === target.name).length === 2
    ) {
      equipmentList.splice(equipmentList.indexOf(target.name), 1);
    } else {
      equipmentList.push(target.name);
    }

    // for units which have options for starting weapons
    if (target.group === "Startowy") {
      const howManyChecked = countStartingChoices(unit);

      if (howManyChecked === 1) {
        unit.cost = target.checked
          ? unit.cost + 0
          : unit.cost - Number(target.value);
      } else if (howManyChecked === 0) {
        unit.cost = target.checked ? unit.cost + 0 : unit.cost - 0;
      } else {
        unit.cost = target.checked
          ? unit.cost + Number(target.value)
          : unit.cost - Number(target.value);
      }
    } else {
      unit.cost = target.checked
        ? unit.cost + Number(target.value)
        : unit.cost - Number(target.value);
    }

    if (isCommandGroup) {
      const howManyCommandChecked = countCommandModels(unit);
      unit.totalCost =
        unit.cost * unit.selectedNumber + howManyCommandChecked * 20;
    } else {
      unit.totalCost = unit.cost * unit.selectedNumber;
    }

    const newUnitList = [...unitList];
    setUnitList(newUnitList);
  };

  const handleCommandClick = (e) => {
    const arr = unitList[id].optionalEquipment;
    if (e.target.checked) {
      arr.push(e.target.name);
      e.target.name === "Chorąży"
        ? setStandardBearer(e.target.className)
        : setMusician(e.target.className);
    } else {
      arr.splice(arr.indexOf(e.target.name), 1);
      e.target.name === "Chorąży" ? setStandardBearer(null) : setMusician(null);
    }

    if (arr.includes("Chorąży") && arr.includes("Sygnalista")) {
      unitList[id].number = 2;
      unitList[id].selectedNumber = 2;
    } else if (arr.includes("Chorąży") || arr.includes("Sygnalista")) {
      unitList[id].number = 2;
      unitList[id].selectedNumber = 1;
    } else {
      unitList[id].number = heroes[unitList[id].unitName].number;
    }

    unitList[id].selectedNumber = setCommandNumberModels(arr);

    unitList[id].totalCost = addCommandCost(
      unitList[id].cost,
      unitList[id].selectedNumber,
      arr
    );

    const newUnitList = [...unitList];
    newUnitList.sort();
    setUnitList(newUnitList);
  };
  const toTarget = (option, checked) => ({
    name: option.canonicalName,
    checked,
    value: option.cost,
    group: option.group,
    className: id,
    getAttribute: (attribute) =>
      attribute === "data-alias" ? option.alias ?? null : null,
  });

  const options = getEquipmentOptions(unitList[id]);

  const handleAdd = (key) => {
    const option = options.find((item) => item.key === key);
    if (!option?.addSlot) {
      return;
    }

    if (option.addSlot === "first") {
      handleWeaponListClick(toTarget(option, true));
    } else {
      handleWeaponListClick2(toTarget(option, true));
    }
  };

  const handleRemove = (option) => {
    if (option.removeSlot === "first") {
      handleWeaponListClick(toTarget(option, false));
    } else if (option.removeSlot === "second") {
      handleWeaponListClick2(toTarget(option, false));
    }
  };

  const inspectedName = inspectedEquipment
    ? getEquipmentStats(inspectedEquipment.displayName)
      ? inspectedEquipment.displayName
      : inspectedEquipment.canonicalName
    : null;
  const inspectedRules = inspectedName
    ? [...new Set(getWeaponRuleNames(getEquipmentStats(inspectedName)?.rules))]
    : [];

  const weaponLimit = getWeaponLimit(unitList[id]);
  const categories = EQUIPMENT_CATEGORIES.map((name, index) => ({
    name,
    index,
    options: options.filter((option) => option.category === index),
  })).filter((category) => category.options.length > 0);

  return (
    <div className="equipment-editor">
      {categories.map((category) => {
        const taken = category.options.filter((option) => option.copies > 0);
        const takenSlots = taken.reduce(
          (sum, option) =>
            sum +
            (category.index === 0 && option.canonicalName === "Sztylet"
              ? 0
              : option.copies),
          0
        );

        return (
          <section className="equipment-category" key={category.name}>
            <div className="equipment-category-header">
              <h4>{category.name}</h4>
              {category.index <= 1 && (
                <span className="equipment-category-count">
                  {`${takenSlots}/${weaponLimit}`}
                </span>
              )}
            </div>

            {taken.length === 0 ? (
              <p className="equipment-empty">Brak</p>
            ) : (
              <ul className="equipment-items">
                {taken.map((option) => {
                  const paidCopies =
                    option.copies - (option.isStarting ? 1 : 0);

                  return (
                    <li className="equipment-item" key={option.key}>
                      <div className="equipment-item-main">
                        <span className="equipment-item-name">
                          <button
                            type="button"
                            className="equipment-details-link"
                            onClick={() => setInspectedEquipment(option)}
                            aria-haspopup="dialog"
                            aria-label={`Pokaż statystyki i zasady: ${option.displayName}`}
                          >
                            {option.displayName}
                          </button>
                          {option.copies === 2 && (
                            <span className="equipment-badge">×2</span>
                          )}
                          {option.isStarting && (
                            <span className="equipment-badge">startowe</span>
                          )}
                        </span>
                        <span className="equipment-item-cost">
                          {paidCopies > 0
                            ? `${option.cost * paidCopies} zk`
                            : "w cenie"}
                        </span>
                        {option.removeSlot ? (
                          <button
                            type="button"
                            className="equipment-remove"
                            data-equipment={option.displayName}
                            onClick={() => handleRemove(option)}
                            aria-label={`Usuń: ${option.displayName}`}
                            title="Usuń"
                          >
                            ×
                          </button>
                        ) : (
                          <span className="equipment-remove-placeholder" />
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}

            <select
              className="equipment-add"
              value=""
              onChange={(e) => handleAdd(e.target.value)}
              aria-label={ADD_LABELS[category.index]}
            >
              <option value="">{ADD_LABELS[category.index]}</option>
              {category.options.map((option) => (
                <option
                  key={option.key}
                  value={option.key}
                  data-name={option.displayName}
                  disabled={!option.addSlot}
                >
                  {`${option.displayName}${
                    option.addSlot === "second" ? " (druga)" : ""
                  } — ${option.cost} zk${
                    option.blockReason ? ` · ${option.blockReason}` : ""
                  }`}
                </option>
              ))}
            </select>
          </section>
        );
      })}

      {inspectedEquipment && (
        <RulesModal
          title={inspectedEquipment.displayName}
          sections={[{
            title: "Opisy zasad",
            entries: inspectedRules.map((name) => ({ name, text: getRuleText(name) })),
          }]}
          onClose={() => setInspectedEquipment(null)}
        >
          <section className="rules-modal-section">
            <h3>Profil ekwipunku</h3>
            <EquipmentStatsLine name={inspectedName} unit={unitList[id]} />
            {!getEquipmentStats(inspectedName) && !getItemText(inspectedName, unitList[id]) && (
              <p>Brak opisu ekwipunku.</p>
            )}
          </section>
        </RulesModal>
      )}

      {isCommandGroup && (
        <section className="equipment-category">
          <div className="equipment-category-header">
            <h4>Dowodzenie</h4>
          </div>
          <label className="equipment-toggle">
            <input
              type="checkbox"
              className={id}
              name="Chorąży"
              checked={unitList[id].optionalEquipment.includes("Chorąży")}
              onChange={handleCommandClick}
              disabled={
                standardBearer &&
                !unitList[id].optionalEquipment.includes("Chorąży")
              }
            />
            Chorąży <span className="equipment-item-cost">+20 zk</span>
          </label>
          <label className="equipment-toggle">
            <input
              type="checkbox"
              className={id}
              name="Sygnalista"
              checked={unitList[id].optionalEquipment.includes("Sygnalista")}
              onChange={handleCommandClick}
              disabled={
                musician &&
                !unitList[id].optionalEquipment.includes("Sygnalista")
              }
            />
            Sygnalista <span className="equipment-item-cost">+20 zk</span>
          </label>
        </section>
      )}
    </div>
  );
};

export default WeaponList;
