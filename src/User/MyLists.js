import Header from "../layouts/Header";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../Context/AuthContext";
import { db } from "../Database/database";
import { getDoc, doc, updateDoc, deleteField } from "firebase/firestore";
import "../styles/MyLists.css";
import { useNavigate } from "react-router-dom";

const MyLists = ({ setUnitList, setArmy, setArmyName }, _ref) => {
  const { currentUser } = useContext(AuthContext);
  const [lists, setLists] = useState([]);
  const [arrayArmyNames, setArrayArmyNames] = useState([]);
  const [groupedLists, setGroupedLists] = useState({});

  console.log(groupedLists)

  const sortArmylists = (armylists) => {
    const groupedLists = armylists.reduce((groups, item) => {
      const group = groups[item.armyType] || [];
      group.push(item);
      groups[item.armyType] = group;
      return groups;
    }, {});
    return groupedLists;
  };

  const getArmyNames = (obj) => {
    return obj.map((a) => a.armyName);
  };

  useEffect(() => {
    const getLists = async () => {
      try {
        const savedLists = await getDoc(doc(db, "lists", currentUser.user.uid));
        setLists(savedLists.data().lists);
        setGroupedLists(sortArmylists(savedLists.data().lists));
        setArrayArmyNames(getArmyNames(lists));
      } catch (err) {
        console.log(err);
      }
    };
    getLists();
  }, []);

  const navigate = useNavigate();

  const handleLoadListClick = (e) => {
    const number = e.target.className;
    const army = e.target.parentNode.parentNode.parentNode.id;
    setUnitList(groupedLists[army][number].armyList);
    setArmy(army);
    setArmyName(groupedLists[army][number].armyName);
    navigate("/");
  };

  const handleDeleteListClick = async (e) => {
    const savedLists = await getDoc(doc(db, "lists", currentUser.user.uid));
    const arrayOfSavedLists = savedLists.data().lists;
    const arrayArmyNames = savedLists.data().armyNames;
    const index = arrayOfSavedLists.map((e) => e.armyName).indexOf(e.target.id);
    arrayOfSavedLists.splice(index, 1);
    arrayArmyNames.splice(arrayArmyNames.indexOf(e.target.id), 1);

    await updateDoc(doc(db, "lists", currentUser.user.uid), {
      lists: arrayOfSavedLists,
      armyNames: arrayArmyNames,
    });

    setGroupedLists([...arrayOfSavedLists])
    
    console.log(arrayOfSavedLists)
   
  };

  return (
    <>
      <Header />
      <div className="page-section">
        <h2 className="armylists-title">Moje rozpiski</h2>
        <div className="my-armylists">
          {Object.keys(groupedLists).map((armies, index) => {
            return (
              <div className="armylist-container">
                <h3>{armies}</h3>
                <ul key={index} id={armies}>
                  {groupedLists[armies].map((list, index) => {
                    return (
                      <li key={index} className={index}>
                        <div className="armylist-info">
                          <div className="armylists-text-container">
                          <p className="bold-text">{list.armyName}</p>
                          <p>{`${list.totalCost} zk`}</p>
                          <p>{`Prestiż: ${list.prestige}`}</p>
                          <p className="armylist-date">
                            {new Date(
                              list.timestamp.seconds * 1000
                            ).toLocaleString()}
                          </p>
                          </div>

                          <div className="armylists-button-container">
                          <button
                            className={index}
                            onClick={handleLoadListClick}
                          >
                            Wczytaj
                          </button>
                          <button
                            className="delete-list-button"
                            onClick={handleDeleteListClick}
                            id={list.armyName}
                          >
                            Usuń
                          </button>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default MyLists;
