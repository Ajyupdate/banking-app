exports.up = function(knex) {
  return knex.schema.createTable('transactions', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('(UUID())'));
    table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE');
    table.uuid('account_id').references('id').inTable('accounts').onDelete('CASCADE');
    table.string('reference', 255).unique().notNullable();
    table.string('type', 20).notNullable(); // deposit, transfer, withdrawal
    table.decimal('amount', 19, 4).notNullable();
    table.decimal('fee', 19, 4).defaultTo(0.00);
    table.decimal('balance_before', 19, 4).notNullable();
    table.decimal('balance_after', 19, 4).notNullable();
    table.string('currency', 3).defaultTo('NGN');
    table.string('status', 20).defaultTo('pending');
    table.string('narration', 255);
    table.string('counterparty', 255);
    table.string('counterparty_account', 255);
    table.string('counterparty_bank', 255);
    table.text('metadata');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    table.timestamp('completed_at');
    
    table.index(['user_id'], 'idx_transactions_user_id');
    table.index(['account_id'], 'idx_transactions_account_id');
    table.index(['reference'], 'idx_transactions_reference');
    table.index(['type'], 'idx_transactions_type');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('transactions');
};