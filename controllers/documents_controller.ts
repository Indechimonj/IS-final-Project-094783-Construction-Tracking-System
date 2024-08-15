import type { HttpContext } from '@adonisjs/core/http'
import { createDocumentValidator, updateDocumentValidator } from "#validators/document_validator"
import Project from '#models/project'
import { canCreateDocument, canDeleteDocument, canDownloadDocument, canEditDocument } from '#abilities/main'
import app from '@adonisjs/core/services/app'
import { cuid } from '@adonisjs/core/helpers'
import { nameAndPaginationValidator, projectIdExistsValidator } from '#validators/project_validator'
import { paginationData } from '../utils/pagination.js'
import { idValidator } from '#validators/validator_utils'
import Document from '#models/document'

export default class DocumentsController {
  async createDocument({ request, response, bouncer }: HttpContext) {
    const { params: { projectId }, name, description, file } = await request.validateUsing(createDocumentValidator)
    const project = await Project.find(projectId)
    if (project === null) return response.notFound({ status: 'error', message: 'Project not found' })
    if (await bouncer.denies(canCreateDocument, project)) {
      return response.forbidden({
        status: 'error',
        message: 'You are not authorized to create a document on this project',
      })
    }
    await file.move(app.makePath('uploads'), {
      name: `${cuid()}.${file.extname}`,
    })
    const document = await project.related('documents').create({
      name,
      description,
      filePath: file.fileName,
      fileSize: file.size,
      fileType: file.type
    })
    return response.created({ status: 'success', message: 'Document created successfully!', document })
  }

  async getDocumentsPaginated({ request, response }: HttpContext) {
    const { projectId } = await projectIdExistsValidator.validate(request.params())
    const { _limit = 10, _cursor, name } = await nameAndPaginationValidator.validate(request.qs())
    const project = await Project.query().where('id', projectId).preload('documents', (q) => {
      q.if(_cursor !== undefined, (query) => query.where('id', '>', _cursor as number))
      q.if(name !== undefined, (query) => query.where('name', 'like', `%${name}%`))
      q.limit(_limit)
    }).first()
    if (project === null) return response.notFound({ status: 'error', message: 'Project not found' })
    return response.ok({
      status: 'success',
      ...paginationData(project.documents, _limit)
    })
  }

  async getDocumentById({ request, response }: HttpContext) {
    const { id } = await idValidator.validate(request.params())
    const document = await Document.find(id)
    if (document === null) return response.notFound({ status: 'error', message: 'Document not found' })
    return response.ok({ status: 'success', document })
  }

  async updateDocumentById({ request, response, bouncer }: HttpContext) {
    const { params: { id }, name, description, file } = await request.validateUsing(updateDocumentValidator)
    const document = await Document.query().preload('project').where('id', id).first()
    if (document === null) return response.notFound({ status: 'error', message: 'Document not found' })
    if (await bouncer.denies(canEditDocument, document.project)) {
      return response.forbidden({
        status: 'error',
        message: 'You are not authorized to update this document',
      })
    }
    if (name !== undefined) document.name = name
    if (description !== undefined) document.description = description
    if (file !== undefined) {
      await file.move(app.makePath('uploads'), {
        name: `${cuid()}.${file.extname}`,
      })
      document.filePath = file.fileName!
      document.fileSize = file.size
      document.fileType = file.type!
    }
    await document.save()
    return response.ok({ status: 'success', message: 'Document updated successfully!', document })
  }


  async deleteDocumentById({ response, bouncer, params }: HttpContext) {
    const { id } = await idValidator.validate(params)
    const document = await Document.find(id)
    if (document === null) return response.notFound({ status: 'error', message: 'Document not found' })
    if (await bouncer.denies(canDeleteDocument, document.project)) {
      return response.forbidden({
        status: 'error',
        message: 'You are not authorized to delete this document',
      })
    }
    await document.delete()
    return response.ok({ status: 'success', message: 'Document deleted successfully!' })
  }

  async downloadDocument({ request, response, bouncer }: HttpContext) {
    const { id } = await idValidator.validate(request.params())
    const document = await Document.query().where('id', id).preload('project').first()
    if (document === null) return response.notFound({ status: 'error', message: 'Document not found' })
    if (await bouncer.denies(canDownloadDocument, document.project)) {
      return response.forbidden({
        status: 'error',
        message: 'You are not authorized to download this document',
      })
    }
    const absolutePath = app.makePath('uploads', document.filePath)
    return response.download(absolutePath)
  }
}
