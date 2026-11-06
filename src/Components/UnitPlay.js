import React, { useEffect, useMemo, useState } from "react";
import "../styles/UnitEdit.css";
import "./UnitPlay.css";
import RulesModal from "./RulesModal";
import { getRuleText, getWeaponRuleNames } from "../Functions/getRuleText";
import { getEquipmentStats } from "../Data.js/EquipmentStats";
import DiceInput from "../campaign/DiceInput";
import { darkPact } from "../campaign/sanity";
import { catalog, isHero, activeModel } from "../campaign/rules";
import { getModifiers } from "../Functions/getModifiers";

const MENU = [
  "Statystyki",
  "Umiejętności",
  "Ekwipunek",
  "Poważne obrażenia",
  "Bitwa",
];

const STAT_LABELS = ["Sz", "WW", "US", "S", "Wt", "Żw", "I", "A", "CP"];
const STAT_HEADERS = [...STAT_LABELS, "OP"];

const isNumberStat = (value) =>
  typeof value === "number" && Number.isFinite(value);

const getBattleModelCount = (unit) => {
  const parsedNumber = Number(unit.selectedNumber);
  return Number.isFinite(parsedNumber) && parsedNumber > 0
    ? Math.floor(parsedNumber)
    : 1;
};

const shouldSplitEquipmentName = (name) =>
  typeof name === "string" &&
  name.includes("/") &&
  !name.includes("(") &&
  !name.includes(")");

const getEquipmentAliases = (name) => {
  if (!shouldSplitEquipmentName(name)) {
    return [name];
  }

  return name
    .split("/")
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
};

const getAliasSelectionQueue = (aliasSelections, canonicalName) => {
  const selected = aliasSelections?.[canonicalName];

  if (Array.isArray(selected)) {
    return [...selected];
  }

  if (typeof selected === "string" && selected.length > 0) {
    return [selected];
  }

  return [];
};

const getDisplayEquipment = (unit, equipmentList) => {
  const aliasQueues = {};
  const startingCounts = (unit.startingEquipment || []).reduce(
    (acc, equipment) => {
      acc[equipment] = (acc[equipment] || 0) + 1;
      return acc;
    },
    {},
  );
  const seenCounts = {};

  return equipmentList.map((equipment) => {
    const aliases = getEquipmentAliases(equipment);

    if (aliases.length === 1) {
      return equipment;
    }

    const seenCount = seenCounts[equipment] || 0;
    seenCounts[equipment] = seenCount + 1;

    if (seenCount < (startingCounts[equipment] || 0)) {
      return aliases[0];
    }

    if (!aliasQueues[equipment]) {
      aliasQueues[equipment] = getAliasSelectionQueue(
        unit.equipmentAliasSelections,
        equipment,
      );
    }

    if (aliasQueues[equipment].length > 0) {
      return aliasQueues[equipment].shift();
    }

    return aliases[0];
  });
};

const formatCustomEquipmentEntry = (entry) => {
  if (entry && typeof entry === "object" && !Array.isArray(entry)) {
    const name = String(entry.name || "").trim();
    return name.length > 0 ? name : null;
  }

  if (typeof entry === "string" && entry.trim().length > 0) {
    return entry.trim();
  }

  return null;
};

const UnitPlay = ({ unit, unitList, setUnitList, campaign }) => {
  const [menu, setMenu] = useState("Bitwa");
  const [description, setDescription] = useState(null);
  const [pactDice, setPactDice] = useState([]);
  const pactCount = unitList.reduce((n, u) => n + (u.battlePacts || 0), 0);
  const battleActive = !!campaign?.activeBattle && !campaign.activeBattle.post;

  useEffect(() => {
    const modelCount = getBattleModelCount(unit);
    const battleExp = Number(unit.battleExp);
    const battleObled = Number(unit.battleObled);
    const totalObled = Number(unit.obled);
    const currentStatuses = Array.isArray(unit.battleOutOfActionModels)
      ? unit.battleOutOfActionModels
      : [];

    let hasChanges = false;

    if (!Number.isFinite(battleExp) || battleExp < 0) {
      unit.battleExp = 0;
      hasChanges = true;
    }

    if (!Number.isFinite(battleObled) || battleObled < 0) {
      unit.battleObled = 0;
      hasChanges = true;
    }

    if (!Number.isFinite(totalObled) || totalObled < 0) {
      unit.obled = 0;
      hasChanges = true;
    }

    if (currentStatuses.length !== modelCount) {
      unit.battleOutOfActionModels = Array.from(
        { length: modelCount },
        (_, index) => Boolean(currentStatuses[index]),
      );
      hasChanges = true;
    }

    if (hasChanges) {
      setUnitList([...unitList]);
    }
  }, [setUnitList, unit, unitList]);

  const baseStats = useMemo(
    () => (Array.isArray(unit.stats?.Początkowa) ? unit.stats.Początkowa : []),
    [unit.stats],
  );

  const currentStats = useMemo(() => {
    if (Array.isArray(unit.stats?.Aktualna)) {
      return unit.stats.Aktualna;
    }
    return baseStats;
  }, [unit.stats, baseStats]);

  const rules = Array.isArray(unit.rules) ? unit.rules : [];
  const injuries = Array.isArray(unit.injuries) ? unit.injuries : [];
  const modelCount = getBattleModelCount(unit);
  const battleExp = Math.max(0, Number(unit.battleExp) || 0);
  const battleObled = Math.max(0, Number(unit.battleObled) || 0);
  const totalObled = Math.max(0, Number(unit.obled) || 0);
  const totalExpAfterBattle =
    Math.max(0, Number(unit.exp) || 0) +
    battleExp +
    (unit.type === "Bohater" ? Number(unit.battleKills) || 0 : 0) +
    1;
  const totalObledAfterBattle = totalObled + battleObled;

  const updateBattleCounter = (field, delta) => {
    const currentValue = Math.max(0, Number(unit[field]) || 0);
    unit[field] = Math.max(0, currentValue + delta);
    setUnitList([...unitList]);
  };

  const handleOutOfActionToggle = (index) => {
    const statuses = Array.isArray(unit.battleOutOfActionModels)
      ? [...unit.battleOutOfActionModels]
      : Array.from({ length: modelCount }, () => false);

    statuses[index] = !statuses[index];
    unit.battleOutOfActionModels = statuses;
    setUnitList([...unitList]);
  };

  const renderStats = () => {
    const equipment = [
      ...(unit.startingEquipment || []),
      ...(unit.optionalEquipment || []),
    ];
    const [armour] = getModifiers(equipment, unit);

    return (
      <div className="unit-play-stats-table-wrapper">
        <table className="unit-play-stats-table">
          <thead>
            <tr>
              {STAT_HEADERS.map((header) => (
                <td key={header}>{header}</td>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              {STAT_LABELS.map((label, index) => {
                const baseValue = baseStats[index];
                const currentValue = currentStats[index];
                const valueClassName =
                  isNumberStat(currentValue) && isNumberStat(baseValue)
                    ? currentValue > baseValue
                      ? "green"
                      : currentValue < baseValue
                        ? "red"
                        : ""
                    : "";

                return (
                  <td key={`${label}-${index}`} className={valueClassName}>
                    {currentValue ?? "-"}
                  </td>
                );
              })}
              <td>
                {unit.unitName === "" ? "" : armour < 7 ? `${armour}+` : "-"}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  };

  const renderRules = () => (
    <div className="unit-play-list-container">
      {rules.length === 0 ? (
        <p className="unit-play-empty">
          Brak umiejętności i zasad specjalnych.
        </p>
      ) : (
        rules.map((rule, index) => (
          <button
            type="button"
            key={`${rule}-${index}`}
            className="unit-play-list-item equipment-details-link"
            onClick={() =>
              setDescription({
                title: rule,
                sections: [
                  {
                    title: "Zasada jednostki",
                    entries: [
                      {
                        name: rule,
                        text:
                          unit.campaignRuleTexts?.[rule] ||
                          unit.dramaProfileText ||
                          getRuleText(rule),
                      },
                    ],
                  },
                ],
              })
            }
          >
            {rule}
          </button>
        ))
      )}
    </div>
  );

  const renderEquipment = () => {
    const standardEquipment = [
      ...(unit.startingEquipment || []),
      ...(unit.optionalEquipment || []),
    ];

    const standardEquipmentString = getDisplayEquipment(
      unit,
      standardEquipment,
    ).map((item) => {
      if (["Lekki", "Średni", "Ciężki"].includes(item)) {
        return `${item} pancerz`;
      }
      return item;
    });

    const customEquipmentString = (unit.customEquipment || [])
      .map((entry) => formatCustomEquipmentEntry(entry))
      .filter((entry) => entry !== null);

    const equipment = standardEquipmentString.concat(customEquipmentString);

    return (
      <div className="unit-play-list-container">
        {equipment.length === 0 ? (
          <p className="unit-play-empty">Brak ekwipunku.</p>
        ) : (
          equipment.map((item, index) => (
            <button
              type="button"
              key={`${item}-${index}`}
              className="unit-play-list-item equipment-details-link"
              onClick={() => {
                const name = item.replace(/ pancerz$/, "");
                const stats = getEquipmentStats(name);
                const custom = (unit.customEquipment || []).find(
                  (e) => e.name === item,
                );
                const crafted = (unit.craftedEquipment?.[name] || []).map(
                  (r) => ({
                    name: r.name + (r.active ? "" : " (nieaktywne)"),
                    text: r.text,
                  }),
                );
                const definition = catalog.find(
                  (eq) => eq.name.toLowerCase() === item.toLowerCase(),
                );
                setDescription({
                  title: item,
                  sections: [
                    {
                      title: "Profil",
                      entries: [
                        {
                          name: item,
                          text: stats
                            ? `${stats.armour ? `Ochrona: ${stats.armour}` : `Zasięg: ${stats.range}; Siła: ${stats.strength}`}. Zasady: ${stats.rules || "brak"}`
                            : custom?.text ||
                              definition?.text ||
                              "Brak profilu w katalogu.",
                        },
                      ],
                    },
                    {
                      title: "Zasady broni",
                      entries: [
                        ...new Set([
                          ...getWeaponRuleNames(stats?.rules),
                          ...(unit.weaponEnhancements?.[name] || []),
                        ]),
                      ]
                        .map((name) => ({ name, text: getRuleText(name) }))
                        .concat(crafted),
                    },
                  ],
                });
              }}
            >
              {item}
            </button>
          ))
        )}
      </div>
    );
  };

  const renderInjuries = () => (
    <div className="unit-play-list-container">
      {injuries.length === 0 ? (
        <p className="unit-play-empty">Brak poważnych obrażeń.</p>
      ) : (
        injuries.map((injury, index) => (
          <div key={`${injury}-${index}`} className="unit-play-list-item">
            {injury}
          </div>
        ))
      )}
    </div>
  );

  const renderBattle = () => (
    <div className="unit-play-battle-container">
      {!battleActive && (
        <p>
          Rozpocznij potyczkę w panelu kampanii, aby zapisywać jej przebieg.
        </p>
      )}
      {unit.type === "Bohater" && (
        <div className="unit-play-counter">
          <span className="unit-play-counter-label">Przeciwnicy WzA</span>
          <button
            className="button"
            disabled={!battleActive || !(unit.battleKills > 0)}
            onClick={() => updateBattleCounter("battleKills", -1)}
          >
            −
          </button>
          <span>{unit.battleKills || 0}</span>
          <button
            className="button"
            disabled={!battleActive}
            onClick={() => updateBattleCounter("battleKills", 1)}
          >
            +
          </button>
          <span>+{unit.battleKills || 0} PD za pokonanych przeciwników</span>
        </div>
      )}
      <div className="unit-play-counter">
        <span className="unit-play-counter-label">Dodatkowe PD</span>
        <button
          className="button"
          onClick={() => updateBattleCounter("battleExp", -1)}
          disabled={!battleActive || battleExp === 0}
        >
          -
        </button>
        <span className="unit-play-counter-value">{battleExp}</span>
        <button
          className="button"
          disabled={!battleActive}
          onClick={() => updateBattleCounter("battleExp", 1)}
        >
          +
        </button>
        <span className="unit-play-counter-summary">{`Po bitwie: ${totalExpAfterBattle} PD`}</span>
      </div>

      {campaign?.settings?.obled && (
        <div className="unit-play-counter">
          <span className="unit-play-counter-label">Obłęd</span>
          <button
            className="button"
            onClick={() => updateBattleCounter("battleObled", -1)}
            disabled={!battleActive || battleObled === 0}
          >
            -
          </button>
          <span className="unit-play-counter-value">{battleObled}</span>
          <button
            className="button"
            disabled={!battleActive}
            onClick={() => updateBattleCounter("battleObled", 1)}
          >
            +
          </button>
          <span className="unit-play-counter-summary">
            {`Po bitwie: ${totalObledAfterBattle} Obłędu`}
          </span>
        </div>
      )}
      {campaign?.settings?.obled && isHero(unit) && (
        <details>
          <summary>Mroczny Pakt ({pactCount}/3 w potyczce)</summary>
          <p>
            Po użyciu przerzutu: pierwszy pakt +1 PO, drugi +K3 PO, trzeci +K6
            PO. Koszt obowiązuje również Niezłomnych.
          </p>
          {pactCount > 0 && pactCount < 3 && (
            <DiceInput
              label="Koszt Obłędu za Mroczny Pakt"
              value={pactDice}
              onChange={setPactDice}
              disabled={!battleActive}
            />
          )}
          <button
            className="button"
            disabled={
              !battleActive ||
              pactCount >= 3 ||
              (pactCount > 0 &&
                !(
                  pactDice.length === 1 &&
                  pactDice[0] >= 1 &&
                  pactDice[0] <= 6
                ))
            }
            onClick={() => {
              darkPact(unitList, unit.uniqueId, pactDice);
              setUnitList([...unitList]);
              setPactDice([]);
            }}
          >
            Zapisz użycie Mrocznego Paktu
          </button>
        </details>
      )}
      <div className="unit-play-wza-container">
        <p className="unit-play-wza-title">WzA! (wyłączony z akcji)</p>
        <div className="unit-play-wza-list">
          {Array.from({ length: modelCount }, (_, index) => {
            const isOutOfAction = Boolean(
              unit.battleOutOfActionModels?.[index],
            );
            const modelLabel =
              modelCount > 1 ? `${unit.unitName} #${index + 1}` : unit.unitName;

            return (
              <div key={`wza-${unit.uniqueId}-${index}`}>
                <label className="unit-play-wza-item">
                  <input
                    type="checkbox"
                    disabled={!battleActive || !activeModel(unit, index)}
                    checked={isOutOfAction}
                    onChange={() => handleOutOfActionToggle(index)}
                  />
                  <span>{modelLabel}</span>
                  <span>
                    {unit.campaignModelStatus?.[index]?.captured
                      ? " · pojmany"
                      : unit.campaignModelStatus?.[index]?.skip
                        ? ` · pauza: ${unit.campaignModelStatus[index].skip}`
                        : ""}
                  </span>
                </label>
                <label className="unit-play-wza-item">
                  <input
                    type="checkbox"
                    checked={!!unit.battleAbsentModels?.[index]}
                    disabled={
                      !battleActive ||
                      !!unit.campaignModelStatus?.[index]?.captured ||
                      (unit.campaignModelStatus?.[index]?.skip || 0) > 0
                    }
                    onChange={(e) => {
                      unit.battleAbsentModels = Array.from(
                        { length: modelCount },
                        (_, i) =>
                          i === index
                            ? e.target.checked
                            : !!unit.battleAbsentModels?.[i],
                      );
                      if (e.target.checked) {
                        unit.battleOutOfActionModels[index] = false;
                      }
                      setUnitList([...unitList]);
                    }}
                  />
                  <span>Nie uczestniczy w tej potyczce</span>
                </label>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <div className="unit-play">
      <div className="unit-edit-menu">
        {MENU.map((item) => (
          <button
            className={item === menu ? "menu-button active" : "menu-button"}
            key={item}
            onClick={() => setMenu(item)}
          >
            {item}
          </button>
        ))}
      </div>

      {description && (
        <RulesModal
          title={description.title}
          sections={description.sections}
          onClose={() => setDescription(null)}
        />
      )}
      {menu === "Statystyki" && renderStats()}
      {menu === "Umiejętności" && renderRules()}
      {menu === "Ekwipunek" && renderEquipment()}
      {menu === "Poważne obrażenia" && renderInjuries()}
      {menu === "Bitwa" && renderBattle()}
    </div>
  );
};

export default UnitPlay;
