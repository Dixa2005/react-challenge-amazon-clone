require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { User, Product, Order, Recommendation } = require("./models");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Fake Stripe Key (for demo purposes)
const stripe = require("stripe")("sk_test_fake_api_key_for_demo_purposes");

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/aura-styles", {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("MongoDB Database Connected"))
  .catch((err) => console.log("MongoDB Connection Error:", err));

// --- API ROUTES ---

app.get("/", (req, res) => res.status(200).send("Aura Styles Backend Running"));

// 1. PRODUCTS
app.get("/api/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. FAKE PAYMENT SYSTEM
app.post("/payments/create", async (req, res) => {
  const total = req.query.total;
  console.log("Payment request received for amount >>> ", total);
  
  // Fake Payment System logic (returns an object mimicking Stripe)
  res.status(201).send({
    clientSecret: "pi_fake_demo_secret_" + Date.now(),
  });
});

// 3. ORDERS
app.post("/api/orders", async (req, res) => {
  const { userId, items, totalAmount, paymentIntentId } = req.body;
  
  try {
    // If we have a user, link it. For guest checkout, handle differently.
    // Assuming user exists for demo.
    let user = await User.findOne({ email: userId });
    if (!user) {
        user = await User.create({ email: userId });
    }

    const newOrder = await Order.create({
      userId: user._id,
      items,
      totalAmount,
      paymentIntentId,
      status: "Ordered" // Default order status
    });
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/orders/:userEmail", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.userEmail });
    if (!user) return res.status(404).send("User not found");
    
    // Fetch orders and return status tracking info
    const orders = await Order.find({ userId: user._id }).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin Route to perfectly update Order status ("On the way", "Delivered")
app.put("/api/orders/:orderId/status", async (req, res) => {
  try {
    const { status } = req.body; // e.g., "On the way"
    const order = await Order.findByIdAndUpdate(req.params.orderId, { status }, { new: true });
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 4. WISHLIST & CART SYSTEM
app.post("/api/wishlist", async (req, res) => {
  const { email, productId } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user) user = await User.create({ email });

    // Validate productId is a valid MongoDB Object ID from frontend, or use string-based referencing
    // Since our product ID from React is like "A101", we will map things appropriately.
    // For a robust system, we would resolve MongoDB IDs.
    if (!user.wishlist.includes(productId)) {
        user.wishlist.push(productId);
        await user.save();
    }
    
    res.status(200).json(user.wishlist);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/cart", async (req, res) => {
  const { email, productId, quantity } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user) user = await User.create({ email });

    // Assuming productId is an ObjectId to Product collection
    user.cart.push({ productId, quantity: quantity || 1 });
    await user.save();
    
    res.status(200).json(user.cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Backend Server Running on Port: \${PORT}`);
});
