import React from "react";

const StatsTable = ({
  item,
  statsHeaders,
  armour,
  speedModifier,
  initativeModifier,
}) => {
  return (
    <>
      {statsHeaders.map((statHeader, index) => {
        return (
          <div key={index} className="unit-table-stats-headers">
            {statHeader}
          </div>
        );
      })}
      {Object.entries(item.stats).map(([key, value], mainIndex) => {
        
        return (
          <React.Fragment>
            <div className="unit-table-stats">
              {key}
            </div>
            {value.map((stat, index) => {
              if (index === 6 && mainIndex === 0 && initativeModifier > 0) {
                return (
                  <div
                  key={`${mainIndex}2`}
                    className="unit-table-stats"
                    style={{ fontWeight: "bold", color: "red" }}
                  >
                    {stat - initativeModifier === 0 ? 1 : stat - initativeModifier}
                  </div>
                );
              } else if (index === 0 && mainIndex === 0 && speedModifier > 0) {
                return (
                  <div
                  key={`${mainIndex}3`}
                    className="unit-table-stats"
                    style={{ fontWeight: "bold", color: "red" }}
                  >
                    {stat - speedModifier === 0 ? 1 : stat - speedModifier}
                  </div>
                );
              } else {
                return (
                  <div key={`${index} ${mainIndex}4`} className="unit-table-stats">
                    {stat}
                  </div>
                );
              }
            })}
            <div className="unit-table-stats" key={`${mainIndex}5`}>
               {mainIndex === 0 ? item.unitName === "" ? "" : armour < 7 ? `${armour}+` : "-" : "-"}
            </div>
          </React.Fragment>
        );
      })}
    </>
  );
};

export default StatsTable;
