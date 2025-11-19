// server.js (Top Section)
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const Order = require("./models/order"); // <-- FIX IS HERE
const Review = require("./models/Review"); // <-- This was already correct
const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));


// POST — Create Order (This code maps the flat frontend data to your nested Mongoose schema)
// POST — Create Order (Updated for dynamic cart processing)
app.post("/order", async (req, res) => {
  try {
    const incomingData = req.body;

    // --- Customer Details Mapping (Kept intact) ---
    const customerDetails = {
      name: incomingData.name,
      email: incomingData.email,
      phone: incomingData.phone, // Phone mapping confirmed
      street: incomingData.address, 
      city: incomingData.city, 
      zipCode: incomingData.zipCode,
      state: incomingData.state,
      country: incomingData.country,
    };
    
    // --- Product and Total Calculation (NEW LOGIC) ---
    
    // 1. Calculate the secure total based on items sent from the frontend
    if (!incomingData.products || incomingData.products.length === 0) {
        return res.status(400).json({ success: false, error: "Cart is empty." });
    }
    
    const calculatedTotal = incomingData.products.reduce((sum, item) => 
        sum + (item.price * item.quantity), 0
    );

    // 2. Create the final order object
    const finalOrderData = {
      customer: customerDetails, 
      products: incomingData.products, // Save the entire product array
      paymentMethod: incomingData.paymentMethod || "Cash on Delivery",
      totalAmount: calculatedTotal, // Use the calculated total
    };

    const order = new Order(finalOrderData);
    await order.save();
    
    res.json({ success: true, message: "Order saved", order }); 

  } catch (err) {
    console.error("Order Save Error:", err); 
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET — Get All Orders
app.get("/orders", async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 });
  res.json(orders);
});


// POST — Submit Review
app.post("/review", async (req, res) => {
  try {
    const review = new Review(req.body);
    await review.save();
    res.json({ success: true, message: "Review saved", review });
  } catch (err) {
    res.status(500).json({ success: false, error: err });
  }
});

// GET — Get All Reviews
app.get("/reviews", async (req, res) => {
  const reviews = await Review.find().sort({ createdAt: -1 });
  res.json(reviews);
});

// DELETE — Delete an Order by ID
app.delete("/order/:id", async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Order deleted" });
  } catch (err) {
    res.status(500).json({ success: false, error: err });
  }
});


app.listen(5000, () => console.log("Server running on port 5000"));
