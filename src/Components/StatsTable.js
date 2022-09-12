import React from 'react';

const StatsTable = ({
    item,
    statsHeaders,
    armour,
    speedModifier,
    initativeModifier,
  }) => {
    return (
      <>
        {statsHeaders.map((statHeader) => {
          return <div className="unit-table-stats-headers">{statHeader}</div>;
        })}
        {Object.entries(item.stats).map(([key, value], mainIndex) => {
          return (
            <>
              <div className="unit-table-stats">{key}</div>
              {value.map((stat, index) => {
                if (index === 6 && mainIndex === 0 && initativeModifier > 0) {
                  return (
                    <div
                      className="unit-table-stats"
                      style={{ fontWeight: "bold", color: "red" }}
                    >
                      {stat - initativeModifier}
                    </div>
                  );
                } else if (index === 0 && mainIndex === 0 && speedModifier > 0) {
                  return (
                    <div
                      className="unit-table-stats"
                      style={{ fontWeight: "bold", color: "red" }}
                    >
                      {stat - speedModifier}
                    </div>
                  );
                } else {
                  return <div className="unit-table-stats">{stat}</div>;
                }
              })}
              <div className="unit-table-stats">
                {item.unitName === "" ? "" : armour < 7 ? `${armour}+` : "-"}
              </div>
            </>
          );
        })}
      </>
    );
  };

  export default StatsTable