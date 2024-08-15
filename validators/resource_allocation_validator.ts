import vine from '@vinejs/vine'

export const createResourceAllocationValidator = vine.compile(vine.object({
  params: vine.object({
    taskId: vine.number().min(1)
  }),
  resourceId: vine.number().min(1),
  quantity: vine.number().min(0),
  costType: vine.enum(['per hour', 'per day', 'one time']),
  costValue: vine.number().min(0)
}))

export const editResourceAllocationValidator = vine.compile(vine.object({
  params: vine.object({
    id: vine.number().min(1)
  }),
  quantity: vine.number().optional(),
  costType: vine.enum(['per hour', 'per day', 'one time']).optional(),
  costValue: vine.number().optional()
}))
