const mongoose = require("mongoose");

const RecommendationSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true }, // Unique ID for each recommendation
  category: { type: String },
  month: { type: String },
  message: { type: String },
});

module.exports = mongoose.model("Recommendation", RecommendationSchema);