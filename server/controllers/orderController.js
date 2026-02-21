const Order = require("../models/Order");
const OrderItem = require("../models/OrderItem");
const Cart = require("../models/Cart");
const CartItem = require("../models/CartItem");
const Product = require("../models/Product");

// ================= PLACE ORDER =================
exports.placeOrder = async (req, res) => {
  try {
    const userId = req.body.userId || "guest";
    const { 
      shippingAddress, 
      paymentMethod = "cod",
      userId: reqUserId 
    } = req.body;

    // Use authenticated user ID if available
    const finalUserId = reqUserId || userId;

    // Get user's cart
    const cart = await Cart.findOne({ userId: finalUserId });
    if (!cart) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const cartItems = await CartItem.find({ cartId: cart._id }).populate("productId");
    const validCartItems = cartItems.filter(item => item.productId);
    if (validCartItems.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Calculate totals and prepare items
    let totalAmount = 0;
    const orderItems = [];

    for (const item of validCartItems) {
      const product = item.productId;
      const quantity = item.quantity;
      const price = product.price;

      totalAmount += price * quantity;
      orderItems.push({
        productId: product._id,
        title: product.title,
        price: price,
        quantity: quantity,
        thumbnail: product.thumbnail
      });
    }

    // Create order with all details including shipping address
    const order = new Order({
      userId: finalUserId,
      items: orderItems,
      totalAmount: totalAmount,
      shippingAddress: shippingAddress || {},
      paymentMethod: paymentMethod,
      paymentStatus: paymentMethod === "cod" ? "pending" : "pending"
    });

    await order.save();

    // Clear cart after order placement
    await CartItem.deleteMany({ cartId: cart._id });

    // Return the complete order with estimated delivery
    res.json({
      success: true,
      order: order,
      message: paymentMethod === "cod" ? "Order placed successfully! You will pay on delivery." : "Order placed successfully!"
    });
  } catch (error) {
    console.error("Place order error:", error);
    res.status(500).json({ message: error.message });
  }
};

// ================= GET USER ORDERS =================
exports.getUserOrders = async (req, res) => {
  try {
    const userId = req.query.userId || "guest";
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });

    res.json(orders);
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

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= UPDATE ORDER STATUS =================
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus, description } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Update order status
    order.orderStatus = orderStatus;
    
    // Add to status timeline
    order.statusTimeline.push({
      status: orderStatus,
      timestamp: new Date(),
      description: description || `Order status updated to ${orderStatus}`
    });

    await order.save();

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= CONFIRM PAYMENT =================
exports.confirmPayment = async (req, res) => {
  try {
    const { paymentStatus } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.paymentStatus = paymentStatus;
    
    if (paymentStatus === "paid") {
      order.statusTimeline.push({
        status: "confirmed",
        timestamp: new Date(),
        description: "Payment confirmed, order confirmed"
      });
      order.orderStatus = "confirmed";
    }

    await order.save();

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
