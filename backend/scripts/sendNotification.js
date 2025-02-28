const { sendNotification } = require("../utils/notification");

(async () => {
    try {
        await sendNotification('test@example.com', 'This is a test notification', '12345');
        console.log('Notification test succeeded.');
    } catch (error) {
        console.error('Notification test failed:', error);
    }
})();