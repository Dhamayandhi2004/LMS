const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
  email: { type: String, required: true },
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
});

const Favorite = mongoose.model('Favorite', favoriteSchema);
module.exports = Favorite;
