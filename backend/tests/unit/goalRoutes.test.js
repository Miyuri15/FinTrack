const jwt = require('jsonwebtoken');
const request = require('supertest');
const app = require('../../app');
const Goal = require('../../models/Goal');

// Mock a valid token
const mockToken = jwt.sign({ id: '123', role: 'user', username: 'testuser' }, process.env.JWT_SECRET);

describe('Goal Routes', () => {
  test('POST /goals - Should create a new goal', async () => {
    const res = await request(app)
      .post('/api/goals')
      .set('Authorization', `Bearer ${mockToken}`)
      .send({ title: 'Save for Car', targetAmount: 10000, deadline: '2023-12-31' });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('title', 'Save for Car');
  });

  test('GET /goals - Should fetch all goals for a user', async () => {
    const res = await request(app)
      .get('/api/goals')
      .set('Authorization', `Bearer ${mockToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
  });

  test('DELETE /goals/:id - Should delete a goal', async () => {
    const goal = await Goal.create({ userId: '123', title: 'Save for House', targetAmount: 20000, deadline: new Date('2023-12-31') });
    const res = await request(app)
      .delete(`/api/goals/${goal._id}`)
      .set('Authorization', `Bearer ${mockToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Goal deleted');
  });
});