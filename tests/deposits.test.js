const request = require('supertest');
const app = require('../app');
const db = require('../config/database');
const AuthService = require('../services/authService');
const Account = require('../models/Account');

describe('Deposits API', () => {
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

  describe('POST /api/deposits/webhook', () => {
    it('should process deposit webhook', async () => {
      const res = await request(app)
        .post('/api/deposits/webhook')
        .set('x-webhook-secret', process.env.WEBHOOK_SECRET)
        .send({
          reference: 'TEST123',
          amount: 100.00,
          account_number: '1234567890',
          sender_name: 'Test Sender',
          sender_account: '9876543210',
          sender_bank: 'Test Bank'
        });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('success', true);
    });
  });

  describe('GET /api/deposits/account/:accountId', () => {
    it('should get deposits for an account', async () => {
      const res = await request(app)
        .get(`/api/deposits/account/${testAccount.id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body.data).toBeInstanceOf(Array);
    });
  });
});