const mongoose = require("mongoose");

const fakeCounterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  seq: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("FakeCounter", fakeCounterSchema);
