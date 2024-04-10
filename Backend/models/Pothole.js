const mongoose = require("mongoose");

const PotholeSchema = new mongoose.Schema(
  {
    coordinates: {
      type: String,
      require: true
    },
    address:{
      type: String,
      require: true
    },
    video:{
      type: String
    },
    image:{
      type: String
    },
    severe_level:{
      type: String
    },
    repairment_needed:{
      type: Boolean
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Pothole", PotholeSchema);
