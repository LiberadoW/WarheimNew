import Header from "../layouts/Header";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../Context/AuthContext";
import { db } from "../Database/database";
import { getDoc, doc } from "firebase/firestore";
import "../styles/MyLists.css";
import { useNavigate } from "react-router-dom";

const MyLists = ({ setUnitList, setArmy }) => {
  const { currentUser } = useContext(AuthContext);
  const [lists, setLists] = useState([]);
  const [groupedLists, setGroupedLists] = useState({});

  const sortArmylists = (armylists) => {
    const groupedLists = armylists.reduce((groups, item) => {
      const group = groups[item.armyType] || [];
      group.push(item);
      groups[item.armyType] = group;
      return groups;
    }, {});
    return groupedLists;
  };

  useEffect(() => {
    const getLists = async () => {
      try {
        const savedLists = await getDoc(doc(db, "lists", currentUser.user.uid));
        setLists(savedLists.data().lists);
        setGroupedLists(sortArmylists(savedLists.data().lists));
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
    console.log(groupedLists[army][number].armyList);
    setUnitList(groupedLists[army][number].armyList);
    setArmy(army)
    navigate("/");
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
                      <li
                        key={index}
                        onClick={handleLoadListClick}
                        className={index}
                      >
                        <div className="armylist-info">
                          <p className="bold-text">{list.armyName}</p>
                          <p>{`${list.totalCost} zk`}</p>
                          <p>{list.prestige}</p>
                          <p className="armylist-date">
                            {new Date(
                              list.timestamp.seconds * 1000
                            ).toLocaleString()}
                          </p>

                          <button
                            className={index}
                            onClick={handleLoadListClick}
                          >
                            Wczytaj
                          </button>
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
