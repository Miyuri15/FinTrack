const request = require('supertest');
const app = require('../../index');
const Transaction = require('../../models/Transaction');
const User = require('../../models/User');
const jwt = require('jsonwebtoken');

describe('Transaction API Integration Tests', () => {
    let token;
    let userId;

    beforeAll(async () => {
        jest.setTimeout(90000); // Increase timeout

        // Create a test user
        const user = new User({
            firstName: 'Test',
            lastName: 'User',
            email: 'test@example.com',
            password: 'password123',
        });
        await user.save();
        userId = user._id;

        // Generate a JWT token for authentication
        token = jwt.sign({ id: user._id, role: 'user' }, process.env.JWT_SECRET, { expiresIn: '1h' });
    });

    afterAll(async () => {
        jest.setTimeout(90000); // Increase timeout
        await User.deleteMany({});
        await Transaction.deleteMany({});
        await mongoose.connection.close(); // Close the Mongoose connection
    });

    it('should create a new transaction', async () => {
        const res = await request(app)
            .post('/api/transactions')
            .set('Authorization', `Bearer ${token}`)
            .send({
                type: 'expense',
                amount: 100,
                currency: 'USD',
                category: 'Food',
                description: 'Groceries',
            });

        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('_id');
        expect(res.body.description).toEqual('Groceries');
    });

    it('should get all transactions for the user', async () => {
        const res = await request(app)
            .get('/api/transactions')
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBeTruthy();
    });

    it('should update a transaction', async () => {
        const transaction = new Transaction({
            user: userId,
            type: 'expense',
            amount: 100,
            currency: 'USD',
            category: 'Food',
            description: 'Groceries',
        });
        await transaction.save();

        const res = await request(app)
            .put(`/api/transactions/${transaction._id}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ description: 'Updated Groceries' });

        expect(res.statusCode).toEqual(200);
        expect(res.body.description).toEqual('Updated Groceries');
    });

    it('should delete a transaction', async () => {
        const transaction = new Transaction({
            user: userId,
            type: 'expense',
            amount: 100,
            currency: 'USD',
            category: 'Food',
            description: 'Groceries',
        });
        await transaction.save();

        const res = await request(app)
            .delete(`/api/transactions/${transaction._id}`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body.message).toEqual('Transaction deleted');
    });
});