const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema(
  {
    longURL: {
      type: String,
      required: true,
      // unique: true,
    },
    shortID: {
      type: String,
      required: true,
      // unique: true,
    },
    clicks: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { timestamps: true }
);
const Url = mongoose.model("Url", urlSchema);

module.exports = Url;
