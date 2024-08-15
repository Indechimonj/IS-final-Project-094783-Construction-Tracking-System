import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, hasManyThrough, hasOne, scope } from '@adonisjs/lucid/orm'
import User from '#models/user'
import type { HasMany, HasManyThrough, HasOne } from '@adonisjs/lucid/types/relations'
import Task from '#models/task'
import Document from '#models/document'
import Resource from '#models/resource'
import Issue from '#models/issue'

export default class Project extends BaseModel {
  // Soft delete scope

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare description: string

  @column()
  declare startDate: Date | null

  @column()
  declare endDate: Date

  @column()
  declare status: string

  @column()
  declare clientId: number

  @hasOne(() => User)
  declare client: HasOne<typeof User>

  @column()
  declare contractorId: number

  @hasOne(() => User)
  declare contractor: HasOne<typeof User>

  @column()
  declare budget: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @hasMany(() => Resource)
  declare resources: HasMany<typeof Resource>

  @hasMany(() => Task)
  declare tasks: HasMany<typeof Task>

  @hasMany(() => Document)
  declare documents: HasMany<typeof Document>

  @hasMany(() => Issue)
  declare issues: HasMany<typeof Issue>

  @hasManyThrough([() => Resource, () => Task])
  declare allocatedResources: HasManyThrough<typeof Resource>

  static visibleTo = scope((query, user: User) => {
    query
      .where('clientId', user.id)
      .orWhere('contractorId', user.id)
  })
}
