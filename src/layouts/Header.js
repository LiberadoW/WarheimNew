import React from "react";
import "../styles/Header.css";
import Navbar from "../Components/Navbar";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoon, faSun, faShieldHalved } from "@fortawesome/free-solid-svg-icons";

const Header = ({ handleSwitchTheme, theme }) => (
  <header className="site-header">
    <Link className="site-brand" to="/" aria-label="Warheim — kreator kompanii">
      <span className="brand-mark"><FontAwesomeIcon icon={faShieldHalved} /></span>
      <span>WARHEIM<small>FANTASY SKIRMISH</small></span>
    </Link>
    <Navbar />
    <button className="theme-toggle" onClick={handleSwitchTheme}
      aria-label={theme === "dark" ? "Włącz jasny motyw" : "Włącz ciemny motyw"}>
      <FontAwesomeIcon icon={theme === "dark" ? faSun : faMoon} />
    </button>
  </header>
);
export default Header;
