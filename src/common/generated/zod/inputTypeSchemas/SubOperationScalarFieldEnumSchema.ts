import { z } from 'zod'

export const SubOperationScalarFieldEnumSchema = z.enum([
	'id',
	'createdAt',
	'updatedAt',
	'status',
])

export default SubOperationScalarFieldEnumSchema
