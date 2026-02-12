const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, default: 'user' },
  address: {
    shipping: {
      street: String,
      city: String,
      state: String,
      zip: String,
      country: String
    },
    billing: {
      street: String,
      city: String,
      state: String,
      zip: String,
      country: String
    }
  },
  productsAdded: [{ productId: mongoose.Schema.Types.ObjectId, quantity: Number }]
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
