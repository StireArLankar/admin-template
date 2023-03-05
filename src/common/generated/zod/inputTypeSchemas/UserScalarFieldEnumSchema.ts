import { z } from 'zod'

export const UserScalarFieldEnumSchema = z.enum([
	'id',
	'createdAt',
	'updatedAt',
	'login',
])

export default UserScalarFieldEnumSchema
