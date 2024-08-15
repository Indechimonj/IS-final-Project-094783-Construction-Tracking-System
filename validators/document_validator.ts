import vine from '@vinejs/vine'

export const createDocumentValidator = vine.compile(vine.object({
  params: vine.object({ projectId: vine.number().min(1) }),
  name: vine.string(),
  description: vine.string(),
  file: vine.file({ size: '50mb' })
}))

export const updateDocumentValidator = vine.compile(vine.object({
  params: vine.object({ id: vine.number().min(1) }),
  name: vine.string().optional(),
  description: vine.string().optional(),
  file: vine.file({ size: '50mb' }).optional()
}))
