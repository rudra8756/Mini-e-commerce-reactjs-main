const Product = require("../models/Product");

// GET ALL PRODUCTS
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();

    res.json({
      products: products
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
