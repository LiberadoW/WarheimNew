import React from "react";
import "../styles/Header.css";
// import Picture from "../Pictures/Warheim.png";
import Navbar from "../Components/Navbar";
import { Link } from "react-router-dom";
import { DarkModeSwitch } from "react-toggle-dark-mode";

const Header = ({ handleSwitchTheme, theme }) => {
  return (
    <header>
      <div className="site-logo">
        <Link to="/">WARHEIM</Link>
      </div>
      <div className="dark-mode-switch">
        <DarkModeSwitch
          checked={theme === "dark" ? true : false}
          onChange={handleSwitchTheme}
          sunColor="white"
          moonColor="white"
          style={{ backgroundColor: theme === "dark" ? "#282828" : "#212529" }}
        />
      </div>
      <Navbar />
      {/* <img className="header-image" src={Picture} alt="" /> */}
    </header>
  );
};

export default Header;
