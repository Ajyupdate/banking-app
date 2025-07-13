const request = require('supertest');
const app = require('../app');
const db = require('../config/database');
const AuthService = require('../services/authService');

describe('Accounts API', () => {
  let authToken;

  beforeAll(async () => {
    // Run migrations and seeds for test database
    await db.migrate.latest();
    await db.seed.run();

    // Login to get token
    const { token } = await AuthService.login('admin@example.com', 'password123');
    authToken = token;
  });

  afterAll(async () => {
    // Destroy database connection
    await db.destroy();
  });

  describe('POST /api/accounts', () => {
    it('should create a new account for authenticated user', async () => {
      const res = await request(app)
        .post('/api/accounts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          currency: 'NGN'
        });

      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body.data).toHaveProperty('account_number');
      expect(res.body.data).toHaveProperty('balance', '0.0000');
    });
  });

  describe('GET /api/accounts', () => {
    it('should get all accounts for authenticated user', async () => {
      const res = await request(app)
        .get('/api/accounts')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body.data).toBeInstanceOf(Array);
      expect(res.body.data.length).toBeGreaterThan(0);
    });
  });
});