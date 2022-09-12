import React from 'react';
import "../styles/Header.css"
import Picture from "../Pictures/Warheim.png"

const Header = () => {
    return ( 
        <header>
            <img className="header-image" src={Picture} alt="" />
        </header>
     );
}
 
export default Header;