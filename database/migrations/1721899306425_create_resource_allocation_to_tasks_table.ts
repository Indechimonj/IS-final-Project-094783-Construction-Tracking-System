import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'resource_allocation_to_tasks'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('task_id').unsigned().notNullable().references('id').inTable('tasks').onDelete('CASCADE')
      table.integer('resource_id').unsigned().notNullable().references('id').inTable('resources').onDelete('CASCADE')
      table.decimal('quantity', 15, 2).notNullable()
      table.enum('cost_type', ['per hour', 'per day', 'one time']).defaultTo('one time').notNullable()
      table.decimal('cost_value', 15, 4).notNullable()
      table.decimal('used_quantity', 15, 2).notNullable().defaultTo(0)
      table.unique(['task_id', 'resource_id'])
      table.check('?? <= ??', ['used_quantity', 'quantity'])

      table.timestamp('created_at').notNullable().defaultTo(this.now())
      table.timestamp('updated_at').nullable().defaultTo(null)
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
