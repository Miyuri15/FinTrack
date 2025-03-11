const request = require('supertest');
const app = require('../../index');
const User = require('../../models/User');
const jwt = require('jsonwebtoken');

describe('User API Integration Tests', () => {
    let token;

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

        // Generate a JWT token for authentication
        token = jwt.sign({ id: user._id, role: 'user' }, process.env.JWT_SECRET, { expiresIn: '1h' });
    });

    afterAll(async () => {
        jest.setTimeout(90000); // Increase timeout
        await User.deleteMany({});
        await mongoose.connection.close(); // Close the Mongoose connection
    });

    it('should register a new user', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                password: 'password123',
            });

        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('user');
        expect(res.body).toHaveProperty('token');
    });

    it('should login an existing user', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'test@example.com',
                password: 'password123',
            });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('user');
        expect(res.body).toHaveProperty('token');
    });

    it('should get all users', async () => {
        const res = await request(app)
            .get('/api/auth/all')
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBeTruthy();
    });

    it('should restrict a user', async () => {
        const user = await User.findOne({ email: 'test@example.com' });

        const res = await request(app)
            .put(`/api/auth/${user._id}/restrict`)
            .set('Authorization', `Bearer ${token}`)
            .send({ isRestricted: true });

        expect(res.statusCode).toEqual(200);
        expect(res.body.isRestricted).toBe(true);
    });
});