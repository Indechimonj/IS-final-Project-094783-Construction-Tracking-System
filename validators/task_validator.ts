import vine from '@vinejs/vine'
import { date, uniqueByField } from './validator_utils.js'
import Project from '#models/project'
import type { FieldContext } from '@vinejs/vine/types'

const taskBudgetWithinProjectBudget = async (value: unknown, opts: { projectId: number }, field: FieldContext) => {
  const project = await Project.query()
    .where('id', opts.projectId)
    .withAggregate('tasks', (q) => q.sum('budget').as('totalTasksBudget'))
    .first()
  if (project === null) return false
  return project.budget >= project.$extras.totalTasksBudget + value
}

export const createTaskValidator = vine.compile(vine.object({
  params: vine.object({ projectId: vine.number().min(1) }),
  title: vine.string().unique(uniqueByField({ table: 'tasks', column: 'title' })),
  description: vine.string().optional(),
  startDate: vine.date({ formats: { utc: true } }).optional(),
  dueDate: date,
  priority: vine.enum(['low', 'medium', 'high']).optional(),
  status: vine.enum(['pending', 'in progress', 'completed']).optional(),
  budget: vine.number().min(0).optional(),
}))

export const updateTaskValidator = vine.compile(vine.object({
  params: vine.object({ id: vine.number().min(1) }),
  title: vine.string().unique(uniqueByField({ table: 'tasks', column: 'title' })).optional(),
  description: vine.string().optional(),
  startDate: vine.date({ formats: { utc: true } }).nullable().optional(),
  dueDate: date.optional(),
  priority: vine.enum(['low', 'medium', 'high']).optional(),
  status: vine.enum(['pending', 'in progress', 'completed']).optional(),
  assignedToUserId: vine.number().exists(async (db, value) => {
    // TODO make sure the user is an employee
    return (await db.from('users').where('id', value).first()) !== null
  }).optional(),
  budget: vine.number().min(0).optional(),
}))
