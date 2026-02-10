const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();

// MongoDB Connect
connectDB();

const app = express();

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://mini-e-commerce-reactjs-main-jw088qi4v.vercel.app"
  ],
  credentials: true
}));

app.use(express.json());

app.use("/api/products", require("./routes/product"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/cart", require("./routes/cart"));
app.use("/api/orders", require("./routes/order"));
app.use("/api/wishlist", require("./routes/wishlist"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

