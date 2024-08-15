import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import Project from '#models/project'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from '#models/user'

export default class Document extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare description: string

  @column()
  declare uploadedByUserId: number

  @belongsTo(() => User, { foreignKey: 'uploadedByUserId' })
  declare uploadedByUser: BelongsTo<typeof User>

  @column()
  declare projectId: number

  @belongsTo(() => Project)
  declare project: BelongsTo<typeof Project>

  @column()
  declare filePath: string

  @column()
  declare fileType: string

  @column()
  declare fileSize: number

  @column.dateTime({ autoCreate: true })
  declare uploadedAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
