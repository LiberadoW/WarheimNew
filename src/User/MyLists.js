import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../Context/AuthContext";
import { db } from "../Database/database";
import { getDoc, doc, updateDoc } from "firebase/firestore";
import "../styles/MyLists.css";
import { useNavigate } from "react-router-dom";

const sortArmylists = (armylists) => {
  return (armylists || []).reduce((groups, item) => {
    const group = groups[item.armyType] || [];
    group.push(item);
    groups[item.armyType] = group;
    return groups;
  }, {});
};

const getTimestampDate = (timestamp) => {
  if (!timestamp) {
    return null;
  }

  if (typeof timestamp?.toDate === "function") {
    return timestamp.toDate();
  }

  if (typeof timestamp?.seconds === "number") {
    return new Date(timestamp.seconds * 1000);
  }

  if (typeof timestamp?._seconds === "number") {
    return new Date(timestamp._seconds * 1000);
  }

  if (timestamp instanceof Date) {
    return timestamp;
  }

  return null;
};

const formatTimestamp = (timestamp) => {
  const date = getTimestampDate(timestamp);
  return date ? date.toLocaleString("pl-PL") : "-";
};

const getHistoryEntryName = (entry, index, totalGames) => {
  if (typeof entry?.gameName === "string" && entry.gameName.trim().length > 0) {
    return entry.gameName.trim();
  }

  return `Bitwa ${totalGames - index}`;
};

const toNumber = (value) => {
  const parsedValue = Number(value);
  return Number.isFinite(parsedValue) ? parsedValue : 0;
};

const MyLists = ({ setUnitList, setArmy, setArmyName }, _ref) => {
  const { currentUser } = useContext(AuthContext);
  const [groupedLists, setGroupedLists] = useState({});
  const [expandedHistory, setExpandedHistory] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const getLists = async () => {
      try {
        const userId = currentUser?.user?.uid;
        if (!userId) {
          return;
        }

        const savedLists = await getDoc(doc(db, "lists", userId));
        const allLists = savedLists.data()?.lists || [];
        setGroupedLists(sortArmylists(allLists));
      } catch (err) {
        console.log(err);
      }
    };

    getLists();
  }, [currentUser?.user?.uid]);

  const openList = (list, route) => {
    setUnitList(list.armyList);
    setArmy(list.armyType);
    setArmyName(list.armyName);
    navigate(route);
  };

  const handleDeleteListClick = async (list) => {
    const userId = currentUser?.user?.uid;
    if (!userId) {
      return;
    }

    const savedListsDoc = await getDoc(doc(db, "lists", userId));
    const arrayOfSavedLists = savedListsDoc.data()?.lists || [];
    const arrayArmyNames = savedListsDoc.data()?.armyNames || [];
    const index = arrayOfSavedLists.findIndex(
      (item) => item.armyName === list.armyName && item.armyType === list.armyType
    );

    if (index === -1) {
      return;
    }

    arrayOfSavedLists.splice(index, 1);
    const nameIndex = arrayArmyNames.indexOf(list.armyName);
    if (nameIndex !== -1) {
      arrayArmyNames.splice(nameIndex, 1);
    }

    await updateDoc(doc(db, "lists", userId), {
      lists: arrayOfSavedLists,
      armyNames: arrayArmyNames,
    });

    setGroupedLists(sortArmylists(arrayOfSavedLists));
  };

  const toggleHistory = (historyKey) => {
    setExpandedHistory((prevState) => ({
      ...prevState,
      [historyKey]: !prevState[historyKey],
    }));
  };

  return (
    <div className="page-section">
      <h2 className="armylists-title">Moje rozpiski</h2>
      <div className="my-armylists">
        {Object.keys(groupedLists).map((armyType) => (
          <div className="armylist-container" key={armyType}>
            <h3>{armyType}</h3>
            <ul id={armyType}>
              {groupedLists[armyType].map((list, index) => {
                const historyEntries = Array.isArray(list.gameHistory)
                  ? [...list.gameHistory].reverse()
                  : [];
                const historyKey = `${armyType}-${list.armyName}-${index}`;
                const isHistoryOpen = Boolean(expandedHistory[historyKey]);

                return (
                  <li key={historyKey}>
                    <div className="armylist-info">
                      <div className="armylists-text-container">
                        <p className="bold-text">{list.armyName}</p>
                        <p>{`${list.totalCost} zk`}</p>
                        <p>{`Prestiż: ${list.prestige}`}</p>
                        <p className="armylist-date">{formatTimestamp(list.timestamp)}</p>
                      </div>

                      <div className="armylists-button-container">
                        <button onClick={() => openList(list, "/")}>Wczytaj</button>
                        <button onClick={() => openList(list, "/edit")}>Edytuj</button>
                        <button onClick={() => openList(list, "/play")}>Graj</button>
                        <button onClick={() => toggleHistory(historyKey)}>
                          {`Historia (${historyEntries.length})`}
                        </button>
                        <button
                          className="delete-list-button"
                          onClick={() => handleDeleteListClick(list)}
                        >
                          Usuń
                        </button>
                      </div>
                    </div>

                    {isHistoryOpen && (
                      <div className="armylist-history">
                        {historyEntries.length === 0 ? (
                          <p className="armylist-history-empty">Brak zapisanych gier.</p>
                        ) : (
                          historyEntries.map((entry, gameIndex) => {
                            const outOfActionModels = Array.isArray(
                              entry.outOfActionModels
                            )
                              ? entry.outOfActionModels
                              : [];
                            const unitResults = Array.isArray(entry.unitResults)
                              ? entry.unitResults
                              : [];

                            return (
                              <div
                                className="armylist-history-item"
                                key={`${historyKey}-game-${gameIndex}`}
                              >
                                <p className="bold-text">
                                  {getHistoryEntryName(
                                    entry,
                                    gameIndex,
                                    historyEntries.length
                                  )}
                                </p>
                                <p>{formatTimestamp(entry.finishedAt)}</p>
                                <p>
                                  {`PD: +${toNumber(entry.totalExpGained)} | Obłęd: +${toNumber(
                                    entry.totalObledGained
                                  )}`}
                                </p>
                                <p>
                                  {outOfActionModels.length
                                    ? `WzA: ${outOfActionModels.join(", ")}`
                                    : "WzA: brak"}
                                </p>

                                {unitResults.length > 0 && (
                                  <details className="armylist-history-details">
                                    <summary>Szczegóły jednostek</summary>
                                    <div className="armylist-history-details-body">
                                      {unitResults.map((unitResult, unitIndex) => {
                                        const modelResults = Array.isArray(
                                          unitResult.modelResults
                                        )
                                          ? unitResult.modelResults
                                          : [];

                                        return (
                                          <details
                                            key={`${historyKey}-game-${gameIndex}-unit-${unitIndex}`}
                                            className="armylist-history-unit-details"
                                          >
                                            <summary>{unitResult.unitLabel}</summary>
                                            <p>
                                              {`PD: +${toNumber(
                                                unitResult.gainedExp
                                              )} | Obłęd: +${toNumber(
                                                unitResult.gainedObled
                                              )}`}
                                            </p>
                                            <ul className="armylist-history-model-list">
                                              {modelResults.map((modelResult, modelIndex) => (
                                                <li
                                                  key={`${historyKey}-game-${gameIndex}-unit-${unitIndex}-model-${modelIndex}`}
                                                >
                                                  {`${modelResult.modelLabel}: ${
                                                    modelResult.isOutOfAction
                                                      ? "WzA"
                                                      : "aktywny"
                                                  }`}
                                                </li>
                                              ))}
                                            </ul>
                                          </details>
                                        );
                                      })}
                                    </div>
                                  </details>
                                )}
                              </div>
                            );
                          })
                        )}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyLists;
