const request = require('supertest');
const app = require('../../index');
const Currency = require('../../models/Currency');

describe('Currency Routes', () => {
  test('GET /currencies - Should fetch all currencies', async () => {
    const res = await request(app).get('/api/currencies');
    expect(res.statusCode).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
  });

  test('POST /currencies/add - Should add a new currency', async () => {
    const res = await request(app)
      .post('/api/currencies/add')
      .send({ code: 'EUR', name: 'Euro', exchangeRate: 0.85 });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('code', 'EUR');
  });

  test('PUT /currencies/:id - Should update a currency', async () => {
    const currency = await Currency.create({ code: 'GBP', name: 'British Pound', exchangeRate: 0.75 });
    const res = await request(app)
      .put(`/api/currencies/${currency._id}`)
      .send({ exchangeRate: 0.80 });
    expect(res.statusCode).toBe(200);
    expect(res.body.exchangeRate).toBe(0.80);
  });
});