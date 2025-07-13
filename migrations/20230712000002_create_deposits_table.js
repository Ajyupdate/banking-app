exports.up = function(knex) {
  return knex.schema.createTable('deposits', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('(UUID())'));
    table.uuid('account_id').references('id').inTable('accounts').onDelete('CASCADE');
    table.string('reference', 255).unique().notNullable();
    table.decimal('amount', 19, 4).notNullable();
    table.string('currency', 3).defaultTo('NGN');
    table.string('sender_name', 255);
    table.string('sender_account', 255);
    table.string('sender_bank', 255);
    table.string('status', 20).defaultTo('pending');
    table.text('metadata');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    table.timestamp('completed_at');
    
    table.index(['account_id'], 'idx_deposits_account_id');
    table.index(['reference'], 'idx_deposits_reference');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('deposits');
};