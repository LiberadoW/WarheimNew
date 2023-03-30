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
        <a href="https://warheim.blogspot.com/" target="_blank">Blog Warheim</a>
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
          <li className="logout-button">
           <a onClick={handleLogout}>Wyloguj się</a>
          </li>
        </>
      )}
    </ul>
  );
};

export default Navbar;
