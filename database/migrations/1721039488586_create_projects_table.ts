import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'projects'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.string('name').notNullable().unique()
      table.text('description').nullable()
      table.timestamp('start_date').notNullable().defaultTo(this.now())
      table.timestamp('end_date').notNullable().defaultTo(this.now())
      table.enum('status', ['pending', 'in progress', 'completed']).defaultTo('pending').notNullable()
      table.integer('client_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE')
      table.integer('contractor_id').unsigned().nullable().references('id').inTable('users').onDelete('CASCADE').defaultTo(null)
      table.decimal('budget', 15, 4).unsigned().notNullable()

      table.timestamp('created_at').notNullable().defaultTo(this.now())
      table.timestamp('updated_at').nullable().defaultTo(null)
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
