const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();

// MongoDB Connect
connectDB();

const app = express();

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if(!origin) return callback(null, true);
    
    // Allow all origins in development and production
    return callback(null, true);
  },
  credentials: true
}));

app.use(express.json());

// ✅ Root Route (Add This)
app.get("/", (req, res) => {
  res.send("Mini Ecommerce API is Running 🚀");
});

app.use("/api/products", require("./routes/product"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/cart", require("./routes/cart"));
app.use("/api/orders", require("./routes/order"));
app.use("/api/wishlist", require("./routes/wishlist"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

