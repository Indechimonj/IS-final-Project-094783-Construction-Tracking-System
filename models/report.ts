import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import Project from '#models/project'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from '#models/user'

export default class Report extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare projectId: number

  @belongsTo(() => Project)
  declare project: BelongsTo<typeof Project>

  @column()
  declare generatedByUserId: number

  @belongsTo(() => User, { foreignKey: 'generatedByUserId' })
  declare generatedByUser: BelongsTo<typeof User>

  @column()
  declare title: string

  @column()
  declare description: string

  @column()
  declare information: string // TODO test JSON handling

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
