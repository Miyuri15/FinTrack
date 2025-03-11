const jwt = require('jsonwebtoken');
const request = require('supertest');
const app = require('../../app');
const Transaction = require('../../models/Transaction');

// Mock a valid token
const mockToken = jwt.sign({ id: '123', role: 'user', username: 'testuser' }, process.env.JWT_SECRET);

describe('Transaction Routes', () => {
  test('POST /transactions - Should create a new transaction', async () => {
    const res = await request(app)
      .post('/api/transactions')
      .set('Authorization', `Bearer ${mockToken}`)
      .send({ type: 'income', amount: 1000, currency: 'USD', category: 'Salary', description: 'Monthly Salary' });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('type', 'income');
  });

  test('GET /transactions - Should fetch all transactions for a user', async () => {
    const res = await request(app)
      .get('/api/transactions')
      .set('Authorization', `Bearer ${mockToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
  });

  test('DELETE /transactions/:id - Should delete a transaction', async () => {
    const transaction = await Transaction.create({ user: '123', type: 'expense', amount: 100, currency: 'USD', category: 'Food', description: 'Groceries' });
    const res = await request(app)
      .delete(`/api/transactions/${transaction._id}`)
      .set('Authorization', `Bearer ${mockToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Transaction deleted');
  });
});