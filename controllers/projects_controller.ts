import { canCreateProject, canDeleteProject, canEditProject, canViewProject } from '#abilities/main'
import Project from '#models/project'
import { createProjectValidator, nameAndPaginationValidator, updateProjectValidator } from '#validators/project_validator'
import type { HttpContext } from '@adonisjs/core/http'
import { paginationData } from '../utils/pagination.js'
import { idValidator } from '../validators/validator_utils.js'

export default class ProjectsController {
  async createProject({ request, response, bouncer, auth }: HttpContext) {
    const { name, description, startDate, endDate, contractorId, budget } =
      await createProjectValidator.validate(request.body())
    if (await bouncer.denies(canCreateProject)) {
      return response.forbidden({
        status: 'error',
        message: 'You are not authorized to create a project',
      })
    }
    const project = await Project.create({
      name,
      description,
      startDate,
      endDate,
      clientId: auth.user!.id,
      contractorId,
      budget,
    }, )
    return response.created({ status: 'success', message: 'Project created successfully', project })
  }

  async getProjectsPaginated({ request, response, auth }: HttpContext) {
    const { _limit = 10, _cursor, name } = await nameAndPaginationValidator.validate(request.qs())
    const projects = await Project.query()
      .withScopes((scopes) => scopes.visibleTo(auth.user!))
      .if(name !== undefined, (query) => query.where('name', 'like', `%${name}%`))
      .if(_cursor !== undefined, (query) => query.andWhere('id', '>', _cursor as number))
      .limit(_limit ?? 10)
    return response.ok({
      status: 'success',
      ...paginationData(projects, _limit)
    })
  }

  async getProjectById({ response, params, auth, bouncer }: HttpContext) {
    const { id } = await idValidator.validate(params)
    const project = await Project.find(id)
    if (project === null) return response.notFound({ status: 'error', message: 'Project not found' })
    await auth.user!.load('employers')
    if (await bouncer.denies(canViewProject, project, auth.user!.employers)) {
      return response.forbidden({
        status: 'error',
        message: 'You are not authorized to view this project',
      })
    }
    return response.ok({ status: 'success', project })
  }

  async updateProjectById({ request, response, bouncer }: HttpContext) {
    const {
      params: { id },
      name,
      description,
      startDate,
      endDate,
      contractorId,
      budget
    } = await request.validateUsing(updateProjectValidator)
    const project = await Project.find(id)
    if (project === null) return response.notFound({ status: 'error', message: 'Project not found' })
    if (await bouncer.denies(canEditProject, project)) {
      return response.forbidden({
        status: 'error',
        message: 'You are not authorized to update this project',
      })
    }
    if (name) project.name = name
    if (description) project.description = description
    if (startDate) project.startDate = startDate
    if (endDate) project.endDate = endDate
    if (contractorId) project.contractorId = contractorId
    if (budget) project.budget = budget
    await project.save()

    return response.ok({ status: 'success', message: 'Project updated successfully', project })
  }

  async deleteProjectById({ response, bouncer, params }: HttpContext) {
    const { id } = await idValidator.validate(params)
    const project = await Project.find(id)
    if (project === null) return response.notFound({ status: 'error', message: 'Project not found' })
    if (await bouncer.denies(canDeleteProject, project)) {
      return response.forbidden({
        status: 'error',
        message: 'You are not authorized to delete this project',
      })
    }
    await project.delete()
    return response.ok({ status: 'success', message: 'Project deleted successfully' })
  }
}
