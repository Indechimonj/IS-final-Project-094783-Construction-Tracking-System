import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Project from '#models/project'
import ResourceAllocation from '#models/resource_allocation'

export default class Resource extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare projectId: number

  @belongsTo(() => Project)
  declare project: BelongsTo<typeof Project>

  @column()
  declare name: string

  @column()
  declare type: 'material' | 'equipment' | 'labour'

  @column()
  declare description: string

  @column()
  declare units: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @hasMany(() => ResourceAllocation)
  declare resourceAllocations: HasMany<typeof ResourceAllocation>
}
