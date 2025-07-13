exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('transactions').del();
  await knex('transfers').del();
  await knex('deposits').del();
  await knex('accounts').del();
  await knex('users').del();

  // Inserts seed entries
  await knex('users').insert([
    {
      id: '11111111-1111-1111-1111-111111111111',
      first_name: 'Admin',
      last_name: 'User',
      email: 'admin@example.com',
      phone: '08012345678',
      password: '$2a$10$X5wDF5xU9z7Qo.5jZ8JQ.evJN9tZJ8X5vJQ8X5wDF5xU9z7Qo.5jZ8JQ',
      is_verified: true
    },
    {
      id: '22222222-2222-2222-2222-222222222222',
      first_name: 'Test',
      last_name: 'User',
      email: 'test@example.com',
      phone: '08087654321',
      password: '$2a$10$X5wDF5xU9z7Qo.5jZ8JQ.evJN9tZJ8X5vJQ8X5wDF5xU9z7Qo.5jZ8JQ',
      is_verified: true
    }
  ]);

  await knex('accounts').insert([
    {
      id: '33333333-3333-3333-3333-333333333333',
      user_id: '11111111-1111-1111-1111-111111111111',
      account_number: '1234567890',
      account_name: 'Admin User',
      balance: 100000.00
    },
    {
      id: '44444444-4444-4444-4444-444444444444',
      user_id: '22222222-2222-2222-2222-222222222222',
      account_number: '0987654321',
      account_name: 'Test User',
      balance: 50000.00
    }
  ]);
};