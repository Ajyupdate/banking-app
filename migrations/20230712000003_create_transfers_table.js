exports.up = function(knex) {
  return knex.schema.createTable('transfers', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('(UUID())'));
    table.uuid('account_id').references('id').inTable('accounts').onDelete('CASCADE');
    table.string('reference', 255).unique().notNullable();
    table.decimal('amount', 19, 4).notNullable();
    table.decimal('fee', 19, 4).defaultTo(0.00);
    table.string('currency', 3).defaultTo('NGN');
    table.string('recipient_name', 255).notNullable();
    table.string('recipient_account', 255).notNullable();
    table.string('recipient_bank', 255).notNullable();
    table.string('recipient_bank_code', 255);
    table.string('narration', 255);
    table.string('status', 20).defaultTo('pending');
    table.text('metadata');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    table.timestamp('completed_at');
    
    table.index(['account_id'], 'idx_transfers_account_id');
    table.index(['reference'], 'idx_transfers_reference');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('transfers');
};