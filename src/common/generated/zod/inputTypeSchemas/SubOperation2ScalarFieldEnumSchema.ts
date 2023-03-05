import { z } from 'zod'

export const SubOperation2ScalarFieldEnumSchema = z.enum([
	'id',
	'createdAt',
	'updatedAt',
	'operationId',
	'status',
])

export default SubOperation2ScalarFieldEnumSchema
