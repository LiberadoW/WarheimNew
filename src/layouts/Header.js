import React from "react";
import "../styles/Header.css";
// import Picture from "../Pictures/Warheim.png";
import Navbar from "../Components/Navbar";

const Header = () => {
  return (
    <header>
      <div className="site-logo">WARHEIM</div>
      <Navbar />
      {/* <img className="header-image" src={Picture} alt="" /> */}
    </header>
  );
};

export default Header;
