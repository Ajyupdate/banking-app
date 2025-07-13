exports.up = function(knex) {
  return knex.schema.createTable('accounts', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('(UUID())'));
    table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE');
    table.string('account_number', 10).unique().notNullable();
    table.string('bank_name', 255).defaultTo('Raven Bank');
    table.string('account_name', 255).notNullable();
    table.decimal('balance', 19, 4).defaultTo(0.00);
    table.string('currency', 3).defaultTo('NGN');
    table.string('status', 20).defaultTo('active');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    
    table.index(['user_id'], 'idx_accounts_user_id');
    table.index(['account_number'], 'idx_accounts_account_number');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('accounts');
};