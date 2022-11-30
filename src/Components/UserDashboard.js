import Header from "../layouts/Header";
import "../styles/UserDashboard.css";
import { useContext } from "react";
import { AuthContext } from "../Context/AuthContext";

const UserDashboard = () => {
  const {currentUser} = useContext(AuthContext);

  return (
    <>
      <Header />
      <div className="user-dashboard page-section">
        <div className="dashboard-welcome">
          <p className="bold-text">Warheim army builder v1.0</p>
          <p>
            Witaj, <span className="bold-text">{currentUser.user.displayName}!</span>
          </p>
        </div>
      </div>
    </>
  );
};

export default UserDashboard;
