import { Database } from '@adonisjs/lucid/database'
import vine from '@vinejs/vine'

export const email = vine.string().email()
export const otp = vine.number().min(100000).max(999999)
export const role = vine.enum(['client', 'contractor'])
export const date = vine.date({ formats: { utc: true } })
export const _limit = vine.number().min(1).optional()
export const _cursor = vine.number().min(1).optional()
export const id = vine.number().min(1)
export const idValidator = vine.compile(vine.object({ id: vine.number().min(1) }))
export const projectIdValidator = vine.compile(vine.object({ projectId: id }))

export const fieldExists = (opts: { table: string, column: string }) => async (db: Database, value: string | number) => {
  return (await db.from(opts.table).where(opts.column, value).first()) !== null
}

export const uniqueByField = (opts: { table: string, column: string }) => async (db: Database, value: string | number) => {
  return (await db.from(opts.table).where(opts.column, value).first()) === null
}
