const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const Order = require("./models/order");
const Review = require("./models/Review");
const adminRoutes = require("./routes/adminRoutes");

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// ==========================================
// ADMIN ROUTES (Protected with JWT)
// ==========================================
app.use("/api/admin", adminRoutes);

// ==========================================
// PUBLIC ROUTES (Existing routes)
// ==========================================

// POST – Create Order
app.post("/order", async (req, res) => {
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

// GET – Get All Orders (Public view - keep for compatibility)
app.get("/orders", async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 });
  res.json(orders);
});

// POST – Submit Review
app.post("/review", async (req, res) => {
  try {
    const review = new Review(req.body);
    await review.save();
    res.json({ success: true, message: "Review saved", review });
  } catch (err) {
    res.status(500).json({ success: false, error: err });
  }
});

// GET – Get All Reviews (Public - visible only)
app.get("/reviews", async (req, res) => {
  const reviews = await Review.find({ visible: true }).sort({ createdAt: -1 });
  res.json(reviews);
});

// DELETE – Delete an Order by ID (Public - keep for compatibility)
app.delete("/order/:id", async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Order deleted" });
  } catch (err) {
    res.status(500).json({ success: false, error: err });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));