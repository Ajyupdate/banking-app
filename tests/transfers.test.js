const request = require('supertest');
const app = require('../app');
const db = require('../config/database');
const AuthService = require('../services/authService');
const Account = require('../models/Account');

describe('Transfers API', () => {
  let authToken;
  let testAccount;

  beforeAll(async () => {
    // Run migrations and seeds for test database
    await db.migrate.latest();
    await db.seed.run();

    // Login to get token
    const { token } = await AuthService.login('admin@example.com', 'password123');
    authToken = token;

    // Get test account
    testAccount = await Account.findByAccountNumber('1234567890'); // From seed
  });

  afterAll(async () => {
    // Destroy database connection
    await db.destroy();
  });

  describe('GET /api/transfers/banks', () => {
    it('should get list of banks', async () => {
      const res = await request(app)
        .get('/api/transfers/banks')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body.data).toBeInstanceOf(Array);
    });
  });

  // Note: Actual transfer tests would require mocking the Raven Atlas API
});