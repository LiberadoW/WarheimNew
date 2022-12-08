import "../styles/UserDashboard.css";
import { useContext } from "react";
import { AuthContext } from "../Context/AuthContext";
import { Link } from "react-router-dom";

const UserDashboard = () => {
  const { currentUser } = useContext(AuthContext);

  return (
    <div className="user-dashboard page-section">
      <div className="dashboard-welcome">
        <p className="bold-text">Warheim army builder v1.0</p>
        <p>
          Witaj,{" "}
          <span className="bold-text">{currentUser.user.displayName}!</span>
        </p>
      </div>
      <div className="dashboard-menu">
        <Link to="/myLists">
          <button className="button dashboard-button">Moje rozpiski</button>
        </Link>
      </div>
    </div>
  );
};

export default UserDashboard;
