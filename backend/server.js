// Load environment variables first
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Import models
const Product = require("./models/Product");
const Order = require("./models/Order");
const Review = require("./models/Review");

// Import routes
const adminRoutes = require("./routes/adminRoutes");
const publicRoutes = require("./routes/publicRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/vestara';

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");
    
    // Start server after DB connection
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

// ==========================================
// PUBLIC ROUTES
// ==========================================

// Public product routes
app.use("/api/products", publicRoutes);

// POST – Create Order
app.post("/api/order", async (req, res) => {
  try {
    const incomingData = req.body;

    const customerDetails = {
      name: incomingData.name,
      email: incomingData.email,
      phone: incomingData.phone,
      street: incomingData.address, 
      city: incomingData.city, 
      zipCode: incomingData.zipCode,
      state: incomingData.state,
      country: incomingData.country,
    };
    
    if (!incomingData.products || incomingData.products.length === 0) {
      return res.status(400).json({ success: false, error: "Cart is empty." });
    }
    
    const calculatedTotal = incomingData.products.reduce((sum, item) => 
      sum + (item.price * item.quantity), 0
    );

    const finalOrderData = {
      customer: customerDetails, 
      products: incomingData.products,
      paymentMethod: incomingData.paymentMethod || "Cash on Delivery",
      totalAmount: calculatedTotal,
    };

    const order = new Order(finalOrderData);
    await order.save();
    
    res.json({ success: true, message: "Order saved", order }); 

  } catch (err) {
    console.error("Order Save Error:", err); 
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET – Get All Orders (Public view)
app.get("/api/orders", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST – Submit Review
app.post("/api/review", async (req, res) => {
  try {
    const review = new Review(req.body);
    await review.save();
    res.json({ success: true, message: "Review saved", review });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET – Get All Reviews (Public - visible only)
app.get("/api/reviews", async (req, res) => {
  try {
    const reviews = await Review.find({ visible: true }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE – Delete an Order by ID (Public)
app.delete("/api/order/:id", async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Order deleted" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ==========================================
// ADMIN ROUTES (Protected with JWT)
// ==========================================
app.use("/api/admin", adminRoutes);

// Health check route
app.get("/", (req, res) => {
  res.json({ 
    message: "Vestara API is running", 
    version: "2.0.0",
    endpoints: {
      public: ["/api/products", "/api/order", "/api/reviews"],
      admin: ["/api/admin/login", "/api/admin/products", "/api/admin/orders"]
    }
  });
});

// Handle 404
app.use((req, res) => {
  res.status(404).json({ success: false, error: "Route not found" });
});