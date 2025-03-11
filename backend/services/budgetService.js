const Budget = require('../models/Budget');

class BudgetService {
    static async createBudget(userId, budgetData) {
        const budget = new Budget({ user: userId, ...budgetData });
        await budget.save();
        return budget;
    }

    static async getBudgets(userId) {
        return await Budget.find({ user: userId });
    }

    static async updateBudget(budgetId, updateData) {
        return await Budget.findByIdAndUpdate(budgetId, updateData, { new: true });
    }

    static async deleteBudget(budgetId) {
        return await Budget.findByIdAndDelete(budgetId);
    }
}

module.exports = BudgetService;