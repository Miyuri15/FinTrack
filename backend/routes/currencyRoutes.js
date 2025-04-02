const express = require("express");
const axios = require("axios");
const Currency = require("../models/Currency");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

const EXCHANGE_RATES_API_KEY = "bb1ff0db1d97e6dc3b83f327a65eec9e"; // Replace with your API key
const EXCHANGE_RATES_API_URL = "https://api.exchangeratesapi.io/v1/latest?access_key=bb1ff0db1d97e6dc3b83f327a65eec9e";

// Fetch all currencies
router.get("/", authMiddleware, async (req, res) => {
  try {
    const currencies = await Currency.find({});
    res.json(currencies);
  } catch (error) {
    res.status(500).json({ error: "Error fetching currencies" });
  }
});

// Add a new currency
router.post("/add", authMiddleware, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Access denied. Admins only." });
  }

  const { code, name, exchangeRate } = req.body;

  try {
    const currency = new Currency({ code, name, exchangeRate });
    await currency.save();
    res.status(201).json(currency);
  } catch (error) {
    console.error("Error adding currency:", error);
    res.status(500).json({ error: "Error adding currency", details: error.message });
  }
});

// Update exchange rates (Admin Only)
router.put("/:id", authMiddleware, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Access denied. Admins only." });
  }

  const { exchangeRate } = req.body;
  try {
    const currency = await Currency.findByIdAndUpdate(
      req.params.id,
      { exchangeRate },
      { new: true }
    );
    res.json(currency);
  } catch (error) {
    res.status(500).json({ error: "Error updating currency" });
  }
});

// Fetch real-time exchange rates
router.get("/real-time-rates", authMiddleware, async (req, res) => {
  const { base } = req.query; // Get the base currency from query params

  if (!base) {
    return res.status(400).json({ error: "Base currency is required" });
  }

  try {
    const apiUrl = `${EXCHANGE_RATES_API_URL}`;
    console.log("Calling External API:", apiUrl);

    const response = await axios.get(apiUrl);
    console.log("API Response:", response.data);

    if (!response.data || !response.data.rates) {
      throw new Error("Invalid API response");
    }

    const rates = response.data.rates;

    // Check if the base currency is supported
    if (!rates[base]) {
      throw new Error(`Base currency ${base} not supported`);
    }

    // Calculate exchange rates relative to the base currency
    const baseRate = rates[base];
    const exchangeRates = {};
    for (const [currency, rate] of Object.entries(rates)) {
      exchangeRates[currency] = rate / baseRate;
    }

    res.json(exchangeRates);
  } catch (error) {
    console.error("Error fetching real-time exchange rates:", error.message);
    res.status(500).json({ error: "Error fetching real-time exchange rates", details: error.message });
  }
});


module.exports = router;