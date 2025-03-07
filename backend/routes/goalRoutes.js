// routes/goalRoutes.js
const express = require("express");
const Goal = require("../models/Goal");
const authMiddleware = require('../middleware/authMiddleware');
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

module.exports = router;