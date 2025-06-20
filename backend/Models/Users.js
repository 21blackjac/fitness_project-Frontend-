const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    activity: {
      type: String,
      required: true,
    },
    statusMembership: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("Users", userSchema);
module.exports = User;
