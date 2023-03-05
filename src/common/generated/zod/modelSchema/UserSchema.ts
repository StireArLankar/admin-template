import { z } from 'zod'

import {
	type OperationWithRelations,
	OperationWithRelationsSchema,
} from './OperationSchema'

/////////////////////////////////////////
// USER SCHEMA
/////////////////////////////////////////

export const UserSchema = z.object({
	id: z.string(),
	createdAt: z.date(),
	updatedAt: z.date(),
	login: z.string(),
})

export type User = z.infer<typeof UserSchema>

// USER RELATION SCHEMA
//------------------------------------------------------

export type UserRelations = {
	oprations: OperationWithRelations[]
}

export type UserWithRelations = z.infer<typeof UserSchema> & UserRelations

export const UserWithRelationsSchema: z.ZodType<UserWithRelations> =
	UserSchema.merge(
		z.object({
			oprations: z.lazy(() => OperationWithRelationsSchema).array(),
		})
	)

export default UserSchema
