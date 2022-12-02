import "../styles/Navbar.css";
import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser } from "@fortawesome/free-solid-svg-icons";

const Navbar = () => {
  const { currentUser, dispatch } = useContext(AuthContext);

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
  }

  return (
    <ul className="navbar">
      <li>
        <Link to="/">Kreator armii</Link>
      </li>
      {currentUser === null && (
        <li>
          <Link to="/login">Zaloguj się</Link>
        </li>
      )}
      {currentUser && (
        <>
          <li>
            <Link to="/userDashboard">
              <FontAwesomeIcon icon={faCircleUser} size="2xl"></FontAwesomeIcon>
            </Link>
          </li>
          <li>
            <button className="logout-button" onClick={handleLogout}>Wyloguj się</button>
          </li>
        </>
      )}
    </ul>
  );
};

export default Navbar;
