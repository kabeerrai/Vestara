const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();

const AdminUser = require("../models/AdminUser");
const Product = require("../models/Product");
const Order = require("../models/order");
const Review = require("../models/Review");
const authMiddleware = require("../middleware/authMiddleware");

// ==========================================
// AUTHENTICATION ROUTES
// ==========================================

// POST /api/admin/login - Admin login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        error: "Email and password are required" 
      });
    }

    // Find admin user
    const admin = await AdminUser.findOne({ email: email.toLowerCase() });
    if (!admin) {
      return res.status(401).json({ 
        success: false, 
        error: "Invalid credentials" 
      });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, admin.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ 
        success: false, 
        error: "Invalid credentials" 
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: admin._id, 
        email: admin.email, 
        role: admin.role 
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({
      success: true,
      token,
      admin: {
        id: admin._id,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/admin/register - Create first admin (remove after first use)
router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if admin already exists
    const existingAdmin = await AdminUser.findOne({ email: email.toLowerCase() });
    if (existingAdmin) {
      return res.status(400).json({ 
        success: false, 
        error: "Admin already exists" 
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create admin
    const admin = new AdminUser({
      email: email.toLowerCase(),
      passwordHash,
      role: "admin"
    });

    await admin.save();

    res.json({ 
      success: true, 
      message: "Admin created successfully",
      admin: { email: admin.email }
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==========================================
// PROTECTED ROUTES (require authentication)
// ==========================================

// All routes below this line require authentication
router.use(authMiddleware);

// ==========================================
// DASHBOARD / STATS
// ==========================================

// GET /api/admin/stats - Dashboard statistics
router.get("/stats", async (req, res) => {
  try {
    const [orders, products, reviews] = await Promise.all([
      Order.find(),
      Product.find(),
      Review.find({ visible: true })
    ]);

    // Calculate stats
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    const totalProfit = orders.reduce((sum, order) => {
      const orderProfit = order.products.reduce((pSum, item) => {
        const product = products.find(p => p._id.toString() === item.productId);
        const cost = product ? product.cost : 0;
        return pSum + ((item.price - cost) * item.quantity);
      }, 0);
      return sum + orderProfit;
    }, 0);

    // Recent orders (last 5)
    const recentSales = orders
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5)
      .map(order => ({
        id: order._id,
        orderNumber: order.orderNumber,
        customer: order.customer.name,
        total: order.totalAmount,
        date: order.createdAt,
        status: order.status
      }));

    // Top products (by order count)
    const productSales = {};
    orders.forEach(order => {
      order.products.forEach(item => {
        if (!productSales[item.productId]) {
          productSales[item.productId] = {
            name: item.name,
            count: 0,
            revenue: 0
          };
        }
        productSales[item.productId].count += item.quantity;
        productSales[item.productId].revenue += item.price * item.quantity;
      });
    });

    const topProducts = Object.values(productSales)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    res.json({
      success: true,
      stats: {
        totalOrders,
        totalRevenue,
        totalProfit,
        totalProducts: products.length,
        totalReviews: reviews.length,
        recentSales,
        topProducts
      }
    });
  } catch (error) {
    console.error("Stats error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==========================================
// PRODUCTS ROUTES
// ==========================================

// GET /api/admin/products - Get all products
router.get("/products", async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/admin/products - Create product
router.post("/products", async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// PUT /api/admin/products/:id - Update product
router.put("/products/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!product) {
      return res.status(404).json({ 
        success: false, 
        error: "Product not found" 
      });
    }

    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE /api/admin/products/:id - Delete product
router.delete("/products/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    
    if (!product) {
      return res.status(404).json({ 
        success: false, 
        error: "Product not found" 
      });
    }

    res.json({ success: true, message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==========================================
// ORDERS ROUTES
// ==========================================

// GET /api/admin/orders - Get all orders
router.get("/orders", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/admin/orders/:id - Get single order
router.get("/orders/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ 
        success: false, 
        error: "Order not found" 
      });
    }

    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// PUT /api/admin/orders/:id - Update order status
router.put("/orders/:id", async (req, res) => {
  try {
    const { status } = req.body;
    
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    
    if (!order) {
      return res.status(404).json({ 
        success: false, 
        error: "Order not found" 
      });
    }

    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE /api/admin/orders/:id - Delete order
router.delete("/orders/:id", async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    
    if (!order) {
      return res.status(404).json({ 
        success: false, 
        error: "Order not found" 
      });
    }

    res.json({ success: true, message: "Order deleted" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==========================================
// REVIEWS ROUTES
// ==========================================

// GET /api/admin/reviews - Get all reviews
router.get("/reviews", async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.json({ success: true, reviews });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// PUT /api/admin/reviews/:id/toggle - Toggle review visibility
router.put("/reviews/:id/toggle", async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({ 
        success: false, 
        error: "Review not found" 
      });
    }

    review.visible = !review.visible;
    await review.save();

    res.json({ success: true, review });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE /api/admin/reviews/:id - Delete review
router.delete("/reviews/:id", async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    
    if (!review) {
      return res.status(404).json({ 
        success: false, 
        error: "Review not found" 
      });
    }

    res.json({ success: true, message: "Review deleted" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;