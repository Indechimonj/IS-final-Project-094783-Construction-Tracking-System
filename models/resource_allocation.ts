import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import Resource from '#models/resource'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Task from '#models/task'

export default class ResourceAllocation extends BaseModel {
  static table = 'resource_allocation_to_tasks'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare resourceId: number

  @belongsTo(() => Resource)
  declare resource: BelongsTo<typeof Resource>

  @column()
  declare taskId: number

  @belongsTo(() => Task)
  declare task: BelongsTo<typeof Task>

  @column()
  declare quantity: number

  @column()
  declare costType: 'per hour' | 'per day' | 'one time'

  @column()
  declare costValue: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
