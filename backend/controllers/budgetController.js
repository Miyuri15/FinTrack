const BudgetService = require('../services/budgetService');

class BudgetController {
    static async createBudget(req, res) {
        try {
            const budget = await BudgetService.createBudget(req.user.id, req.body);
            res.status(201).json(budget);
        } catch (error) {
            res.status(500).json({ error: 'Error creating budget' });
        }
    }

    static async getBudgets(req, res) {
        try {
            const budgets = await BudgetService.getBudgets(req.user.id);
            res.json(budgets);
        } catch (error) {
            res.status(500).json({ error: 'Error fetching budgets' });
        }
    }

    static async updateBudget(req, res) {
        try {
            const budget = await BudgetService.updateBudget(req.params.id, req.body);
            res.json(budget);
        } catch (error) {
            res.status(500).json({ error: 'Error updating budget' });
        }
    }

    static async deleteBudget(req, res) {
        try {
            await BudgetService.deleteBudget(req.params.id);
            res.json({ message: 'Budget deleted' });
        } catch (error) {
            res.status(500).json({ error: 'Error deleting budget' });
        }
    }
}

module.exports = BudgetController;