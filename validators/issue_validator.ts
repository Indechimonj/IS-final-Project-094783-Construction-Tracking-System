import vine from '@vinejs/vine'
import { fieldExists } from './validator_utils.js'

export const createIssueValidator = vine.compile(vine.object({
  params: vine.object({ projectId: vine.number().min(1) }),
  title: vine.string(),
  description: vine.string(),
  priority: vine.enum(['low', 'medium', 'high']).optional(),
  assignedToUserId: vine.number().optional(),
  budget: vine.number().min(0).optional(),
  taskId: vine.number().exists(fieldExists({ table: 'tasks', column: 'id' })).optional(),
}))

export const updateIssueValidator = vine.compile(vine.object({
  params: vine.object({ id: vine.number().min(1) }),
  title: vine.string().optional(),
  description: vine.string().optional(),
  priority: vine.enum(['low', 'medium', 'high']).optional(),
  status: vine.enum(['open', 'in progress', 'resolved', 'closed']).optional(),
  assignedToUserId: vine.number().optional(),
  budget: vine.number().min(0).optional(),
  taskId: vine.number().exists(fieldExists({ table: 'tasks', column: 'id' })).optional(),
}))
