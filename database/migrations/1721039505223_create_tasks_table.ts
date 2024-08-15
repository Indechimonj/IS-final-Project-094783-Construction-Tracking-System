import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'tasks'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('title').notNullable().unique()
      table.text('description').nullable()
      table.integer('project_id').notNullable().unsigned().references('id').inTable('projects').onDelete('CASCADE')
      table.integer('assigned_to_user_id').nullable().unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.enum('status', ['pending', 'in progress', 'completed']).defaultTo('pending').notNullable()
      table.timestamp('start_date').nullable().defaultTo(this.now())
      table.timestamp('due_date').notNullable().defaultTo(this.now())
      table.integer('created_by_user_id').notNullable().unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.enum('priority', ['low', 'medium', 'high']).defaultTo('low').notNullable()
      table.decimal('budget', 15, 4).unsigned().notNullable().defaultTo(0)


      table.timestamp('created_at').notNullable().defaultTo(this.now())
      table.timestamp('updated_at').nullable().defaultTo(null)
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
