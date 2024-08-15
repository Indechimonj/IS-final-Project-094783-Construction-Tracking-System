import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import Project from '#models/project'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Task from '#models/task'
import User from '#models/user'

export default class Issue extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare title: string

  @column()
  declare description: string

  @column()
  declare projectId: number

  @belongsTo(() => Project)
  declare project: BelongsTo<typeof Project>

  @column()
  declare taskId: number | null

  @belongsTo(() => Task)
  declare task: BelongsTo<typeof Task>

  @column()
  declare reportedByUserId: number

  @belongsTo(() => User, { foreignKey: 'reportedByUserId' })
  declare reportedByUser: BelongsTo<typeof User>

  @column()
  declare assignedToUserId: number | null

  @belongsTo(() => User, { foreignKey: 'assignedToUserId' })
  declare assignedToUser: BelongsTo<typeof User>

  @column()
  declare status: 'open' | 'in progress' | 'resolved' | 'closed'

  @column()
  declare priority: 'low' | 'medium' | 'high'

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
