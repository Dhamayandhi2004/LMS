import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import './CartPage.css';
import { FaSignOutAlt } from "react-icons/fa"; // Import logout icon
import './LogoutButton.css'; // Optional: Add specific styles for the div

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [errorMessage, setErrorMessage] = useState(null);
  const [currentBook, setCurrentBook] = useState(null);

  const [userDetails, setUserDetails] = useState({
    name: "",
    address: "",
    contact: "",
    quantity: 1,
    paymentMethod: "",
  });

  const userEmail = localStorage.getItem("userEmail");
  const navigate = useNavigate(); // Initialize the navigate function


  // Fetch the cart items when the page loads
  useEffect(() => {
    const fetchCartItems = async () => {
      if (!userEmail) {
        console.error("User email is not available.");
        return;
      }

      try {
        const response = await axios.get(
          `https://lms-4n6b.onrender.com/cart?email=${userEmail}`
        );
        console.log("Cart items fetched:", response.data);
        setCartItems(response.data); // Set the cart items to state
        console.log("Current Book Updated:", currentBook);
      } catch (error) {
        console.error("Error fetching cart items:", error);
      }
    };

    fetchCartItems(); // Fetch the items when the component mounts or userEmail changes
  }, [currentBook, userEmail]);
  const handleBuy = (book) => {
    console.log("Selected book:", book); // Verify the book object
    setCurrentBook(book); // Store the whole book object, not just the _id
    setShowModal(true); // Show modal
  };

  const deleteBook = async (bookName) => {
    if (!bookName) {
      console.error("Invalid book name:", bookName);
      return alert("Failed to delete. Book name is invalid.");
    }

    try {
      const response = await axios.delete("https://lms-4n6b.onrender.com/del", {
        data: { bookName, email: userEmail }, // Send the bookName and userEmail in the request body
      });

      if (response.data.success) {
        alert("Book removed from the cart successfully!");

        // Update the state immediately to remove the book from the UI
        setCartItems(cartItems.filter((item) => item.name !== bookName));

        // Optionally, you could also re-fetch the updated cart items from the server:
        // fetchCartItems();
      } else {
        alert("Failed to remove the book from the cart.");
      }
    } catch (error) {
      console.error("Error deleting book:", error);
      alert("An error occurred while removing the book.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserDetails({ ...userDetails, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const totalPrice = currentBook.price * userDetails.quantity; // Calculate total price
    if (!currentBook) {
      console.error("Current book is not selected.");
      alert("Please select a book before submitting the order.");
      return;
    }

    const payload = {
      bookId: currentBook?.bookId || currentBook?._id, // Check for bookId first
      bookName: currentBook?.name,
      userEmail,
      userName: userDetails.name,
      userAddress: userDetails.address,
      userContact: userDetails.contact,
      quantity: userDetails.quantity,
      paymentMethod: userDetails.paymentMethod,
      totalPrice, // Log the total price
    };

    console.log("Submitting order with payload:", payload); // Verify payload

    axios
      .post("https://lms-4n6b.onrender.com/orders", payload)
      .then(() => {
        alert("Order placed successfully!");
        setShowModal(false);
        setUserDetails({ name: "", address: "", contact: "" });
      })
      .catch((error) => {
        console.error("Error placing order:", error);
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
    </div>      </nav>
        
      </div>
      <div className="cart-page-container">
        <h2>Your Cart..</h2>
        <div className="books-grid">
          
          {cartItems.length === 0 ? (
            <p>No items in cart.</p>
          ) : (
            cartItems.map((book) => (
              <div key={book._id} className="book-item">
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
                <img
                  src={book.imageUrl}
                  alt={book.name}
                  className="book-image"
                />
                <button onClick={() => handleBuy(book)} className="buy-button">
                  Buy
                </button>
                <button
                  onClick={() => deleteBook(book.name)}
                  className="delete-button"
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {showModal && (  <div className="modal">
          <div className="modal-content">
            <h2>Order Details</h2>
            <form onSubmit={handleSubmit} className="order-form">
              <div className="form-group">
                <label htmlFor="name">Name:</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={userDetails.name}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="address">Address:</label>
                <textarea
                  id="address"
                  name="address"
                  value={userDetails.address}
                  onChange={handleInputChange}
                  placeholder="Enter your complete address"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="contact">Contact:</label>
                <input
                  type="text"
                  id="contact"
                  name="contact"
                  value={userDetails.contact}
                  onChange={handleInputChange}
                  placeholder="Enter your contact number"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="quantity">Quantity:</label>
                <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  value={userDetails.quantity}
                  onChange={handleInputChange}
                  min="1"
                  max="5"
                  required
                />
              </div>
              <div className="form-group">
                <label>Total Price:</label>
                <p>${currentBook.price * (userDetails.quantity || 0)}</p>
              </div>
              <div className="form-group">
                <label>Payment Method:</label>
                <div>
                  <label>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="Credit Card"
                      checked={userDetails.paymentMethod === "Credit Card"}
                      onChange={handleInputChange}
                    />
                    Credit Card
                  </label>
                </div>
                <div>
                  <label>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="Debit Card"
                      checked={userDetails.paymentMethod === "Debit Card"}
                      onChange={handleInputChange}
                    />
                    Debit Card
                  </label>
                </div>
                <div>
                  <label>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="Cash on Delivery"
                      checked={userDetails.paymentMethod === "Cash on Delivery"}
                      onChange={handleInputChange}
                    />
                    Cash on Delivery
                  </label>
                </div>
              </div>
              <div className="form-buttons">
                <button type="submit" className="submit-button">
                  Place Order
                </button>
                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
