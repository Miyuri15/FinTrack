const cron = require('node-cron');
const Transaction = require('../models/Transaction');
const Notification = require('../models/Notification');
const Budget = require('../models/Budget');
const Goal = require('../models/Goal');
const User = require('../models/User');
const { sendNotification } = require('../utils/notificationUtils');

// Task 1: Upcoming or Missed Recurring Transactions
cron.schedule('* * * * *', async () => {
  try {
    const recurringTransactions = await Transaction.find({
      isRecurring: true,
      'recurrencePattern.nextOccurrence': { $lte: new Date(new Date().setDate(new Date().getDate() + 2)) },
    });

    for (const transaction of recurringTransactions) {
      const user = await User.findById(transaction.user);
      if (!user) continue;

      if (transaction.recurrencePattern.nextOccurrence < new Date()) {
        await Notification.create({
          user: user._id,
          message: `You missed a recurring transaction: ${transaction.description}`,
          type: 'transaction',
        });
      } else {
        await Notification.create({
          user: user._id,
          message: `Upcoming recurring transaction: ${transaction.description} on ${transaction.recurrencePattern.nextOccurrence.toDateString()}`,
          type: 'transaction',
        });
      }

      const { frequency, endDate } = transaction.recurrencePattern;
      let nextOccurrence = calculateNextOccurrence(transaction.recurrencePattern.nextOccurrence, frequency);

      if (endDate && nextOccurrence > endDate) {
        transaction.isRecurring = false;
      } else {
        transaction.recurrencePattern.nextOccurrence = nextOccurrence;
      }

      await transaction.save();

      // Send email notification
      await sendNotification(
        user.email,
        `Upcoming recurring transaction: ${transaction.description} on ${nextOccurrence.toDateString()}`,
        user._id
      );
    }
  } catch (error) {
    console.error('Error processing recurring transactions:', error);
  }
});

// Task 2: Notify Users About Unusual Spending Patterns
const analyzeSpending = async (userId) => {
  try {
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
        const user = await User.findById(userId);
        if (user) {
          await sendNotification(
            user.email,
            `Warning: You have spent ${((totalSpent / budget.amount) * 100).toFixed(2)}% of your ${budget.budgetName} budget.`,
            userId
          );
        }
      }
    }
  } catch (error) {
    console.error('Error analyzing spending patterns:', error);
  }
};

// Task 3: Send Reminders for Bill Payments
const checkBillPayments = async (userId) => {
  try {
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
        const user = await User.findById(userId);
        if (user) {
          await sendNotification(
            user.email,
            `Reminder: Your bill "${bill.description}" is due in ${daysLeft} days.`,
            userId
          );
        }
      }
    }
  } catch (error) {
    console.error('Error checking bill payments:', error);
  }
};

// Task 4: Send Reminders for Upcoming Financial Goals
const checkFinancialGoals = async (userId) => {
  try {
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
        const user = await User.findById(userId);
        if (user) {
          await sendNotification(
            user.email,
            `Reminder: Your financial goal "${goal.title}" is due in ${daysLeft} days.`,
            userId
          );
        }
      }
    }
  } catch (error) {
    console.error('Error checking financial goals:', error);
  }
};

// Schedule all tasks to run daily at midnight
cron.schedule('0 0 * * *', async () => {
  const users = await User.find({});
  for (const user of users) {
    await analyzeSpending(user._id); // Check for unusual spending
    await checkBillPayments(user._id); // Check for bill payments
    await checkFinancialGoals(user._id); // Check for financial goals
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