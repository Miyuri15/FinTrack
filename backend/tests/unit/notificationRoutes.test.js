const jwt = require('jsonwebtoken');
const request = require('supertest');
const app = require('../../app');
const Notification = require('../../models/Notification');

// Mock a valid token
const mockToken = jwt.sign({ id: '123', role: 'user', username: 'testuser' }, process.env.JWT_SECRET);

describe('Notification Routes', () => {
  test('GET /notifications - Should fetch all notifications for a user', async () => {
    const res = await request(app)
      .get('/api/notifications')
      .set('Authorization', `Bearer ${mockToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
  });

  test('PUT /notifications/:id/read - Should mark a notification as read', async () => {
    const notification = await Notification.create({ user: new mongoose.Types.ObjectId(), message: 'Test Notification', type: 'transaction' });
    const res = await request(app)
      .put(`/api/notifications/${notification._id}/read`)
      .set('Authorization', `Bearer ${mockToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.read).toBe(true);
  });

  test('DELETE /notifications/:id - Should delete a notification', async () => {
    const notification = await Notification.create({ user: new mongoose.Types.ObjectId(), message: 'Test Notification', type: 'transaction' });
    const res = await request(app)
      .delete(`/api/notifications/${notification._id}`)
      .set('Authorization', `Bearer ${mockToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Notification deleted');
  });
});