const jwt = require('jsonwebtoken');
const request = require('supertest');
const app = require('../../app');
const User = require('../../models/User');

// Mock a valid token
const mockToken = jwt.sign({ id: '123', role: 'admin', username: 'adminuser' }, process.env.JWT_SECRET);

describe('User Routes', () => {
  test('POST /users/register - Should register a new user', async () => {
    const res = await request(app)
      .post('/api/users/register')
      .send({ firstName: 'Jane', lastName: 'Doe', email: 'jane.doe@example.com', contactNumber: '0987654321', password: 'password123', confirmPassword: 'password123' });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('token');
  });

  test('POST /users/login - Should login a user', async () => {
    await User.create({ firstName: 'Jane', lastName: 'Doe', email: 'jane.doe@example.com', contactNumber: '0987654321', password: 'password123', role: 'user' });
    const res = await request(app)
      .post('/api/users/login')
      .send({ email: 'jane.doe@example.com', password: 'password123' });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  test('GET /users/all - Should fetch all users (Admin Only)', async () => {
    const res = await request(app)
      .get('/api/users/all')
      .set('Authorization', `Bearer ${mockToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
  });
});