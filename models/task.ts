import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import Project from '#models/project'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import User from '#models/user'
import ResourceAllocation from '#models/resource_allocation'

export default class Task extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare title: string

  @column()
  declare description: string

  @column()
  declare projectId: number

  @belongsTo(() => Project, { serializeAs: null })
  declare project: BelongsTo<typeof Project>

  @column()
  declare assignedToUserId: number

  @belongsTo(() => User, { foreignKey: 'assignedToUserId' })
  declare assignedToUser: BelongsTo<typeof User>

  @column()
  declare status: 'pending' | 'in progress' | 'completed'

  @column()
  declare startDate: Date | null

  @column()
  declare dueDate: Date

  @column()
  declare createdByUserId: number

  @belongsTo(() => User, { foreignKey: 'createdByUserId' })
  declare createdByUser: BelongsTo<typeof User>

  @column()
  declare priority: 'low' | 'medium' | 'high'

  @column()
  declare budget: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @hasMany(() => ResourceAllocation)
  declare allocatedResources: HasMany<typeof ResourceAllocation>
}
