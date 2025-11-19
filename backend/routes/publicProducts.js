const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

// ===============================
// GET /api/products
// Fetch all products (public) with optional filters, sorting, pagination
// ===============================
router.get("/", async (req, res) => {
  try {
    // Query parameters
    const { category, minPrice, maxPrice, sortBy, order, page, limit } = req.query;

    const query = {};

    // Filter by category
    if (category) {
      query.category = category;
    }

    // Filter by price range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Pagination
    const pageNumber = Number(page) || 1;
    const pageSize = Number(limit) || 20;
    const skip = (pageNumber - 1) * pageSize;

    // Sorting
    let sort = {};
    if (sortBy) {
      sort[sortBy] = order === "desc" ? -1 : 1;
    } else {
      sort.createdAt = -1; // default: newest first
    }

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .sort(sort)
      .skip(skip)
      .limit(pageSize);

    res.json({
      success: true,
      total,
      page: pageNumber,
      pageSize,
      products
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ===============================
// GET /api/products/:id
// Fetch single product by ID
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

module.exports = router;
