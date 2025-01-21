const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const { register, login } = require('./controllers/authController');
const User = require('./models/User'); // Import your User schema
const Favorite = require('./models/Favorite'); // Import the Favorite schema
const CartItem = require('./models/cart'); // Adjust the path to your Cart model
dotenv.config(); // Load environment variables from .env file
const axios = require('axios');

const app = express();

// Middleware
app.use(express.json()); // For parsing JSON bodies
app.use(cors()); // Enable Cross-Origin Resource Sharing

// Log the MongoDB URI for debugging (useful for development, but remove in production)
console.log('MONGO_URI:', process.env.MONGO_URI);

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('MongoDB connection error:', err));

// Book Schema
const bookSchema = new mongoose.Schema({
  name: { type: String, required: true, maxlength: 100 },
  author: { type: String, required: true, maxlength: 100 },
  genre: { type: String, required: true, maxlength: 50 },
  imageUrl: { type: String },
  year: { 
    type: Number, 
    required: true, 
    min: [1000, 'Year must be after 1000'], 
    max: [new Date().getFullYear(), 'Year cannot be in the future'] 
  },
  description: { type: String, required: true, maxlength: 1000 },
  price:{type:Number,required:true}
});

const Book = mongoose.model('Book', bookSchema);

// Routes
app.post('/api/register', register); // Register route
app.post('/api/login', login); // Login route

// Register controller
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save the new user
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ message: 'Registration failed', error });
  }
};

// Login controller
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Email not registered' });
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      return res.status(200).json({ message: 'Login successful', user });
    }

    return res.status(401).json({ message: 'Invalid password' });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Login failed', error });
  }
};

// Get all books
app.get('/books', async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (err) {
    console.error('Error fetching books:', err);
    res.status(500).json({ message: 'Error fetching books', error: err });
  }
});

// Add a new book
app.post('/books', async (req, res) => {
  const { name, author, genre, imageUrl, year, description,price } = req.body;
  try {
    const newBook = new Book({ name, author, genre, imageUrl, year, description,price });
    await newBook.save();
    res.status(201).json(newBook);
  } catch (err) {
    console.error('Error adding new book:', err);
    res.status(400).json({ message: 'Error adding new book', error: err });
  }
});

// Update an existing book
app.put('/books/:id', async (req, res) => {
  const { name, author, genre, imageUrl, year, description,price } = req.body;
  try {
    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      { name, author, genre, imageUrl, year, description,price },
      { new: true, runValidators: true } // Ensure validation runs on updates
    );
    if (!updatedBook) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.json(updatedBook);
  } catch (err) {
    console.error('Error updating book:', err);
    res.status(400).json({ message: 'Error updating book', error: err });
  }
});

// Delete a book
app.delete('/books/:id', async (req, res) => {
  try {
    
    const deletedBook = await Book.findByIdAndDelete(req.params.id);
    if (!deletedBook) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.status(200).json({ message: 'Book deleted successfully' });
  } catch (err) {
    console.error('Error deleting book:', err);
    res.status(400).json({ message: 'Error deleting book', error: err });
  }
});

// Fetch favorite books for a specific user
app.get('/favorites', async (req, res) => {
  const { email } = req.query;
  try {
    const favorites = await Favorite.find({ email }).populate('bookId');
    res.json(favorites.map(favorite => favorite.bookId)); // Return only the book details
  } catch (error) {
    res.status(500).send('Error fetching favorites');
  }
});

// Add a book to favorites
app.post('/favorites', async (req, res) => {
  const { email, bookId } = req.body;
  try {
    const newFavorite = new Favorite({ email, bookId });
    await newFavorite.save();
    res.json({ message: 'Book added to favorites' });
  } catch (error) {
    console.error('Error adding to favorites:', error);
    res.status(500).send('Error adding to favorites');
  }
});






app.get('/cart', async (req, res) => {
  const { email } = req.query;

  // Validate email
  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    // Fetch cart items for the user with the given email
    const cartItems = await CartItem.find({ email })
      .populate('bookId') // Assuming 'bookId' is a reference to the book collection
      .lean(); // Use lean for better performance

    if (cartItems.length === 0) {
      return res.status(404).json({ message: 'No items in cart' });
    }

    // Transform the response to include only the necessary book details
    const response = cartItems.map((cartItem) => {
      // Handle case where `bookId` is not populated
      const book = cartItem.bookId || {}; // Use empty object as a fallback
      return {
        bookId: book._id || cartItem.bookId, // Return the raw `bookId` if `populate` fails
        name: book.name || 'Unknown',
        author: book.author || 'Unknown',
        genre: book.genre || 'Unknown',
        year: book.year || 'Unknown',
        description: book.description || 'No description available',
        imageUrl: book.imageUrl || '',
        price: book.price || 0,
      };
    });

    res.json(response);
  } catch (error) {
    console.error('Error fetching cart items:', error.message);
    res.status(500).json({ message: 'Error fetching cart items', error: error.message });
  }
});





app.post('/cart', async (req, res) => {
  const { email, bookId, bookName, imageUrl,price } = req.body;
  console.log(req.body);
  if (!email || !bookId || !bookName || !imageUrl||!price) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    // Check if the item is already in the cart
    const existingItem = await CartItem.findOne({ email, bookId });
    if (existingItem) {
      return res.status(409).json({ message: 'Item already in cart' });
    } 

    // Create a new cart item
    const newCartItem = new CartItem({ email, bookId, bookName, imageUrl,price });
    await newCartItem.save();

    res.status(201).json({ message: 'Item added to cart', newCartItem });
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ message: 'Failed to add to cart' });
  }
});



































const OrderSchema = new mongoose.Schema({
  bookId: String,
  bookName: String,
  userEmail: String,
  userName: String,
  userAddress: String,
  userContact: String,
  quantity: { type: Number, default: 1 },
  totalPrice: { type: Number, required: true }, // Add type and required
    paymentMethod: { type: String },
  orderTime: { type: Date, default: Date.now },
  }, { timestamps: true });


const Order = mongoose.model('Order', OrderSchema);

app.post('/orders', async (req, res) => {
  const { bookId, bookName, userEmail, userName, userAddress, userContact, quantity, paymentMethod } = req.body;

  try {
    // Fetch the book details from the database using the bookId
    const book = await Book.findById(bookId);

    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    // Calculate the total price
    const totalPrice = book.price * quantity;

    console.log('Received order:', { bookId, bookName, userEmail, userName, userAddress, userContact, quantity, totalPrice, paymentMethod });

    // Create a new order with the totalPrice
    const newOrder = new Order({
      bookId,
      bookName,
      userEmail,
      userName,
      userAddress,
      userContact,
      quantity,
      totalPrice,
      paymentMethod,
    });

    // Save the order to the database
    await newOrder.save();
    res.status(200).json({ message: 'Order placed successfully' });
  } catch (error) {
    console.error('Error placing order:', error);
    res.status(500).json({ error: 'Failed to place order' });
  }
});

















app.delete("/del", async (req, res) => {
  const { bookName, email } = req.body;

  if (!bookName || !email) {
    return res.status(400).json({ success: false, message: "Book name or email is missing." });
  }

  try {
    // Fetch the cart item and remove the book by its name or bookId reference
    const cartItem = await CartItem.findOne({ email, bookName }); // Use bookName to find the correct book

    if (!cartItem) {
      return res.status(404).json({ success: false, message: "Book not found in cart." });
    }

    // Proceed to delete the book item from the cart
    await CartItem.deleteOne({ _id: cartItem._id });  // Delete the specific cart item

    res.json({ success: true, message: "Book removed from cart." });

  } catch (error) {
    console.error("Error removing book from cart:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
});
























// Admin route to fetch all orders
app.get('/getAllOrders', async (req, res) => {
  try {
    const orders = await Order.find(); // Fetch all orders from DB
    res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching orders' });
  }
});





// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
	
