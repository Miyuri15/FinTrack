const nodemailer = require('nodemailer');
const Notification = require('../models/Notification');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD  
    }
});

const sendNotification = async (userEmail, message, userId) => {
    if (!userEmail || !message) {
        throw new Error('Missing required parameters: userEmail and message');
    }

    const mailOptions = {
        from: 'noreply@fintrack.com',
        to: userEmail,
        subject: 'FinTrack Notification',
        text: message
    };

    try {
        // Send the email
        await transporter.sendMail(mailOptions);

        // Save the notification to the database
        if (userId) {
            const notification = new Notification({
                user: userId,
                message: message
            });
            await notification.save();
        }

        console.log(`Notification sent to ${userEmail} and saved to database.`);
    } catch (error) {
        console.error('Failed to send email or save notification:', error);
        throw error; // Re-throw the error to handle it in the route
    }
};

module.exports = { sendNotification };


