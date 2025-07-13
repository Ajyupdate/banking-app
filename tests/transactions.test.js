const request = require('supertest');
const app = require('../app');
const db = require('../config/database');
const AuthService = require('../services/authService');

describe('Transactions API', () => {
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

  describe('GET /api/transactions', () => {
    it('should get transactions for authenticated user', async () => {
      const res = await request(app)
        .get('/api/transactions')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body.data).toBeInstanceOf(Array);
    });
  });

  describe('GET /api/transactions/type/:type', () => {
    it('should get transactions by type', async () => {
      const res = await request(app)
        .get('/api/transactions/type/deposit')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body.data).toBeInstanceOf(Array);
    });
  });
});