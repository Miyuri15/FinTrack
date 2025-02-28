// testEmail.js

const { sendNotification } = require("../utils/notification");

const testEmail = 'miyurilokuhewage15@gmail.com'; // Replace with a real email address
const testMessage = 'This is a test notification from FinTrack.';

sendNotification(testEmail, testMessage)
    .then(() => console.log('Notification email sent successfully!'))
    .catch((error) => console.error('Failed to send email:', error));