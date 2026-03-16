import React from "react";

const ITEM_STATS_ORDER = ["Początkowa", "Aktualna", "Maksymalna"];
const isNumberStat = (value) =>
  typeof value === "number" && Number.isFinite(value);

const StatsTable = ({
  item,
  statsHeaders,
  armour,
  speedModifier,
  initativeModifier,
}) => {
  const entries = Object.entries(item.stats);
  const hasCurrentStats = Object.prototype.hasOwnProperty.call(
    item.stats,
    "Aktualna"
  );
  const startingStats = item.stats.Początkowa;
  const baseArmourRowKey = hasCurrentStats ? "Aktualna" : "Początkowa";

  const sortedEntries = [...entries].sort((a, b) => {
    const indexA = ITEM_STATS_ORDER.indexOf(a[0]);
    const indexB = ITEM_STATS_ORDER.indexOf(b[0]);

    if (indexA === -1 && indexB === -1) {
      return 0;
    } else if (indexA === -1) {
      return 1;
    } else if (indexB === -1) {
      return -1;
    } else {
      return indexA - indexB;
    }
  });

  return (
    <>
      {statsHeaders.map((statHeader, index) => {
        return (
          <div key={index} className="unit-table-stats-headers">
            {statHeader}
          </div>
        );
      })}
      {sortedEntries.map(([key, value], mainIndex) => {
        return (
          <React.Fragment key={key}>
            <div className="unit-table-stats">{key}</div>
            {value.map((stat, index) => {
              const baseStat = startingStats[index];
              const isCurrentStatRow = key === "Aktualna";
              return (
                <div
                  key={`${index} ${mainIndex}4`}
                  className={`unit-table-stats ${
                    isCurrentStatRow &&
                    isNumberStat(stat) &&
                    isNumberStat(baseStat) &&
                    stat > baseStat
                      ? "green"
                      : isCurrentStatRow &&
                        isNumberStat(stat) &&
                        isNumberStat(baseStat) &&
                        stat < baseStat
                      ? "red"
                      : ""
                  }`}
                >
                  {stat}
                </div>
              );
            })}

            <div className="unit-table-stats" key={`${mainIndex}5`}>
              {key === baseArmourRowKey
                ? item.unitName === ""
                  ? ""
                  : armour < 7
                  ? `${armour}+`
                  : "-"
                : "-"}
            </div>
          </React.Fragment>
        );
      })}
    </>
  );
};

export default StatsTable;
