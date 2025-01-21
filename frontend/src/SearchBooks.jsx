import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link ,useNavigate} from "react-router-dom";
import { FaHeart, FaCartPlus, FaSearch, FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";
import "./SearchBooks.css";
import './LogoutButton.css'; // Optional: Add specific styles for the div
import { FaSignOutAlt } from "react-icons/fa"; // Import logout icon

const SearchBooks = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [books, setBooks] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const userEmail = localStorage.getItem("userEmail");
  const navigate=useNavigate();

  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:5000/books")
      .then((response) => {
        setBooks(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching books:", error);
        setLoading(false);
        alert("Failed to load books. Please try again later.");
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

  const handleVoiceSearch = () => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      alert("Browser does not support voice search.");
      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;

    if (!isListening) {
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
        alert("Voice search failed. Please try again.");
      };

      recognition.onspeechend = () => {
        recognition.stop();
        setIsListening(false);
      };
    } else {
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

  const handleAddFavorite = (bookId) => {
    if (!userEmail) {
      alert("Please log in to add books to favorites.");
      return;
    }
    axios
      .post("http://localhost:5000/favorites", { email: userEmail, bookId })
      .then((response) => {
        alert(response.data.message || "Book added to favorites!");
      })
      .catch((error) => {
        console.error("Error adding to favorites:", error);
        alert(error.response?.data.message || "Failed to add to favorites.");
      });
  };

  const handleAddToCart = (book) => {
    if (!userEmail) {
      alert("Please log in to add items to your cart.");
      return;
    }

    const payload = {
      email: userEmail,
      bookId: book.id || book._id,
      bookName: book.name,
      imageUrl: book.imageUrl,
      price: book.price,
    };

    axios
      .post("http://localhost:5000/cart", payload)
      .then((response) => {
        alert(response.data.message || "Item added to cart successfully!");
      })
      .catch((error) => {
        console.error("Error adding to cart:", error);
        alert(error.response?.data.message || "Failed to add to cart.");
      });
  };

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
          <Link to="/UserDashBoard">Home</Link>
          <Link to="/searchbooks">Search Books</Link>
          <Link to="/favorites">Favorites</Link>
          <Link to="/cart">Cart</Link>
          <div className="logout-icon-div" onClick={handleLogout}>
      <FaSignOutAlt />
    </div>
        </nav>
      </div>

      <div className="search-bar-container">
        <FaSearch className="search-icon" />
        <input
          type="text"
          placeholder="Search by name or author"
          value={searchTerm}
          onChange={onInputChange}
          className="search-bar"
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
                key={suggestion._id}
                onClick={() => {
                  setSearchTerm(suggestion.name || suggestion.author);
                  setSuggestions([]);
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
        {loading ? (
          <p>Loading books...</p>
        ) : filteredBooks.length === 0 ? (
          <p>No books found.</p>
        ) : (
          filteredBooks.map((book) => (
            <div key={book._id} className="book-card">
              {book.imageUrl && (
                <img
                  src={book.imageUrl}
                  alt={book.name}
                  className="book-image"
                />
              )}
              <h3>{book.name}</h3>
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
              <p>
                <strong>Price:</strong> {book.price}
              </p>
              <div className="icon-container">
          <FaHeart
            className="fav-icon"
            title="Add to Favorites"
            onClick={() => handleAddFavorite(book._id)}
          />
          <FaCartPlus
            className="cart-icon"
            title="Add to Cart"
            onClick={() => handleAddToCart(book)}
          />
        </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SearchBooks;
