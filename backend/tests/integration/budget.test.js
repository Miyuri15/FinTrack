const request = require('supertest');
const app = require('../../index');
const Budget = require('../../models/Budget');
const User = require('../../models/User');
const jwt = require('jsonwebtoken');

describe('Budget API Integration Tests', () => {
    let token;
    let userId;

    beforeAll(async () => {
        jest.setTimeout(90000); // Increase timeout

        // Create a test user
        const user = new User({
            firstName: 'Test',
            lastName: 'User',
            contactNumber:'0786643663',
            email: 'test@example.com',
            password: 'password123',
        });
        await user.save();
        userId = user._id;

        // Generate a JWT token for authentication
        token = jwt.sign({ id: user._id, role: 'user' }, process.env.JWT_SECRET, { expiresIn: '1h' });
    });

    afterAll(async () => {
        jest.setTimeout(30000); // Increase timeout

        // Clean up the database after tests
        await User.deleteMany({});
        await Budget.deleteMany({});
        await mongoose.connection.close(); // Close the Mongoose connection
    });

    it('should create a new budget', async () => {
        jest.setTimeout(30000); // Increase timeout

        const res = await request(app)
            .post('/api/budgets')
            .set('Authorization', `Bearer ${token}`)
            .send({
                month: '2023-10',
                budgetName: 'Test Budget',
                amount: 1000,
                endDate: '2023-10-31',
                spendings: [{ category: 'Food', amount: 500 }],
            });

        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('_id');
        expect(res.body.budgetName).toEqual('Test Budget');
    });

    it('should get all budgets for the user', async () => {
        jest.setTimeout(30000); // Increase timeout

        const res = await request(app)
            .get('/api/budgets')
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBeTruthy();
    });

    it('should update a budget', async () => {
        jest.setTimeout(30000); // Increase timeout

        const budget = new Budget({
            user: userId,
            month: '2023-10',
            budgetName: 'Test Budget',
            amount: 1000,
            endDate: '2023-10-31',
            spendings: [{ category: 'Food', amount: 500 }],
        });
        await budget.save();

        const res = await request(app)
            .put(`/api/budgets/${budget._id}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ budgetName: 'Updated Budget' });

        expect(res.statusCode).toEqual(200);
        expect(res.body.budgetName).toEqual('Updated Budget');
    });

    it('should delete a budget', async () => {
        jest.setTimeout(30000); // Increase timeout

        const budget = new Budget({
            user: userId,
            month: '2023-10',
            budgetName: 'Test Budget',
            amount: 1000,
            endDate: '2023-10-31',
            spendings: [{ category: 'Food', amount: 500 }],
        });
        await budget.save();

        const res = await request(app)
            .delete(`/api/budgets/${budget._id}`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body.message).toEqual('Budget deleted');
    });
});