// app.js
import dotenv from "dotenv";
dotenv.config(); // Load environment variables

import mongoose from "mongoose";

const express = require('express');

const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// --- MongoDB Product Schema ---
const productSchema = new mongoose.Schema({
    id: Number,
    name: String,
    price: Number,
    category: String,
    inStock: Boolean,
    rating: Number,
    shortDescription: String,
    longDescription: String,
    images: [String]
});

const Product = mongoose.model('Product', productSchema);

// --- Preload your static products into MongoDB if empty ---
const products = [
    {
        id: 1,
        name: "Golden Mesh Ring",
        price: 900.00,
        category: "Bracelets",
        inStock: true,
        rating: 4.5,
        shortDescription: "Luxurious mesh design gold plated ring",
        longDescription: "This stunning mesh ring features an intricate design that catches the light from every angle. Gold plated and adjustable.",
        images: [
            "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=800&q=80",
            "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80"
        ]
    },
    {
        id: 2,
        name: "Heart Drop Earrings",
        price: 1530.00,
        category: "Earrings",
        inStock: true,
        rating: 4.9,
        shortDescription: "Double heart gold statement earrings",
        longDescription: "Bold and beautiful, these double heart drop earrings are the perfect statement piece for any outfit. Lightweight and comfortable.",
        images: [
            "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80",
            "https://images.unsplash.com/photo-1630019852942-f89202989a51?w=800&q=80"
        ]
    },
    // ... Add all the rest of your products here (id 3–8)
];

// --- API Routes ---

// Get all products
app.get('/api/products', async (req, res) => {
    try {
        const allProducts = await Product.find();
        res.json({ success: true, products: allProducts });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Get single product by id
app.get('/api/products/:id', async (req, res) => {
    try {
        const product = await Product.findOne({ id: parseInt(req.params.id) });
        if (!product) return res.status(404).json({ success: false, error: 'Product not found' });
        res.json({ success: true, product });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// --- Connect to MongoDB & start server ---
const PORT = process.env.PORT || 5000;
const MONGO_URI = 'mongodb://127.0.0.1:27017/vestara'; // change DB name if you want

mongoose.connect(process.env.MONGO_URI, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
})
.then(async () => {
    console.log('MongoDB connected');

    // Preload products if DB is empty
    const count = await Product.countDocuments();
    if(count === 0){
        await Product.insertMany(products);
        console.log('Static products inserted into MongoDB');
    }

    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})
.catch(err => console.error('MongoDB connection error:', err));
