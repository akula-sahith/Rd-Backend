const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema({
  finalTeamId: String,
  teamId: String,

  participants: [
    {
      name: String,
      transactionId: { type: String, unique: true, sparse: true },
      paymentProofUrl: String
    }
  ],

  status: {
    type: String,
    enum: ["PENDING", "VERIFIED", "REJECTED"],
    default: "PENDING"
  }
}, { timestamps: true });

module.exports = mongoose.model("Payment", PaymentSchema);
