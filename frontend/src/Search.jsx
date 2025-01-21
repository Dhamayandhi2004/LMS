import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { FaSearch, FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";
import "./Search.css";
import { FaSignOutAlt } from "react-icons/fa"; // Import logout icon
import './LogoutButton.css'; // Optional: Add specific styles for the div

const Search = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [books, setBooks] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const navigate=useNavigate();
  const apiUrl = "https://lms-4n6b.onrender.com/books";

  useEffect(() => {
    axios
      .get(apiUrl)
      .then((response) => {
        setBooks(response.data);
      })
      .catch((error) => {
        console.error("Error fetching books:", error);
      });
  }, []);

  const onInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.length > 0) {
      const filteredSuggestions = books.filter(
        (book) =>
          (book.name &&
            book.name.toLowerCase().includes(value.toLowerCase())) ||
          (book.author &&
            book.author.toLowerCase().includes(value.toLowerCase()))
      );
      setSuggestions(filteredSuggestions.slice(0, 5));
    } else {
      setSuggestions([]);
    }
  };

  const calculateProgress = () => {
    const maxChars = 20;
    const progress = Math.min((searchTerm.length / maxChars) * 100, 100);
    return `${progress}%`;
  };

  const handleVoiceSearch = () => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      console.log("Browser does not support voice search.");
      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;

    if (!isListening) {
      // Start voice recognition
      recognition.start();
      setIsListening(true);

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setSearchTerm(transcript);

        const filteredSuggestions = books.filter(
          (book) =>
            (book.name &&
              book.name.toLowerCase().includes(transcript.toLowerCase())) ||
            (book.author &&
              book.author.toLowerCase().includes(transcript.toLowerCase()))
        );
        setSuggestions(filteredSuggestions.slice(0, 5));
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onspeechend = () => {
        recognition.stop();
        setIsListening(false);
      };
    } else {
      // Stop voice recognition
      recognition.stop();
      setIsListening(false);
    }
  };

  const filteredBooks = books.filter(
    (book) =>
      (book.name &&
        book.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (book.author &&
        book.author.toLowerCase().includes(searchTerm.toLowerCase()))
  );
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
        <div className="website-name">Heaven Edu</div>
        <nav className="nav-links">
          <Link to="/AdminDashboard">Home</Link>
          <Link to="/managebooks">Manage Books</Link>
          <Link to="/search">Search</Link>
          <Link to="/vieworders">View Orders</Link>
          <div className="logout-icon-div" onClick={handleLogout}>
      <FaSignOutAlt />
    </div>
        </nav>
      </div>

      <div className="search-bar-container">
        <FaSearch className="search-icon" />
        <input
          type="text"
          className="search-bar"
          placeholder="Search by name or author"
          value={searchTerm}
          onChange={onInputChange}
          style={{
            background: `linear-gradient(to right,rgb(251, 252, 251) ${calculateProgress()}, #fff ${calculateProgress()})`,
          }}
        />
        <div
          className="microphone-icon"
          onClick={handleVoiceSearch}
          title="Click to toggle voice search"
        >
          {isListening ? <FaMicrophone /> : <FaMicrophoneSlash />}
        </div>
        {suggestions.length > 0 && (
          <ul className="autocomplete-suggestions">
            {suggestions.map((suggestion) => (
              <li
                key={suggestion.id}
                onClick={(e) => {
                  setSearchTerm(suggestion.name || suggestion.author);
                  setSuggestions([]);
                  e.target.blur();
                }}
                className="suggestion-item"
              >
                {suggestion.name || suggestion.author}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="book-list">
        {filteredBooks.length === 0 ? (
          <p>No books found.</p>
        ) : (
          filteredBooks.map((book) => (
            <div key={book.id} className="book-card">
              {book.imageUrl && (
                <img
                  src={book.imageUrl}
                  alt={book.title}
                  className="book-image"
                />
              )}
              <h3>{book.title}</h3>
              <p>
                <strong>Name:</strong> {book.name}
              </p>
              <p>
                <strong>Author:</strong> {book.author}
              </p>
              <p>
                <strong>Genre:</strong> {book.genre}
              </p>
              <p>
                <strong>Year:</strong> {book.year}
              </p>
              <p>
                <strong>Description:</strong> {book.description}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Search;
