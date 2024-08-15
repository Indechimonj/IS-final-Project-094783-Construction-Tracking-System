import { canAllocateResource, canDeleteResourceAllocation, canEditResourceAllocation, canViewProject } from '#abilities/main'
import Resource from '#models/resource'
import ResourceAllocation from '#models/resource_allocation'
import Task from '#models/task'
import { nameAndPaginationValidator } from '#validators/project_validator'
import { createResourceAllocationValidator, editResourceAllocationValidator } from '#validators/resource_allocation_validator'
import type { HttpContext } from '@adonisjs/core/http'
import { paginationData } from '../utils/pagination.js'
import vine from '@vinejs/vine'
import { idValidator } from '#validators/validator_utils'

export default class ResourceAllocationsController {
  async createResourceAllocation({ request, response, bouncer }: HttpContext) {
    const { params: { taskId }, resourceId, quantity, costType, costValue } = await request.validateUsing(createResourceAllocationValidator)
    const task = await Task.query().where('id', taskId).preload('project').first()
    if (task === null) return response.notFound({ status: 'error', message: 'Task not found' })
    const resource = await Resource.find(resourceId)
    if (resource === null) return response.notFound({ status: 'error', message: 'Resource not found' })
    if (await bouncer.denies(canAllocateResource, task.project)) {
      return response.forbidden({
        status: 'error',
        message: 'You are not authorized to create a resource allocation on this task',
      })
    }
    const allocatedResource = await task.related('allocatedResources').query().where('resource_id', resourceId).first()
    if (allocatedResource !== null) {
      return response.badRequest({
        status: 'error',
        message: 'Resource already allocated to task'
      })
    }
    const resourceAllocation = await ResourceAllocation.create({
      taskId,
      resourceId,
      quantity,
      costType,
      costValue
    })
    return response.created({ status: 'success', message: 'Resource allocation created successfully!', resourceAllocation })
  }

  async getResourceAllocationsPaginated({ request, response }: HttpContext) {
    const { taskId } = await vine.compile(vine.object({ taskId: vine.number().min(1) })).validate(request.params())
    const { _limit = 10, _cursor } = await nameAndPaginationValidator.validate(request.qs())
    const task = await Task.query().where('id', taskId).preload('allocatedResources', (q) => {
      q.preload('resource')
        .preload('task')
        .if(_cursor !== undefined, (query) => query.where('id', '>', _cursor as number))
        .limit(_limit)
    }).first()
    if (task === null) return response.notFound({ status: 'error', message: 'Task not found' })
    return response.ok({
      status: 'success',
      ...paginationData(task.allocatedResources, _limit)
    })
  }

  async getResourceAllocationById({ response, params, bouncer, auth }: HttpContext) {
    const { id } = await idValidator.validate(params)
    await auth.user!.preload('employers')
    const resourceAllocation = await ResourceAllocation.query()
      .where('id', id)
      .preload('task', (q) => q.preload('project'))
      .preload('resource')
      .first()
    if (resourceAllocation === null) return response.notFound({ status: 'error', message: 'Resource allocation not found' })
    if (await bouncer.denies(canViewProject, resourceAllocation.task.project, auth.user!.employers)) {
      return response.forbidden({
        status: 'error',
        message: 'You are not authorized to view this resource allocation',
      })
    }
    return response.ok({ status: 'success', resourceAllocation })
  }

  async updateResourceAllocationById ({ request, response, bouncer }: HttpContext) {
    const { params: { id }, quantity, costType, costValue } = await request.validateUsing(editResourceAllocationValidator)
    const resourceAllocation = await ResourceAllocation.query()
      .where('id', id)
      .preload('task', (q) => q.preload('project'))
      .preload('resource')
      .first()
    if (resourceAllocation === null) return response.notFound({ status: 'error', message: 'Resource allocation not found' })
    if (await bouncer.denies(canEditResourceAllocation, resourceAllocation.task.project)) {
      return response.forbidden({
        status: 'error',
        message: 'You are not authorized to edit this resource allocation',
      })
    }
    const updatedRecord = await resourceAllocation.merge({
      quantity: quantity ?? resourceAllocation.quantity,
      costType: costType ?? resourceAllocation.costType,
      costValue: costValue ?? resourceAllocation.costValue
    }).save()
    return response.ok({
      status: 'success',
      message: 'Resource allocation updated successfully',
      resourceAllocation: updatedRecord
    })
  }

  async deleteResourceAllocationById({ response, bouncer, params }: HttpContext) {
    const { id } = await idValidator.validate(params)
    const resourceAllocation = await ResourceAllocation.query()
      .where('id', id)
      .preload('task', (q) => q.preload('project'))
      .preload('resource')
      .first()
    if (resourceAllocation === null) return response.notFound({ status: 'error', message: 'Resource allocation not found' })
    if (await bouncer.denies(canDeleteResourceAllocation, resourceAllocation.task.project)) {
      return response.forbidden({
        status: 'error',
        message: 'You are not authorized to delete this resource allocation',
      })
    }
    await resourceAllocation.delete()
    return response.ok({ status: 'success', message: 'Resource allocation deleted successfully' })
  }
}
