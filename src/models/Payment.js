const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema(
  {
    // Old registration reference
    registrationId: {
      type: String,
      required: true,
      index: true
    },

    // New Final Team ID (generated after payment)
    finalTeamId: {
      type: String,
      unique: true,
      required: true
    },

    // Final names (certificate-safe)
    finalLeaderName: {
      type: String,
      required: true
    },

    finalMembers: [
      {
        name: { type: String, required: true }
      }
    ],

    // Payment gateway details
    paymentId: {
      type: String,
      required: true
    },

    amount: {
      type: Number,
      required: true
    },

    status: {
      type: String,
      enum: ["SUCCESS", "FAILED"],
      default: "SUCCESS"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", PaymentSchema);
