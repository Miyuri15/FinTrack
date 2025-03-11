const request = require('supertest');
const app = require('../../index');
const Transaction = require('../../models/Transaction');
const User = require('../../models/User');
const jwt = require('jsonwebtoken');

describe('TransactionController', () => {
    let token;
    let userId;

    beforeAll(async () => {
        // Create a test user
        const user = new User({
            firstName: 'Test',
            lastName: 'User',
            contactNumber:'0112884655',
            email: 'test@example.com',
            password: 'password123',
        });
        await user.save();
        userId = user._id;

        // Generate a JWT token for the test user
        token = jwt.sign({ id: userId, role: 'user' }, process.env.JWT_SECRET, { expiresIn: '1h' });
    },8000);

    afterAll(async () => {
        await User.deleteMany({});
        await Transaction.deleteMany({});
    });

    it('should create a transaction', async () => {
        const res = await request(app)
            .post('/api/transactions')
            .set('Authorization', `Bearer ${token}`)
            .send({
                type: 'income',
                amount: 1000,
                currency: 'USD',
                category: 'Salary',
                description: 'Monthly Salary',
            });

        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('description', 'Monthly Salary');
    });

    it('should get all transactions for a user', async () => {
        const res = await request(app)
            .get('/api/transactions')
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body).toBeInstanceOf(Array);
    });

    it('should update a transaction', async () => {
        const transaction = new Transaction({
            user: userId,
            type: 'income',
            amount: 1000,
            currency: 'USD',
            category: 'Salary',
            description: 'Monthly Salary',
        });
        await transaction.save();

        const res = await request(app)
            .put(`/api/transactions/${transaction._id}`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                amount: 1500,
            });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('amount', 1500);
    });

    it('should delete a transaction', async () => {
        const transaction = new Transaction({
            user: userId,
            type: 'income',
            amount: 1000,
            currency: 'USD',
            category: 'Salary',
            description: 'Monthly Salary',
        });
        await transaction.save();

        const res = await request(app)
            .delete(`/api/transactions/${transaction._id}`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('message', 'Transaction deleted');
    });
});