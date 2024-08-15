import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'documents'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name').notNullable().unique()
      table.text('description').nullable()
      table.integer('uploaded_by_user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.integer('project_id').unsigned().references('id').inTable('projects').onDelete('CASCADE')
      table.string('file_path').notNullable()
      table.string('file_type').notNullable()
      table.integer('file_size').notNullable()

      table.timestamp('uploaded_at').notNullable().defaultTo(this.now())
      table.timestamp('updated_at').nullable().defaultTo(null)
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
