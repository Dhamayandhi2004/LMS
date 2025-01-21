const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  name: String,
  author: String,
  genre: String,
  year: Number,
  description: String,
  imageUrl: String, // URL to the image (optional)
  price:Number,
});

const Book = mongoose.model('Book', bookSchema);
module.exports = Book;
