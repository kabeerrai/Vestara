const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

// ===============================
// GET /api/products
// Fetch all products (public) with optional filters
// ===============================
router.get("/", async (req, res) => {
  try {
    const { category, minPrice, maxPrice, sortBy, order } = req.query;

    const query = {};

    // Filter by category
    if (category && category !== 'all') {
      query.category = category;
    }

    // Filter by price range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Sorting
    let sort = {};
    if (sortBy) {
      sort[sortBy] = order === "desc" ? -1 : 1;
    } else {
      sort.createdAt = -1; // default: newest first
    }

    const products = await Product.find(query).sort(sort);

    res.json({
      success: true,
      total: products.length,
      products
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ===============================
// GET /api/products/:id
// Fetch single product by MongoDB _id
// ===============================
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, error: "Product not found" });
    }

    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ===============================
// GET /api/products/productId/:productId
// Fetch single product by custom productId
// ===============================
router.get("/productId/:productId", async (req, res) => {
  try {
    const product = await Product.findOne({ productId: req.params.productId });

    if (!product) {
      return res.status(404).json({ success: false, error: "Product not found" });
    }

    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;