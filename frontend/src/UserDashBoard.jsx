// UserDashBoard.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './UserDashBoard.css';
import { FaSignOutAlt } from "react-icons/fa"; // Import logout icon

const UserDashBoard = () => {
  const navigate=useNavigate();
  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (confirmLogout) {
      // Clear user data from local storage
      localStorage.removeItem("userEmail");
      localStorage.removeItem("isAdmin");
      navigate("/login"); // Redirect to the login page
    }
  };
  return (
    <div className="user-dashboard-container">
      <div className="navbar">
        <div className="website-name">Heaven Edu</div>
        <nav className="nav-links">
          <Link to="/UserDashBoard">Home</Link>
          <Link to="/searchbooks">Searchbooks</Link>
          <Link to="/favorites">Favorites</Link>
          <Link to="/cart">Cart</Link> <div className="logout-icon-div" onClick={handleLogout}>
      <FaSignOutAlt />
    </div>
        </nav>
      </div>
      <div className="content">
        <h1>Healing through the words</h1>
        <p className="description">
          Your gateway to a world of knowledge. Explore our vast collection of
          books, journals, and resources tailored for your reading pleasure.
          Whether you’re looking for academic resources or leisurely reads, we
          have it all!
        </p>
      </div>
    </div>
  );
};

export default UserDashBoard;
