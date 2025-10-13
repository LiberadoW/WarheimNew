import React from "react";

const ITEM_STATS_ORDER = ["Aktualna", "Początkowa", "Maksymalna"];

const StatsTable = ({
  item,
  statsHeaders,
  armour,
  speedModifier,
  initativeModifier,
}) => {
  const entries = Object.entries(item.stats);

  const startingStats = item.stats.Początkowa;

  const sortedEntries = entries.sort((a, b) => {
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

  sortedEntries.splice(1, 0, [
    "Aktualna",
    ["", "", "", "", "", "", "", "", ""],
  ]);

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
        if (Object.keys(item.stats).includes("Aktualna")) {
          if (key === "Początkowa") {
            return null;
          }
        }
        return (
          <React.Fragment key={key}>
            <div className="unit-table-stats">{key}</div>
            {value.map((stat, index) => {
              return (
                <div
                  key={`${index} ${mainIndex}4`}
                  className={`unit-table-stats ${
                    key === "Początkowa" && stat > startingStats[index]
                      ? "green"
                      : key === "Początkowa" && stat < startingStats[index]
                      ? "red"
                      : ""
                  }`}
                >
                  {stat}
                </div>
              );
            })}

            <div className="unit-table-stats" key={`${mainIndex}5`}>
              {mainIndex === 0
                ? item.unitName === ""
                  ? ""
                  : armour < 7
                  ? `${armour}+`
                  : mainIndex === 1
                  ? ""
                  : "-"
                : mainIndex === 1
                ? ""
                : "-"}
            </div>
          </React.Fragment>
        );
      })}
    </>
  );
};

export default StatsTable;
