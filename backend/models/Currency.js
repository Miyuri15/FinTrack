const mongoose = require("mongoose");

const CurrencySchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true }, // Currency code (e.g., USD, EUR)
  name: { type: String, required: true }, // Currency name (e.g., US Dollar, Euro)
  exchangeRate: { type: Number, required: true }, // Exchange rate relative to a base currency (e.g., USD)
}, { timestamps: true });

module.exports = mongoose.model("Currency", CurrencySchema);