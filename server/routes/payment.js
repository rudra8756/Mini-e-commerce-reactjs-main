const express = require("express");
const router = express.Router();

// Stripe payment intent (only works if STRIPE_SECRET_KEY is set)
let stripe = null;
try {
  stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
} catch (e) {
  console.log("Stripe not configured - online payments disabled");
}

// Create payment intent for online payments
router.post("/create-payment-intent", async (req, res) => {
  try {
    if (!stripe) {
      return res.status(503).json({ 
        error: "Online payment not configured. Please use Cash on Delivery.",
        code: "STRIPE_NOT_CONFIGURED"
      });
    }

    const { amount } = req.body; // amount in cents
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "inr", // Use INR for India
    });
    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Cash on Delivery (COD) - this is always available
router.post("/cod", async (req, res) => {
  try {
    const { orderId } = req.body;
    
    // COD is always successful - the customer pays on delivery
    res.json({
      success: true,
      message: "Cash on Delivery selected. You will pay when the order is delivered.",
      paymentMethod: "cod",
      orderId: orderId
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get payment methods available
router.get("/methods", async (req, res) => {
  const methods = ["cod"]; // COD is always available
  
  if (stripe && process.env.STRIPE_SECRET_KEY) {
    methods.push("online");
  }
  
  res.json({
    availableMethods: methods,
    defaultMethod: "cod"
  });
});

module.exports = router;
