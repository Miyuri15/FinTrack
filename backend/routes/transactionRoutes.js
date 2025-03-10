const express = require("express");
const Transaction = require("../models/Transaction");
const authMiddleware = require("../middleware/authMiddleware");
const { sendNotification } = require("../utils/notificationUtils");
const User = require('../models/User');
const Notification = require("../models/Notification");
const Budget = require("../models/Budget");
const Goal = require("../models/Goal");

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
      let nextOccurrence = null;
      if (isRecurring && recurrencePattern) {
          nextOccurrence = calculateNextOccurrence(new Date(), recurrencePattern.frequency);
      }

      const transaction = new Transaction({
          user: req.user.id,
          type,
          amount,
          currency,
          category,
          tags,
          description,
          isRecurring,
          recurrencePattern: isRecurring ? {
              ...recurrencePattern,
              nextOccurrence
          } : undefined,
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
      let nextOccurrence = null;
      if (isRecurring && recurrencePattern) {
          nextOccurrence = calculateNextOccurrence(new Date(), recurrencePattern.frequency);
      }

      const transaction = await Transaction.findByIdAndUpdate(
          req.params.id,
          {
              ...updateData,
              isRecurring,
              recurrencePattern: isRecurring ? {
                  ...recurrencePattern,
                  nextOccurrence
              } : undefined,
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

router.get('/test-cron', async (req, res) => {
  try {
      // Copy and paste the cron job logic here
      const currentDate = new Date();
      const twoDaysFromNow = new Date(currentDate.setDate(currentDate.getDate() + 2));

      const recurringTransactions = await Transaction.find({
          isRecurring: true,
          $or: [
              { 'recurrencePattern.nextOccurrence': { $lte: new Date() } },
              { 'recurrencePattern.nextOccurrence': { $lte: twoDaysFromNow } },
          ],
      });

      for (const transaction of recurringTransactions) {
          const user = await User.findById(transaction.user);
          if (!user) continue;

          const { nextOccurrence, endDate, frequency } = transaction.recurrencePattern;

          if (nextOccurrence < new Date()) {
              await Notification.create({
                  user: user._id,
                  message: `You missed a recurring transaction: ${transaction.description}`,
                  type: 'transaction',
              });
          }

          if (nextOccurrence > new Date() && nextOccurrence <= twoDaysFromNow) {
              await Notification.create({
                  user: user._id,
                  message: `Upcoming recurring transaction: ${transaction.description} on ${nextOccurrence.toDateString()}`,
                  type: 'transaction',
              });
          }

          let newNextOccurrence = calculateNextOccurrence(nextOccurrence, frequency);

          if (endDate && newNextOccurrence > endDate) {
              transaction.isRecurring = false;
              await transaction.save();

              await Notification.create({
                  user: user._id,
                  message: `Recurring transaction "${transaction.description}" has ended.`,
                  type: 'transaction',
              });
          } else {
              transaction.recurrencePattern.nextOccurrence = newNextOccurrence;
              await transaction.save();
          }

          console.log(`Sending email to: ${user.email}`); // Log the recipient email
            await sendNotification(user.email, `Upcoming recurring transaction: ${transaction.description} on ${newNextOccurrence.toDateString()}`, user._id);
      }

      res.json({ message: 'Cron job logic executed successfully.' });
  } catch (error) {
      console.error('Error testing cron job:', error);
      res.status(500).json({ error: 'Error testing cron job' });
  }
});

router.get('/testcronbill', async (req, res) => {
  try {
    const currentDate = new Date();
    const twoDaysFromNow = new Date(currentDate.setDate(currentDate.getDate() + 2));

    // Check for due bills
    const bills = await Transaction.find({
      type: 'expense',
      category: 'bill',
      date: { $lte: twoDaysFromNow }, // Bills due within the next 2 days
    });

    for (const bill of bills) {
      const user = await User.findById(bill.user);
      if (!user) continue;

      const daysLeft = Math.ceil((new Date(bill.date) - new Date()) / (1000 * 60 * 60 * 24));
      if (daysLeft <= 3) { // Notify if bill is due in 3 days
        await Notification.create({
          user: user._id,
          message: `Your bill "${bill.description}" is due in ${daysLeft} days.`,
          type: 'bill',
        });

        // Send email notification
        await sendNotification(
          user.email,
          `Reminder: Your bill "${bill.description}" is due in ${daysLeft} days.`,
          user._id
        );
      }
    }

    res.json({ message: 'Cron job logic executed successfully.' });
  } catch (error) {
    console.error('Error testing cron job:', error);
    res.status(500).json({ error: 'Error testing cron job' });
  }
});

router.get('/test-cron-all', async (req, res) => {
  try {
    const currentDate = new Date();
    const twoDaysFromNow = new Date(currentDate.setDate(currentDate.getDate() + 2));
    const sevenDaysFromNow = new Date(currentDate.setDate(currentDate.getDate() + 7));

    // Fetch all users
    const users = await User.find({});

    for (const user of users) {
      const userId = user._id;

      // Task 1: Upcoming or Missed Recurring Transactions
      const recurringTransactions = await Transaction.find({
        user: userId,
        isRecurring: true,
        'recurrencePattern.nextOccurrence': { $lte: twoDaysFromNow },
      });

      for (const transaction of recurringTransactions) {
        const { nextOccurrence, endDate, frequency } = transaction.recurrencePattern;

        if (nextOccurrence < new Date()) {
          await Notification.create({
            user: userId,
            message: `You missed a recurring transaction: ${transaction.description}`,
            type: 'transaction',
          });
        } else {
          await Notification.create({
            user: userId,
            message: `Upcoming recurring transaction: ${transaction.description} on ${nextOccurrence.toDateString()}`,
            type: 'transaction',
          });
        }

        let newNextOccurrence = calculateNextOccurrence(nextOccurrence, frequency);

        if (endDate && newNextOccurrence > endDate) {
          transaction.isRecurring = false;
        } else {
          transaction.recurrencePattern.nextOccurrence = newNextOccurrence;
        }

        await transaction.save();

        // Send email notification
        await sendNotification(
          user.email,
          `Upcoming recurring transaction: ${transaction.description} on ${newNextOccurrence.toDateString()}`,
          userId
        );
      }

      // Task 2: Notify Users About Unusual Spending Patterns
      const budgets = await Budget.find({ user: userId });

      for (const budget of budgets) {
        const totalSpent = budget.spendings.reduce((sum, spending) => sum + spending.spent, 0);
        if (totalSpent > budget.amount * 0.8) { // Notify if 80% of the budget is spent
          await Notification.create({
            user: userId,
            message: `You have spent ${((totalSpent / budget.amount) * 100).toFixed(2)}% of your ${budget.budgetName} budget.`,
            type: 'budget',
          });

          // Send email notification
          await sendNotification(
            user.email,
            `Warning: You have spent ${((totalSpent / budget.amount) * 100).toFixed(2)}% of your ${budget.budgetName} budget.`,
            userId
          );
        }
      }

      // Task 3: Send Reminders for Bill Payments
      const bills = await Transaction.find({ user: userId, type: 'expense', category: 'bill' });

      for (const bill of bills) {
        const daysLeft = Math.ceil((new Date(bill.date) - new Date()) / (1000 * 60 * 60 * 24));
        if (daysLeft <= 3) { // Notify if bill is due in 3 days
          await Notification.create({
            user: userId,
            message: `Your bill "${bill.description}" is due in ${daysLeft} days.`,
            type: 'bill',
          });

          // Send email notification
          await sendNotification(
            user.email,
            `Reminder: Your bill "${bill.description}" is due in ${daysLeft} days.`,
            userId
          );
        }
      }

      // Task 4: Send Reminders for Upcoming Financial Goals
      const goals = await Goal.find({ userId });

      for (const goal of goals) {
        const daysLeft = Math.ceil((new Date(goal.deadline) - new Date()) / (1000 * 60 * 60 * 24));
        if (daysLeft <= 7) { // Notify if goal deadline is within 7 days
          await Notification.create({
            user: userId,
            message: `Your financial goal "${goal.title}" is due in ${daysLeft} days.`,
            type: 'goal',
          });

          // Send email notification
          await sendNotification(
            user.email,
            `Reminder: Your financial goal "${goal.title}" is due in ${daysLeft} days.`,
            userId
          );
        }
      }
    }

    res.json({ message: 'Cron job logic executed successfully.' });
  } catch (error) {
    console.error('Error testing cron job:', error);
    res.status(500).json({ error: 'Error testing cron job' });
  }
});

// Helper function to calculate the next occurrence date
function calculateNextOccurrence(currentDate, frequency) {
  let nextOccurrence = new Date(currentDate);
  switch (frequency) {
    case 'daily':
      nextOccurrence.setDate(nextOccurrence.getDate() + 1);
      break;
    case 'weekly':
      nextOccurrence.setDate(nextOccurrence.getDate() + 7);
      break;
    case 'monthly':
      nextOccurrence.setMonth(nextOccurrence.getMonth() + 1);
      break;
    case 'yearly':
      nextOccurrence.setFullYear(nextOccurrence.getFullYear() + 1);
      break;
  }
  return nextOccurrence;
}

module.exports = router;
