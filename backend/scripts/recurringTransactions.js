const Transaction = require('../models/Transaction');
const User = require('../models/User');

const processRecurringTransactions = async () => {
    try {
        const recurringTransactions = await Transaction.find({
            isRecurring: true,
            'recurrencePattern.nextOccurrence': { $lte: new Date() }
        });

        for (const transaction of recurringTransactions) {
            const user = await User.findById(transaction.user);
            if (!user) continue;

            const message = `Upcoming recurring transaction: ${transaction.description} on ${transaction.recurrencePattern.nextOccurrence.toDateString()}`;

            // Send notification and save it to the database
            await sendNotification(user.email, message, user._id);

            console.log(`Notification sent to ${user.email}`);
        }
    } catch (error) {
        console.error('Error processing recurring transactions:', error);
    }
};

// Export the function for use in other files
module.exports = processRecurringTransactions;