const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true
    },
    items: [{
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
      },
      title: String,
      price: Number,
      quantity: Number,
      thumbnail: String
    }],
    totalAmount: {
      type: Number,
      required: true
    },
    shippingAddress: {
      name: String,
      phone: String,
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: { type: String, default: "India" }
    },
    paymentMethod: {
      type: String,
      enum: ["cod", "online"],
      default: "cod"
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending"
    },
    orderStatus: {
      type: String,
      enum: ["placed", "confirmed", "processing", "shipped", "out_for_delivery", "delivered", "cancelled"],
      default: "placed"
    },
    estimatedDelivery: {
      type: Date
    },
    statusTimeline: [{
      status: String,
      timestamp: { type: Date, default: Date.now },
      description: String
    }]
  },
  { timestamps: true }
);

// Calculate estimated delivery before saving
orderSchema.pre('save', function(next) {
  if (!this.estimatedDelivery) {
    // Calculate delivery date based on location (3-7 days)
    const city = this.shippingAddress?.city?.toLowerCase() || '';
    let daysToDeliver = 7;
    
    if (city.includes('delhi') || city.includes('mumbai') || city.includes('bangalore') || 
        city.includes('hyderabad') || city.includes('chennai') || city.includes('kolkata')) {
      daysToDeliver = 3; // Metro cities - 3 days
    } else if (city.includes('pune') || city.includes('ahmedabad') || city.includes('jaipur')) {
      daysToDeliver = 4; // Tier 1 cities - 4 days
    } else if (city.includes('lucknow') || city.includes('kanpur') || city.includes('nagpur')) {
      daysToDeliver = 5; // Tier 2 cities - 5 days
    } else {
      daysToDeliver = 7; // Other cities - 7 days
    }
    
    this.estimatedDelivery = new Date();
    this.estimatedDelivery.setDate(this.estimatedDelivery.getDate() + daysToDeliver);
  }
  
  // Initialize status timeline if empty
  if (!this.statusTimeline || this.statusTimeline.length === 0) {
    this.statusTimeline = [{
      status: "placed",
      timestamp: new Date(),
      description: "Order placed successfully"
    }];
  }
  
  next();
});

module.exports = mongoose.model("Order", orderSchema);
