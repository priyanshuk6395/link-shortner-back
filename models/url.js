const { default: mongoose } = require("mongoose");

const urlSchema = new mongoose.Schema(
  {
    shortId: {
      type: String,
      required: true,
      unique: true,
    },
    redirectUrl: {
      type: String,
      required: true,
    },
    visitHistory: [{ timeStamp: { type: Number } }],
    totalClicks: {
      type: Number,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("URL", urlSchema);
