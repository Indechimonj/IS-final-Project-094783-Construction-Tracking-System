import vine from '@vinejs/vine'
import { uniqueByField } from './validator_utils.js'

export const createResourceValidator = vine.compile(vine.object({
  params: vine.object({ projectId: vine.number().min(1) }),
  name: vine.string().unique(uniqueByField({ table: 'resources', column: 'name' })),
  description: vine.string(),
  type: vine.enum(['material', 'equipment', 'labour']),
  units: vine.string()
}))

export const editResourceValidator = vine.compile(vine.object({
  params: vine.object({ id: vine.number().min(1) }),
  name: vine.string().unique(uniqueByField({ table: 'resources', column: 'name' })).optional(),
  description: vine.string().optional(),
  type: vine.enum(['material', 'equipment', 'labour']).optional(),
  units: vine.string().optional()
}))
