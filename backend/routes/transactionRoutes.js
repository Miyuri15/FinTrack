const express = require("express");
const Transaction = require("../models/Transaction");
const authMiddleware = require("../middleware/authMiddleware");
const { sendNotification } = require("../utils/notification");

const router = express.Router();

router.post("/", authMiddleware, async (req, res) => {
  const {
    type,
    amount,
    currency,
    category,
    tags,
    description,
    isRecurring,
    recurrencePattern,
  } = req.body;

  // Validate required fields
  if (!type || !amount || !description || !currency) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const transaction = new Transaction({
      user: req.user.id,
      type,
      amount,
      currency, 
      category,
      tags,
      description,
      isRecurring,
      recurrencePattern: isRecurring ? recurrencePattern : undefined,
    });
    await transaction.save();

    // Send a notification to the user
    try {
      await sendNotification(
        req.user.email,
        `New transaction added: ${description} - $${amount}`,
        req.user.id
      );
    } catch (notificationError) {
      console.error("Failed to send notification:", notificationError.message);
    }

    res.status(201).json(transaction);
  } catch (error) {
    console.error("Error creating transaction:", error.message);
    res.status(500).json({ error: "Error creating transaction" });
  }
});
// // Get transactions for logged-in user
// router.get('/', authMiddleware, async (req, res) => {
//     const { tags, sortBy } = req.query;
//     try {
//         let query = { user: req.user.id };
//         if (tags) {
//             query.tags = { $in: tags.split(',') }; // Filter by tags
//         }

//         let sortOptions = { date: -1 }; // Default sorting by date
//         if (sortBy === 'amount') {
//             sortOptions = { amount: -1 }; // Sort by amount
//         }

//         const transactions = await Transaction.find(query).sort(sortOptions);
//         res.json(transactions);
//     } catch (error) {
//         res.status(500).json({ error: 'Error fetching transactions' });
//     }
// });

// Get all transactions (with optional filters)
router.get("/", authMiddleware, async (req, res) => {
  const { tags, sortBy } = req.query;
  try {
    let query = { user: req.user.id }; // Default: Fetch transactions for the logged-in user

    // If the user is an admin and a specific userId is provided, fetch transactions for that user
    if (req.user.role === "admin" && req.query.userId) {
      query.user = req.query.userId;
    }

    // Filter by tags
    if (tags) {
      query.tags = { $in: tags.split(",") };
    }

    // Sorting options
    let sortOptions = { date: -1 }; // Default sorting by date (newest first)
    if (sortBy === "amount") {
      sortOptions = { amount: -1 }; // Sort by amount
    }

    const transactions = await Transaction.find(query).sort(sortOptions);
    res.json(transactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ error: "Error fetching transactions" });
  }
});

// Get all transactions (with optional filters)
router.get("/", authMiddleware, async (req, res) => {
  try {
    let query = {};

    if (req.user.role !== "admin") {
      query.user = req.user.id; // Regular users only see their own transactions
    }

    // Filter by tags
    if (tags) {
      query.tags = { $in: tags.split(",") };
    }

    // Sorting options
    let sortOptions = { date: -1 }; // Default sorting by date (newest first)
    if (sortBy === "amount") {
      sortOptions = { amount: -1 }; // Sort by amount
    }

    // Fetch transactions
    const transactions = await Transaction.find(query).populate(
      "user",
      "username"
    );
    res.json(transactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ error: "Error fetching transactions" });
  }
});

// Get all transactions of all users (Admin Only)
router.get('/all', authMiddleware, async (req, res) => {
  try {
      // Check if the user is an admin
      if (req.user.role !== 'admin') {
          return res.status(403).json({ error: 'Access denied. Admins only.' });
      }

      // Extract filters from query params
      const { tags, sortBy } = req.query;
      let query = {}; // Fetch all transactions without user restriction

      // Filter by tags
      if (tags) {
          query.tags = { $in: tags.split(',') };
      }

      // Sorting options
      let sortOptions = { date: -1 }; // Default sorting by date
      if (sortBy === 'amount') {
          sortOptions = { amount: -1 };
      }

      // Fetch all transactions, including user details
      const transactions = await Transaction.find(query)
      .sort(sortOptions)
      .populate("user", "username email")
      .lean(); // Convert to plain objects for safety
  
  // Filter out transactions without a valid user
  const validTransactions = transactions.filter(t => t.user);
  
  res.json(validTransactions);
    } catch (error) {
      console.error('Error fetching all transactions:', error);
      res.status(500).json({ error: 'Error fetching transactions' });
  }
});

// Get all transactions (Admin Only)
router.get('/allTransactions', authMiddleware, async (req, res) => {
  console.log("User making request:", req.user); // Log the user object
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admins only.' });
    }

    const transactions = await Transaction.find({}).populate('user', 'username email');
    res.json(transactions);
  } catch (error) {
    console.error('Error fetching all transactions:', error);
    res.status(500).json({ error: 'Error fetching transactions' });
  }
});


// Update a transaction
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { isRecurring, recurrencePattern, ...updateData } = req.body;
    const transaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      {
        ...updateData,
        isRecurring,
        recurrencePattern: isRecurring ? recurrencePattern : undefined,
      },
      { new: true }
    );
    res.json(transaction);
  } catch (error) {
    res.status(500).json({ error: "Error updating transaction" });
  }
});

// Delete a transaction
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    await Transaction.findByIdAndDelete(req.params.id);
    res.json({ message: "Transaction deleted" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting transaction" });
  }
});

// Route to get count of transactions for the logged-in user
router.get("/count", authMiddleware, async (req, res) => {
  try {
    const count = await Transaction.countDocuments({ user: req.user.id });
    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: "Error fetching transaction count" });
  }
});

module.exports = router;
