import type { HttpContext } from '@adonisjs/core/http'
import Resource from "#models/resource"
import { createResourceValidator, editResourceValidator } from "#validators/resource_validator"
import { canCreateResource, canDeleteResource, canEditResource } from '#abilities/main'
import { nameAndPaginationValidator } from '#validators/project_validator'
import { paginationData } from '../utils/pagination.js'
import { idValidator } from '#validators/validator_utils'
import Project from '#models/project'

export default class ResourcesController {
  async createResource({ request, response, bouncer }: HttpContext) {
    const { params: { projectId }, name, type, description, units } = await request.validateUsing(createResourceValidator)
    const project = await Project.find(projectId)
    if (project === null) return response.notFound({ status: 'error', message: 'Project not found' })
    if (await bouncer.denies(canCreateResource, project)) {
      return response.forbidden({
        status: 'error',
        message: 'You are not authorized to create a resource on this project',
      })
    }
    const resource = await project.related('resources').create({ name, type, description, units })
    return response.created({ status: 'success', message: 'Resource created successfully!', resource })
  }

  async getResourcesPaginated({ request, response }: HttpContext) {
    const { _limit = 10, _cursor, name } = await nameAndPaginationValidator.validate(request.qs())
    const resources = await Resource.query()
      .if(name !== undefined, (query) => query.where('name', 'like', `%${name}%`))
      .if(_cursor !== undefined, (query) => query.andWhere('id', '>', _cursor as number))
      .limit(_limit)
    return response.ok({
      status: 'success',
      ...paginationData(resources, _limit)
    })
  }

  async getResourceById({ request, response }: HttpContext) {
    const { id } = await idValidator.validate(request.params())
    const resource = await Resource.find(id)
    if (resource === null) return response.notFound({ status: 'error', message: 'Resource not found' })
    return response.ok({ status: 'success', resource })
  }

  async updateResourceById({ request, response, bouncer }: HttpContext) {
    const { params: { id }, name, type, description, units } = await request.validateUsing(editResourceValidator)
    const resource = await Resource.query().preload('project').where('id', id).first()
    if (resource === null) return response.notFound({ status: 'error', message: 'Resource not found' })
    if (await bouncer.denies(canEditResource, resource.project)) {
      return response.forbidden({
        status: 'error',
        message: 'You are not authorized to edit this resource',
      })
    }
    if (name !== undefined) resource.name = name
    if (type !== undefined) resource.type = type
    if (description !== undefined) resource.description = description
    if (units !== undefined) resource.units = units
    await resource.save()
    return response.ok({ status: 'success', message: 'Resource updated successfully!', resource })
  }

  async deleteResourceById({ response, bouncer, params }: HttpContext) {
    const { id } = await idValidator.validate(params)
    const resource = await Resource.query().preload('project').where('id', id).first()
    if (resource === null) return response.notFound({ status: 'error', message: 'Resource not found' })
    if (await bouncer.denies(canDeleteResource, resource.project)) {
      return response.forbidden({
        status: 'error',
        message: 'You are not authorized to delete this resource',
      })
    }
    await resource.delete()
    return response.ok({ status: 'success', message: 'Resource deleted successfully!' })
  }
}
