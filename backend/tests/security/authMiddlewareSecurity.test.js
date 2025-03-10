const jwt = require('jsonwebtoken');
const authMiddleware = require('../../middleware/authMiddleware');

jest.mock('jsonwebtoken');

describe('Auth Middleware Security', () => {
  test('Should not expose sensitive information in error messages', async () => {
    const req = { headers: { authorization: 'Bearer invalidtoken' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    jwt.verify.mockImplementationOnce(() => { throw new Error('Invalid token'); });
    authMiddleware(req, res, () => {});
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid token' });
    expect(res.json).not.toHaveBeenCalledWith(expect.objectContaining({ error: expect.any(String) }));
  });
});