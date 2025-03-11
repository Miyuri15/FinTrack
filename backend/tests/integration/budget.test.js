const request = require('supertest');
const app = require('../../index'); // Adjust the path as needed
const mongoose = require('mongoose');
const User = require('../../models/User'); // Adjust the path as needed
const Budget = require('../../models/Budget'); // Adjust the path as needed

let token;

beforeEach(async () => {
  // Clear the users collection before each test to avoid duplicate email issues
  await User.deleteMany({});
  
  // Create a new user to log in and get a token for subsequent requests
  const user = await User.create({
    email: `ruvinda@gmail.com`,  // Using a unique email
    password: 'Ruvinda123@',
  });

  // Get the token after logging in
  const loginResponse = await request(app)
    .post('/login')
    .send({ email: user.email, password: 'Ruvinda123@' });

  // Store the token for future requests
  token = loginResponse.body.token;
  
  // Check if the token is valid, if not throw an error
  if (!token) {
    console.error('Token not generated. Please check the login route.');
  }
});

afterEach(async () => {
  // Clean up the database after each test
  await User.deleteMany({});
  await Budget.deleteMany({});
});

describe('Budget Routes', () => {
  // Test case to create a new budget
  it('Should create a new budget', async () => {
    const newBudget = {
      budgetName: 'Test Budget',
      amount: 1000,
    };

    const response = await request(app)
      .post('/budget')
      .set('Authorization', `Bearer ${token}`)
      .send(newBudget);

    expect(response.status).toBe(201);
    expect(response.body.budgetName).toBe(newBudget.budgetName);
    expect(response.body.amount).toBe(newBudget.amount);
  });

  // Test case to fetch all budgets for a user
  it('Should fetch all budgets for a user', async () => {
    const response = await request(app)
      .get('/budget')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  // Test case to update a budget
  it('Should update a budget', async () => {
    const newBudget = {
      budgetName: 'Test Budget',
      amount: 1000,
    };

    // Create the budget
    const createdBudget = await request(app)
      .post('/budget')
      .set('Authorization', `Bearer ${token}`)
      .send(newBudget);

    const updatedBudget = {
      budgetName: 'Updated Budget',
      amount: 1200,
    };

    const response = await request(app)
      .put(`/budget/${createdBudget.body._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updatedBudget);

    expect(response.status).toBe(200);
    expect(response.body.budgetName).toBe(updatedBudget.budgetName);
    expect(response.body.amount).toBe(updatedBudget.amount);
  });

  // Test case to delete a budget
  it('Should delete a budget', async () => {
    const newBudget = {
      budgetName: 'Test Budget',
      amount: 1000,
    };

    // Create the budget
    const createdBudget = await request(app)
      .post('/budget')
      .set('Authorization', `Bearer ${token}`)
      .send(newBudget);

    const response = await request(app)
      .delete(`/budget/${createdBudget.body._id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Budget deleted successfully');
  });
});
