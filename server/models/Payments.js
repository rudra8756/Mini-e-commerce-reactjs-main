const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ["credit_card", "debit_card", "paypal", "bank_transfer", "cod"],
    required: true
  },
  details: {
    // For demo, store as string; in production, encrypt
    cardNumber: String,
    expiryDate: String,
    cvv: String,
    paypalEmail: String,
    bankAccount: String
  }
}, { timestamps: true });

module.exports = mongoose.model("Payment", paymentSchema);
