const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      require: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 6,
    },
    user_first_name:{
      type: String,
      required: true
    },
    user_last_name:{
      type: String,
      required: true
    },
    email:{
      type: String,
      required: true
    },
    isAdmin:{
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
