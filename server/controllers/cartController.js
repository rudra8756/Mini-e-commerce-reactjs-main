const Cart = require("../models/Cart");
const CartItem = require("../models/CartItem");

// ================= ADD TO CART =================
exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const userId = "guest"; // For demo purposes

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId });
      await cart.save();
    }

    let cartItem = await CartItem.findOne({ cartId: cart._id, productId });

    if (cartItem) {
      cartItem.quantity += quantity;
    } else {
      cartItem = new CartItem({ cartId: cart._id, productId, quantity });
    }

    await cartItem.save();

    // Get all cart items for the cart
    const cartItems = await CartItem.find({ cartId: cart._id }).populate("productId");
    res.json({ ...cart.toObject(), products: cartItems.map(item => ({ product: item.productId, quantity: item.quantity })) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= GET CART =================
exports.getCart = async (req, res) => {
  try {
    const userId = "guest"; // For demo purposes
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.json({ products: [] });
    }

    const cartItems = await CartItem.find({ cartId: cart._id }).populate("productId");
    res.json({ ...cart.toObject(), products: cartItems.map(item => ({ product: item.productId, quantity: item.quantity })) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= REMOVE ITEM =================
exports.removeFromCart = async (req, res) => {
  try {
    const userId = "guest"; // For demo purposes
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    await CartItem.findOneAndDelete({ cartId: cart._id, productId: req.params.id });

    const cartItems = await CartItem.find({ cartId: cart._id }).populate("productId");
    res.json({ ...cart.toObject(), products: cartItems.map(item => ({ product: item.productId, quantity: item.quantity })) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= UPDATE QUANTITY =================
exports.updateQuantity = async (req, res) => {
  try {
    const { quantity } = req.body;
    const userId = "guest"; // For demo purposes
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const cartItem = await CartItem.findOne({ cartId: cart._id, productId: req.params.id });

    if (!cartItem) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    cartItem.quantity = quantity;
    await cartItem.save();

    const cartItems = await CartItem.find({ cartId: cart._id }).populate("productId");
    res.json({ ...cart.toObject(), products: cartItems.map(item => ({ product: item.productId, quantity: item.quantity })) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
