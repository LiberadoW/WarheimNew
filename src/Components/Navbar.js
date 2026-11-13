import "../styles/Navbar.css";
import { useContext, useEffect, useState } from "react";
import { isAdminEmail } from "../admin/admin";
import { Link } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser } from "@fortawesome/free-solid-svg-icons";

const Navbar = () => {
  const { currentUser, dispatch } = useContext(AuthContext);
  const [admin, setAdmin] = useState(false);
  useEffect(() => {
    isAdminEmail(currentUser?.user?.email).then(setAdmin);
  }, [currentUser]);

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
  }

  return (
    <ul className="navbar">
      <li className="navbar-blog">
        <a href="https://warheim.blogspot.com/" target="_blank" rel="noreferrer">Blog Warheim</a>
      </li>
      {currentUser === null && (
        <li>
          <Link to="/login">Zaloguj się</Link>
        </li>
      )}
      {currentUser && (
        <>
          <li>
            <Link to="/campaigns">Kampanie</Link>
          </li>
          {admin && (
            <li>
              <Link to="/admin">Rozpiski graczy</Link>
            </li>
          )}
          <li>
            <Link to="/userDashboard">
              <FontAwesomeIcon icon={faCircleUser} size="2xl"></FontAwesomeIcon>
            </Link>
          </li>
          <li className="logout-button">
           {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
           <a onClick={handleLogout}>Wyloguj się</a>
          </li>
        </>
      )}
    </ul>
  );
};

export default Navbar;
