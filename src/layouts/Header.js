import React from "react";
import "../styles/Header.css";
// import Picture from "../Pictures/Warheim.png";
import Navbar from "../Components/Navbar";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header>
      <div className="site-logo"><Link to="/">WARHEIM</Link></div>
      <Navbar />
      {/* <img className="header-image" src={Picture} alt="" /> */}
    </header>
  );
};

export default Header;
