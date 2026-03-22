const mongoose = require("mongoose");

// User Schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String }, // Normally hashed, keeping simple for demo
  cart: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    quantity: { type: Number, default: 1 }
  }],
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }]
});
const User = mongoose.model("User", userSchema);

// Product Schema
const productSchema = new mongoose.Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  price: { type: Number, required: true },
  rating: { type: Number, default: 0 },
  image: { type: String, required: true },
  category: { type: String }
});
const Product = mongoose.model("Product", productSchema);

// Order Schema
const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    title: String,
    price: Number,
    image: String
  }],
  totalAmount: { type: Number, required: true },
  paymentIntentId: { type: String, required: true },
  status: { 
    type: String, 
    enum: ["Ordered", "On the way", "Delivered"], 
    default: "Ordered" 
  },
  createdAt: { type: Date, default: Date.now }
});
const Order = mongoose.model("Order", orderSchema);

// Recommendation Schema
const recommendationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  recommendedProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  reason: { type: String } // e.g. "Because you bought a Hoodie"
});
const Recommendation = mongoose.model("Recommendation", recommendationSchema);

module.exports = { User, Product, Order, Recommendation };
