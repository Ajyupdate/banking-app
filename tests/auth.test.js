const request = require('supertest');
const app = require('../app');
const db = require('../config/database');
const User = require('../models/User');

describe('Auth API', () => {
  beforeAll(async () => {
    // Run migrations and seeds for test database
    await db.migrate.latest();
    await db.seed.run();
  });

  afterAll(async () => {
    // Destroy database connection
    await db.destroy();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          phone: '08012345678',
          password: 'password123'
        });

      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body.data).toHaveProperty('email', 'john.doe@example.com');
      expect(res.body.data).not.toHaveProperty('password');
    });

    it('should return error for duplicate email', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          firstName: 'John',
          lastName: 'Doe',
          email: 'admin@example.com', // From seed
          phone: '08012345679',
          password: 'password123'
        });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('success', false);
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login with valid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'admin@example.com', // From seed
          password: 'password123' // From seed
        });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body.data).toHaveProperty('token');
      expect(res.body.data.user).toHaveProperty('email', 'admin@example.com');
    });

    it('should return error for invalid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'admin@example.com',
          password: 'wrongpassword'
        });

      expect(res.statusCode).toEqual(401);
      expect(res.body).toHaveProperty('success', false);
    });
  });
});