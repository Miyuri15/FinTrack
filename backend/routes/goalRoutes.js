// routes/goalRoutes.js
const express = require("express");
const Goal = require("../models/Goal");
const authMiddleware = require('../middleware/authMiddleware');
const Notification = require("../models/Notification");
const { sendNotification } = require("../utils/notificationUtils");
const User = require("../models/User");
const router = express.Router();

// Create a new goal
router.post("/", authMiddleware, async (req, res) => {
  const { title, targetAmount, deadline } = req.body;
  try {
    const goal = new Goal({
      userId: req.user.id, // Use req.user.id from the auth middleware
      title,
      targetAmount,
      deadline,
    });
    await goal.save();
    res.status(201).json(goal);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all goals for a user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const goals = await Goal.find({ userId: req.user.id });
    res.json(goals);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Delete a goal
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const goal = await Goal.findByIdAndDelete(req.params.id);
    if (!goal) return res.status(404).json({ error: "Goal not found" });
    res.json({ message: "Goal deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.post("/allocate", authMiddleware, async (req, res) => {
    const { userId, allocation } = req.body;
    try {
      // Update each goal's savedAmount
      for (const item of allocation) {
        await Goal.findByIdAndUpdate(item.goalId, {
          $inc: { savedAmount: item.amount },
        });
      }
      res.status(200).json({ message: "Savings allocated successfully" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });


// Update a goal
router.patch("/:id", authMiddleware, async (req, res) => {
  const { title, targetAmount, deadline, savedAmount } = req.body;
  try {
    const goal = await Goal.findById(req.params.id);
    if (!goal) return res.status(404).json({ error: "Goal not found" });

    if (title) goal.title = title;
    if (targetAmount) goal.targetAmount = targetAmount;
    if (deadline) goal.deadline = deadline;
    if (savedAmount) goal.savedAmount = savedAmount;

    await goal.save();
    res.json(goal);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/testcrongoal', async (req, res) => {
  try {
    const currentDate = new Date();
    const sevenDaysFromNow = new Date(currentDate.setDate(currentDate.getDate() + 7));

    // Check for upcoming goals
    const goals = await Goal.find({
      deadline: { $lte: sevenDaysFromNow }, // Goals due within the next 7 days
    });

    for (const goal of goals) {
      const user = await User.findById(goal.userId);
      if (!user) continue;

      const daysLeft = Math.ceil((new Date(goal.deadline) - new Date()) / (1000 * 60 * 60 * 24));
      if (daysLeft <= 7) { // Notify if goal deadline is within 7 days
        await Notification.create({
          user: user._id,
          message: `Your financial goal "${goal.title}" is due in ${daysLeft} days.`,
          type: 'goal',
        });

        // Send email notification
        await sendNotification(
          user.email,
          `Reminder: Your financial goal "${goal.title}" is due in ${daysLeft} days.`,
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
module.exports = router;