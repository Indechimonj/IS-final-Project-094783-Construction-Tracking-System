import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import type { BelongsTo, HasMany, ManyToMany } from '@adonisjs/lucid/types/relations'
import { BaseModel, belongsTo, column, computed, hasMany, manyToMany } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import Project from '#models/project'
import Task from '#models/task'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

class UserRole extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @column()
  declare role: 'client' | 'contractor' | 'admin'

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null
}

export default class User extends compose(BaseModel, AuthFinder) {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare firstName: string

  @column()
  declare lastName: string

  @column()
  declare email: string

  @column({ serializeAs: null })
  declare otpHash: string | null

  @column({ serializeAs: null })
  declare otpExpiresAt: DateTime | null

  @hasMany(() => UserRole, { serializeAs: null })
  declare rolesRecords: HasMany<typeof UserRole>

  @computed()
  get roles() {
    return this.rolesRecords ? this.rolesRecords.map((role) => role.role) : undefined
  }

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  static accessTokens = DbAccessTokensProvider.forModel(User)

  @manyToMany(() => User, {
    pivotTable: 'employees',
    pivotForeignKey: 'user_id',
    pivotRelatedForeignKey: 'employer_id',
  })
  declare employers: ManyToMany<typeof User>

  @manyToMany(() => User, {
    pivotTable: 'employees',
    pivotForeignKey: 'employer_id',
    pivotRelatedForeignKey: 'user_id',
  })
  declare employees: ManyToMany<typeof User>


  @hasMany(() => Project, { foreignKey: 'clientId' })
  declare clientInProjects: HasMany<typeof Project>

  @hasMany(() => Project, { foreignKey: 'contractorId' })
  declare contractorInProjects: HasMany<typeof Project>

  @hasMany(() => Task, { foreignKey: 'createdByUserId' })
  declare createdTasks: HasMany<typeof Task>

  @hasMany(() => Task, { foreignKey: 'assignedToUserId' })
  declare assignedTasks: HasMany<typeof Task>

}
