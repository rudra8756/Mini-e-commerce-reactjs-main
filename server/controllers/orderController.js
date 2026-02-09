const Order = require("../models/Order");
const OrderItem = require("../models/OrderItem");
const Cart = require("../models/Cart");
const CartItem = require("../models/CartItem");
const Product = require("../models/Product");

// ================= PLACE ORDER =================
exports.placeOrder = async (req, res) => {
  try {
    const userId = "guest"; // For demo purposes
    const { shippingAddress, paymentMethod = "cod" } = req.body;

    // Get user's cart
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const cartItems = await CartItem.find({ cartId: cart._id }).populate("productId");
    const validCartItems = cartItems.filter(item => item.productId);
    if (validCartItems.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Calculate totals
    let totalAmount = 0;
    const orderItems = [];

    for (const item of validCartItems) {
      const product = item.productId;
      const quantity = item.quantity;
      const price = product.price;

      totalAmount += price * quantity;
      orderItems.push({
        productId: product._id,
        quantity,
        price
      });
    }

    // Create order
    const order = new Order({
      userId,
      totalAmount
    });

    await order.save();

    // Create order items
    for (const item of orderItems) {
      const orderItem = new OrderItem({
        orderId: order._id,
        ...item
      });
      await orderItem.save();
    }

    // Clear cart after order placement
    await CartItem.deleteMany({ cartId: cart._id });

    // Populate order with items
    const populatedOrder = await Order.findById(order._id);
    const orderItemsPopulated = await OrderItem.find({ orderId: order._id }).populate("productId");
    res.json({ ...populatedOrder.toObject(), products: orderItemsPopulated.map(item => ({ product: item.productId, quantity: item.quantity, price: item.price })) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= GET USER ORDERS =================
exports.getUserOrders = async (req, res) => {
  try {
    const userId = "guest"; // For demo purposes
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });

    const ordersWithItems = await Promise.all(orders.map(async (order) => {
      const orderItems = await OrderItem.find({ orderId: order._id }).populate("productId");
      return { ...order.toObject(), products: orderItems.map(item => ({ product: item.productId, quantity: item.quantity, price: item.price })) };
    }));

    res.json(ordersWithItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= GET ORDER BY ID =================
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const orderItems = await OrderItem.find({ orderId: order._id }).populate("productId");
    res.json({ ...order.toObject(), products: orderItems.map(item => ({ product: item.productId, quantity: item.quantity, price: item.price })) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= UPDATE ORDER STATUS =================
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { orderStatus },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const orderItems = await OrderItem.find({ orderId: order._id }).populate("productId");
    res.json({ ...order.toObject(), products: orderItems.map(item => ({ product: item.productId, quantity: item.quantity, price: item.price })) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
