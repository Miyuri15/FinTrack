const express = require('express');
const Budget = require('../models/Budget');
const authMiddleware = require('../middleware/authMiddleware');
const Transaction = require("../models/Transaction");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
const Recommendation = require("../models/Recommendation");

// Create a new budget
router.post('/', authMiddleware, async (req, res) => {
  const { month, budgetName, amount, endDate, spendings } = req.body;
  try {
    const budget = new Budget({
      user: req.user.id,
      month,
      budgetName,
      amount,
      endDate,
      spendings: spendings.map((spending) => ({
        category: spending.category,
        amount: spending.amount,
        spent: 0, // Initialize spent amount to 0
      })),
    });
    await budget.save();
    res.status(201).json(budget);
  } catch (error) {
    res.status(500).json({ error: 'Error creating budget' });
  }
});

// Get budgets for logged-in user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const budgets = await Budget.find({ user: req.user.id });
    const budgetsWithAlerts = budgets.map((budget) => {
      const totalSpent = budget.spendings.reduce((sum, spending) => sum + spending.spent, 0);
      const exceededAmount = totalSpent > budget.amount ? totalSpent - budget.amount : 0;
      return {
        ...budget.toObject(),
        exceededAmount,
      };
    });
    res.json(budgetsWithAlerts);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching budgets' });
  }
});

// Get all budgets (Admin Only)
router.get('/all', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admins only.' });
    }

    const budgets = await Budget.find({}).populate('user', 'username email');
    res.json(budgets);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching budgets' });
  }
});

// Update a budget
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const budget = await Budget.findByIdAndUpdate(
      req.params.id,
      req.body, // Update with the entire request body
      { new: true } // Return the updated budget
    );
    res.json(budget);
  } catch (error) {
    res.status(500).json({ error: 'Error updating budget' });
  }
});

// Delete a budget
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await Budget.findByIdAndDelete(req.params.id);
    res.json({ message: 'Budget deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting budget' });
  }
});

// Add or update spending for a budget
router.put('/:id/spendings/:spendingId', authMiddleware, async (req, res) => {
  const { spentAmount } = req.body;
  try {
    const budget = await Budget.findById(req.params.id);
    if (!budget) {
      return res.status(404).json({ error: 'Budget not found' });
    }

    // Find the spending category to update
    const spendingIndex = budget.spendings.findIndex(
      (spending) => spending._id.toString() === req.params.spendingId
    );

    if (spendingIndex === -1) {
      return res.status(404).json({ error: 'Spending category not found' });
    }

    // Update the spent amount
    budget.spendings[spendingIndex].spent = spentAmount;

    await budget.save();
    res.json(budget);
  } catch (error) {
    res.status(500).json({ error: 'Error updating spending' });
  }
});

// Delete a spending category
router.delete('/:id/spendings/:spendingId', authMiddleware, async (req, res) => {
  try {
    const budget = await Budget.findById(req.params.id);
    if (!budget) {
      return res.status(404).json({ error: 'Budget not found' });
    }

    // Remove the spending category
    budget.spendings = budget.spendings.filter(
      (spending) => spending._id.toString() !== req.params.spendingId
    );

    await budget.save();
    res.json(budget);
  } catch (error) {
    res.status(500).json({ error: 'Error deleting spending category' });
  }
});

// Route to get count of budgets for the logged-in user
router.get('/count', authMiddleware, async (req, res) => {
  try {
    const count = await Budget.countDocuments({ user: req.user.id });
    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching budget count' });
  }
});

// Function to analyze spending trends (without transactions)
const analyzeSpendingTrends = async (budgets) => {
  const recommendations = [];

  budgets.forEach((budget) => {
    const { month, spendings, amount: totalBudget } = budget;
    const totalSpent = spendings.reduce((sum, spending) => sum + spending.spent, 0);
    const percentageUsed = (totalSpent / totalBudget) * 100;

    if (percentageUsed > 100) {
      recommendations.push({
        id: uuidv4(),
        month,
        message: `In ${month}, you exceeded your total budget by ${(percentageUsed - 100).toFixed(2)}%. Consider reducing your spending.`,
      });
    } else if (percentageUsed < 80) {
      recommendations.push({
        id: uuidv4(),
        month,
        message: `In ${month}, you used only ${percentageUsed.toFixed(2)}% of your total budget. Consider reallocating funds to other categories.`,
      });
    }

    spendings.forEach((spending) => {
      const { category, amount: categoryBudget, spent } = spending;
      const categoryPercentageUsed = (spent / categoryBudget) * 100;

      if (categoryPercentageUsed > 100) {
        recommendations.push({
          id: uuidv4(),
          category,
          month,
          message: `In ${month}, you exceeded your ${category} budget by ${(categoryPercentageUsed - 100).toFixed(2)}%. Consider reducing spending in this category.`,
        });
      } else if (categoryPercentageUsed < 80) {
        recommendations.push({
          id: uuidv4(),
          category,
          month,
          message: `In ${month}, you used only ${categoryPercentageUsed.toFixed(2)}% of your ${category} budget. Consider reallocating funds to other categories.`,
        });
      }
    });
  });

  // Save recommendations to the DB
  await Recommendation.insertMany(recommendations);
  return recommendations;
};

// Route to save recommendations to the DB
router.post("/recommendations", authMiddleware, async (req, res) => {
  try {
    const { recommendations } = req.body;

    // Save each recommendation
    const savedRecommendations = await Recommendation.insertMany(recommendations);

    res.status(201).json({ message: "Recommendations saved successfully", data: savedRecommendations });
  } catch (error) {
    console.error("Error saving recommendations:", error);
    res.status(500).json({ message: "Failed to save recommendations" });
  }
});


// Route to get budget recommendations
router.get("/recommendations", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const budgets = await Budget.find({ user: userId });

    console.log("Fetched Budgets:", JSON.stringify(budgets, null, 2));

    // Analyze and store recommendations
    await analyzeSpendingTrends(budgets);

    // Fetch recommendations from DB
    const recommendations = await Recommendation.find({});
    res.json(recommendations);
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    res.status(500).json({ message: "Failed to fetch recommendations" });
  }
});

// Route to delete a recommendation
router.delete("/recommendations/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    await Recommendation.findOneAndDelete({ id });

    res.json({ message: "Recommendation deleted successfully" });
  } catch (error) {
    console.error("Error deleting recommendation:", error);
    res.status(500).json({ message: "Failed to delete recommendation" });
  }
});


module.exports = router;