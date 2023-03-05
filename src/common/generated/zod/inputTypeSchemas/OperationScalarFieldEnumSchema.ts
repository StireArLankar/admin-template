import { z } from 'zod'

export const OperationScalarFieldEnumSchema = z.enum([
	'id',
	'createdAt',
	'updatedAt',
	'userId',
	'flow',
	'status',
])

export default OperationScalarFieldEnumSchema
