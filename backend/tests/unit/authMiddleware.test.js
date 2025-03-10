const jwt = require('jsonwebtoken');
const authMiddleware = require('../../middleware/authMiddleware');

jest.mock('jsonwebtoken');

describe('Auth Middleware', () => {
  test('Should return 401 if no token is provided', () => {
    const req = { headers: {} };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    authMiddleware(req, res, () => {});
    expect(res.status).toHaveBeenCalledWith(401);
  });

  test('Should attach user to request if token is valid', () => {
    const req = { headers: { authorization: 'Bearer validtoken' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();
    jwt.verify.mockReturnValueOnce({ id: '123', role: 'user', username: 'testuser' });
    authMiddleware(req, res, next);
    expect(req.user).toEqual({ id: '123', role: 'user', username: 'testuser' });
    expect(next).toHaveBeenCalled();
  });
});