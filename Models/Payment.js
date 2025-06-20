const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  duration: {
    type: String,
    require: true,
  },
  price: {
    type: Number,
    require: true,
  },
  description: {
    type: String,
    require: true,
  },
});

const payment = mongoose.model("payment", paymentSchema);
module.exports = payment;
