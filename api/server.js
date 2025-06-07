require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;
const database = require("./database");

// ✅ Enable CORS for multiple Netlify frontend URLs
app.use(cors({
    origin: [
        "http://localhost:5173", // ← allow local dev
        "https://amazing-pegasus-c2b674.netlify.app",
        "https://superlative-moonbeam-54f566.netlify.app"
    ],
    credentials: true
}));


app.use(express.json());

// ✅ Get all products OR filter by category
app.get("/api/products", (req, res) => {
    const category = req.query.category;
    let query = "SELECT * FROM products";
    let params = [];

    if (category) {
        query += " WHERE category = ?";
        params.push(category);
    }

    database.query(query, params, (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ error: "An error occurred" });
        }
        res.json(results);
    });
});

// ✅ Get single product by URI
app.get("/api/products/:id", (req, res) => {
    const productId = req.params.id;

    database.query(
        "SELECT * FROM products WHERE uri = ? LIMIT 1",
        [productId],
        (error, results) => {
            if (error) {
                return res.status(500).json({ error: "An error occurred" });
            }
            res.json(results[0]);
        }
    );
});

// ✅ Get related products by category
app.get("/api/products/related/:id", (req, res) => {
    const category = req.params.id;

    database.query(
        "SELECT * FROM products WHERE category = ? LIMIT 4",
        [category],
        (error, results) => {
            if (error) {
                return res.status(500).json({ error: "An error occurred" });
            }
            res.json(results);
        }
    );
});

app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});
