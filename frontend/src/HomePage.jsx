// src/HomePage.js
import React from 'react';
import { Link } from 'react-router-dom';
import './home.css'; // Import your CSS

const HomePage = () => {
  return (
    <div className="home-container">
      <div className="navbar">
        <div className="website-name">Heaven Edu</div> {/* Website Name on the left */}
        <nav className="nav-links"> {/* Navigation Links on the right */}
          <Link to="/">Home</Link>
          {/* <Link to="/">Search</Link> */}
          {/* <Link to="/">Favourites</Link> */}
          <Link to="/login">Login</Link>
        </nav>
      </div>
      <div className="content">
        <h1>Healing through the words</h1>
        <p className="con">
       Embark on an extraordinary journey into the realms of imagination and intellect. Discover a treasure trove of timeless wisdom, captivating stories, and cutting-edge research. Whether you’re pursuing academic excellence or seeking the pure joy of reading, Heaven Edu is your sanctuary of enlightenment.

        </p>
      </div>
    </div>
  );
};

export default HomePage;
