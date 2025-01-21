import React, { useState, useEffect } from 'react';

const BorrowPage = () => {
  const [cart, setCart] = useState([]);

  // Load cart items from localStorage
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(savedCart);
  }, []);

  const handleBorrow = () => {
    if (cart.length === 0) {
      alert("Your cart is empty. Please add books to your cart before borrowing.");
      return;
    }
    alert(`You have borrowed ${cart.length} book(s)!`);
    // You can clear the cart or handle further logic after borrowing
    localStorage.removeItem('cart');
    setCart([]);
  };

  return (
    <div className="borrow-page-container">
      <h2>Your Cart</h2>
      <div className="cart-items">
        {cart.length === 0 ? (
          <p>Your cart is empty. Please add books to borrow.</p>
        ) : (
          cart.map((book, index) => (
            <div key={index} className="cart-item">
              <h3>{book.name}</h3>
              <p><strong>Author:</strong> {book.author}</p>
              <p><strong>Genre:</strong> {book.genre}</p>
              <p><strong>Year:</strong> {book.year}</p>
              <p><strong>Description:</strong> {book.description}</p>
              <img src={book.imageUrl} alt={book.name} className="book-image" />
            </div>
          ))
        )}
      </div>
      <button onClick={handleBorrow} className="borrow-button">
        Borrow Books
      </button>
    </div>
  );
};

export default BorrowPage;
