const mongoose = require('mongoose');

const CartItemSchema = new mongoose.Schema({
  email: { type: String, required: true },
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  bookName: { type: String, required: true },
  imageUrl: { type: String, required: true },
  price:{type:Number,required:true}, // Add imageUrl field
});

const CartItem = mongoose.model('CartItem', CartItemSchema);

module.exports = CartItem;
