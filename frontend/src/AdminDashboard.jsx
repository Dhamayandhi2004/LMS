// src/HomePage.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './App.css'; // Import your CSS
import { FaSignOutAlt } from "react-icons/fa"; // Import logout icon
import './LogoutButton.css'; // Optional: Add specific styles for the div


const AdminDashboard = () => {
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
    <div className="home-container">
      <div className="navbar">
        <div className="website-name">Heaven Edu</div> {/* Website Name on the left */}
        <nav className="nav-links"> {/* Navigation Links on the right */}
          <Link to="/AdminDashboard">Home</Link>
          <Link to="/managebooks">ManageBooks</Link>
          <Link to="/search">Search</Link>
          <Link to="/vieworders">Vieworders</Link>
          <div className="logout-icon-div" onClick={handleLogout}>
      <FaSignOutAlt />
    </div>
        </nav>
      </div>
      <div className="content">
        <h1>Healing through the words</h1>
        <p className="con">
          Your gateway to a world of knowledge. Explore our vast collection of
          books, journals, and resources tailored for your reading pleasure.
          Whether you’re looking for academic resources or leisurely reads, we
          have it all!
        </p>
      </div>
    </div>
  );
};

export default AdminDashboard;
