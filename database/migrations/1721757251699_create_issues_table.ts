import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'issues'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('title').notNullable()
      table.text('description').notNullable()
      table.integer('project_id').unsigned().notNullable().references('id').inTable('projects').onDelete('CASCADE')
      table.integer('task_id').unsigned().nullable().references('id').inTable('tasks').onDelete('CASCADE').defaultTo(null)
      table.integer('reported_by_user_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE')
      table.integer('assigned_to_user_id').unsigned().nullable().references('id').inTable('users').onDelete('CASCADE').defaultTo(null)
      table.enum('status', ['open', 'in progress', 'resolved', 'closed']).defaultTo('open').notNullable()
      table.enum('priority', ['low', 'medium', 'high']).defaultTo('low').notNullable()

      table.timestamp('created_at').notNullable().defaultTo(this.now())
      table.timestamp('updated_at').nullable().defaultTo(null)
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
