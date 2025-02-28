const cron = require('node-cron');
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const { sendNotification } = require('../utils/notification');
const processRecurringTransactions = require('../scripts/recurringTransactions');

// Schedule a job to run daily at midnight
cron.schedule('0 0 * * *', async () => {
    processRecurringTransactions();
    try {
        const recurringTransactions = await Transaction.find({ 
            isRecurring: true, 
            'recurrencePattern.nextOccurrence': { $lte: new Date(new Date().setDate(new Date().getDate() + 2)) } // Check for transactions due in the next 2 days
        });

        for (const transaction of recurringTransactions) {
            const user = await User.findById(transaction.user);
            if (!user) continue;

            // Check if the transaction is missed
            if (transaction.recurrencePattern.nextOccurrence < new Date()) {
                await Notification.create({
                    user: user._id,
                    message: `You missed a recurring transaction: ${transaction.description}`
                });
            } else {
                // Notify user about the upcoming transaction
                await Notification.create({
                    user: user._id,
                    message: `Upcoming recurring transaction: ${transaction.description} on ${transaction.recurrencePattern.nextOccurrence.toDateString()}`
                });
            }

            // Determine the next occurrence date
            const { frequency, endDate } = transaction.recurrencePattern;
            let nextOccurrence = new Date(transaction.recurrencePattern.nextOccurrence);

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

            if (endDate && nextOccurrence > endDate) {
                // Stop recurring if end date is reached
                transaction.isRecurring = false;
                await transaction.save();
            } else {
                transaction.recurrencePattern.nextOccurrence = nextOccurrence;
                await transaction.save();

                // Create a new transaction
                const newTransaction = new Transaction({
                    user: transaction.user,
                    type: transaction.type,
                    amount: transaction.amount,
                    category: transaction.category,
                    tags: transaction.tags,
                    description: transaction.description,
                    isRecurring: true,
                    recurrencePattern: {
                        ...transaction.recurrencePattern,
                        nextOccurrence: nextOccurrence, // Updated next occurrence
                    }
                });

                await newTransaction.save();

                // Notify user about the upcoming transaction
                await sendNotification(user.email, `Upcoming recurring transaction: ${transaction.description} on ${nextOccurrence.toDateString()}`, user._id);
            }
        }
    } catch (error) {
        console.error('Error processing recurring transactions:', error);
    }
});





