import "../styles/Navbar.css";
import { useContext } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";

const Navbar = () => {
  const { currentUser, dispatch } = useContext(AuthContext);
  return (
    <nav aria-label="Nawigacja główna" className="site-navigation">
      <NavLink to="/" end>Kreator kompanii</NavLink>
      {currentUser && <><NavLink to="/myLists">Moje kompanie</NavLink><NavLink to="/userDashboard">Konto</NavLink></>}
      <a className="nav-blog" href="https://warheim.blogspot.com/" target="_blank" rel="noreferrer">Świat Warheim ↗</a>
      {currentUser ? <button onClick={() => dispatch({ type: "LOGOUT" })}>Wyloguj się</button>
        : <NavLink to="/login">Zaloguj się</NavLink>}
    </nav>
  );
};
export default Navbar;
