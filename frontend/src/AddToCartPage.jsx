// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const CartPage = () => {
//   const [cartItems, setCartItems] = useState([]);
//   const email = localStorage.getItem('userEmail'); // Retrieve the user's email from localStorage

//   useEffect(() => {
//     if (email) {
//       axios.get(`/cart?email=${email}`)
//         .then(response => {
//           setCartItems(response.data); // Set the cart items (book details)
//         })
//         .catch(error => {
//           console.error('Error fetching cart items:', error);
//         });
//     } else {
//       console.log('No email found in localStorage');
//     }
//   }, [email]);

//   return (
//     <div>
//       <h2>Your Cart</h2>
//       {cartItems.length === 0 ? (
//         <p>No items in cart.</p>
//       ) : (
//         cartItems.map((book, index) => (
//           // Check if book is not null and has the necessary properties
//           book ? (
//             <div key={index}>
//               <h3>{book.name}</h3>
//               <p>Author: {book.author}</p>
//               <p>Genre: {book.genre}</p>
//               <p>Year: {book.year}</p>
//               <p>Description: {book.description}</p>
//               <img src={book.imageUrl} alt={book.name} />
//             </div>
//           ) : (
//             <div key={index}>
//               <p>Invalid or missing book data</p>
//             </div>
//           )
//         ))
//       )}
//     </div>
//   );
// };

// export default CartPage;
