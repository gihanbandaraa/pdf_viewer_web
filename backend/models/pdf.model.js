const mongoose = require("mongoose");

const pdfSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  originalFilename: {
    type: String,
    required: true,
  },
  path: { type: String, required: true },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});

const Pdf = mongoose.model("Pdf", pdfSchema);

module.exports = Pdf;
