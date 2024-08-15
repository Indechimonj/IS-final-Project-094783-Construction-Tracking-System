import type { HttpContext } from '@adonisjs/core/http'
import { createIssueValidator, updateIssueValidator } from "#validators/issue_validator"
import Project from '#models/project'
import { canCreateIssue, canDeleteIssue, canEditIssue } from '#abilities/main'
import { paginationData } from '../utils/pagination.js'
import Issue from '#models/issue'
import { nameAndPaginationValidator } from '#validators/project_validator'
import { idValidator, projectIdValidator } from '#validators/validator_utils'

export default class IssuesController {
  async createIssue({ request, response, bouncer , auth}: HttpContext) {
    const { params: { projectId }, title, description, priority = 'low' } = await request.validateUsing(createIssueValidator)
    const project = await Project.find(projectId)
    if (project === null) return response.notFound({ status: 'error', message: 'Project not found' })
    if (await bouncer.denies(canCreateIssue, project)) {
      return response.forbidden({
        status: 'error',
        message: 'You are not authorized to create an issue on this project',
      })
    }
    const issue = await project.related('issues').create({
      title,
      description,
      priority,
      status: 'open',
      reportedByUserId: auth.user!.id
    })
    return response.created({ status: 'success', message: 'Issue created successfully!', issue })
  }

  async getIssuesPaginated({ request, response }: HttpContext) {
    const { projectId } = await projectIdValidator.validate(request.params())
    const { _limit = 10, _cursor, name } = await nameAndPaginationValidator.validate(request.qs())
    const project = await Project.query().where('id', projectId).preload('issues', (q) => {
      q.if(_cursor !== undefined, (query) => query.where('id', '>', _cursor as number))
      q.if(name !== undefined, (query) => query.where('title', 'like', `%${name}%`))
      q.limit(_limit)
    }).first()
    if (project === null) return response.notFound({ status: 'error', message: 'Project not found' })
    return response.ok({
      status: 'success',
      ...paginationData(project.issues, _limit)
    })
  }

  async getIssueById({ request, response }: HttpContext) {
    const { id } = await idValidator.validate(request.params())
    const issue = Issue.find(id)
    if (issue === null) return response.notFound({ status: 'error', message: 'Issue not found' })
    return response.ok({ status: 'success', issue })
  }

  async updateIssueById({ request, response, bouncer }: HttpContext) {
    const { params: { id }, title, description, priority, status } = await request.validateUsing(updateIssueValidator)
    const issue = await Issue.query().preload('project').where('id', id).first()
    if (issue === null) return response.notFound({ status: 'error', message: 'Issue not found' })
    if (await bouncer.denies(canEditIssue, issue.project)) {
      return response.forbidden({
        status: 'error',
        message: 'You are not authorized to edit this issue',
      })
    }
    if (title !== undefined) issue.title = title
    if (description !== undefined) issue.description = description
    if (priority !== undefined) issue.priority = priority
    if (status !== undefined) issue.status = status
    await issue.save()
    return response.ok({ status: 'success', message: 'Issue updated successfully!', issue })
  }

  async deleteIssueById({ response, bouncer, params }: HttpContext) {
    const { id } = await idValidator.validate(params)
    const issue = await Issue.find(id)
    if (issue === null) return response.notFound({ status: 'error', message: 'Issue not found' })
    if (await bouncer.denies(canDeleteIssue, issue)) {
      return response.forbidden({
        status: 'error',
        message: 'You are not authorized to delete this issue',
      })
    }
    await issue.delete()
    return response.ok({ status: 'success', message: 'Issue deleted successfully!' })
  }
}
