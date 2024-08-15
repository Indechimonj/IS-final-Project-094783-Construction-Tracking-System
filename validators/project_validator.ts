import vine from '@vinejs/vine'
import { _cursor, _limit, date, fieldExists } from './validator_utils.js'

export const createProjectValidator = vine.compile(
  vine.object({
    name: vine.string().unique(async (db, value) => {
      return (await db.from('projects').where('name', value).first()) === null
    }),
    description: vine.string().optional(),
    startDate: date,
    endDate: date,
    contractorId: vine.number().exists(async (db, value) => {
      return (await db.from('user_roles').where('id', value).andWhere('role', 'contractor').first()) !== null
    }).optional(),
    budget: vine.number(),
  })
)

export const nameAndPaginationValidator = vine.compile(vine.object({
  _limit,
  _cursor,
  name: vine.string().optional(),
}))

export const updateProjectValidator = vine.compile(
  vine.object({
    params: vine.object({ id: vine.number().min(1) }),
    name: vine.string().unique(async (db, value) => {
      return (await db.from('projects').where('name', value).first()) === null
    }).optional(),
    description: vine.string().optional(),
    startDate: date.optional(),
    endDate: date.optional(),
    contractorId: vine.number().exists(async (db, value) => {
      return (await db.from('user_roles').where('id', value).andWhere('role', 'contractor').first()) !== null
    }).optional(),
    budget: vine.number().optional(),
  })
)

export const projectIdExistsValidator = vine.compile(
  vine.object({
    projectId: vine.number().min(1).exists(fieldExists({ table: 'projects', column: 'id' }))
  })
)
