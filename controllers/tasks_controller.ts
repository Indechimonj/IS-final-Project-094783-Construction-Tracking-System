import type { HttpContext } from '@adonisjs/core/http'
import { createTaskValidator, updateTaskValidator } from "#validators/task_validator"
import { canCreateTask, canDeleteTask, canEditTask } from '#abilities/main'
import { idValidator } from '#validators/validator_utils'
import Project from '#models/project'
import Task from '#models/task'
import { nameAndPaginationValidator, projectIdExistsValidator } from '#validators/project_validator'
import { paginationData } from '../utils/pagination.js'

export default class TasksController {
  async createTask({ request, response, bouncer, auth }: HttpContext) {
    const { params: { projectId }, title, description, startDate, dueDate, priority, status, budget } = await request.validateUsing(createTaskValidator)
    const project = await Project.find(projectId)
    if (project === null) return response.notFound({ status: 'error', message: 'Project not found' })
    if (await bouncer.denies(canCreateTask, project)) {
      return response.forbidden({
        status: 'error',
        message: 'You are not authorized to create a task on this project',
      })
    }
    if (budget !== undefined && project.budget < budget) {
      return response.badRequest({
        status: 'error',
        message: 'Task budget cannot be greater than project budget',
      })
    }
    const createdTask = await Task.create({
      title,
      description,
      projectId,
      status,
      startDate,
      dueDate,
      createdByUserId: auth.user!.id,
      priority,
      budget
    })
    const task = await Task.query().where('id', createdTask.id).preload('createdByUser').preload('assignedToUser').firstOrFail()
    return response.created({ status: 'success', message: 'Task created successfully!', task })
  }

  async getTasksPaginated({ request, response }: HttpContext) {
    const { projectId } = await projectIdExistsValidator.validate(request.params())
    const { _limit = 10, _cursor } = await nameAndPaginationValidator.validate(request.qs())
    const tasks = await Task.query()
      .where('projectId', projectId)
      .preload('assignedToUser')
      .preload('createdByUser')
      .if(_cursor !== undefined, (query) => query.andWhere('id', '>', _cursor as number))
      .limit(_limit)
      .orderBy('id', 'asc')
    return response.ok({
      status: 'success',
      ...paginationData(tasks, _limit)
    })
  }

  async getTasksById({ request, response, bouncer }: HttpContext) {
    const { id } = await idValidator.validate(request.params())
    const task = await Task.query().where('id', id)
      .preload('project')
      .preload('assignedToUser')
      .preload('createdByUser')
      .first()
    if (task === null) return response.notFound({ status: 'error', message: 'Task not found' })
    const authUserCanEditTask = await bouncer.allows(canEditTask, task.project, task)
    return response.ok({ status: 'success', task: {
        ...task.serialize(),
        canEditTask: authUserCanEditTask
      }
    })
  }

  async updateTaskById({ request, response, bouncer }: HttpContext) {
    const { params: { id }, title, description, startDate, dueDate, priority, status, assignedToUserId, budget } = await request.validateUsing(updateTaskValidator)
    const task = await Task.query()
      .where('id', id)
      .preload('assignedToUser')
      .preload('createdByUser')
      .preload('project', (q) => q.withAggregate('tasks', (q) => q.sum('budget').as('totalTasksBudget')))
      .first()
    if (task === null) return response.notFound({ status: 'error', message: 'Task not found' })
    if (await bouncer.denies(canEditTask, task.project, task)) {
      return response.forbidden({
        status: 'error',
        message: 'You are not authorized to update this task',
      })
    }
    if (title !== undefined) task.title = title
    if (description !== undefined) task.description = description
    if (startDate !== undefined) task.startDate = startDate
    if (dueDate !== undefined) task.dueDate = dueDate
    if (priority !== undefined) task.priority = priority
    if (status !== undefined) task.status = status
    if (assignedToUserId !== undefined) task.assignedToUserId = assignedToUserId
    if (budget !== undefined) {
      if (task.project.budget < budget) {
        return response.badRequest({
          status: 'error',
          message: 'Task budget cannot be greater than project budget',
        })
      } else if ((task.project.$extras.totalTasksBudget + budget - task.budget) > task.project.budget) {
        return response.badRequest({
          status: 'error',
          message: 'Total tasks budget will exceed project budget'
        })
      }
      task.budget = budget
    }
    await task.save()
    return response.ok({
      status: 'success',
      message: 'Task updated successfully',
      task: {
        ...task.serialize(),
        canEditTask: true
      }
    })
  }

  async deleteTaskById({ response, bouncer, params }: HttpContext) {
    const { id } = await idValidator.validate(params)
    const task = await Task.query().preload('project').where('id', id).first()
    if (task === null) return response.notFound({ status: 'error', message: 'Task not found' })
    if (await bouncer.denies(canDeleteTask, task.project, task)) {
      return response.forbidden({
        status: 'error',
        message: 'You are not authorized to delete this task',
      })
    }
    await task.delete()
    return response.ok({ status: 'success', message: 'Task deleted successfully' })
  }
}
