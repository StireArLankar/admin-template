import { z } from 'zod'

import {
	type SubOperation2WithRelations,
	SubOperation2WithRelationsSchema,
} from './SubOperation2Schema'
import {
	type SubOperationWithRelations,
	SubOperationWithRelationsSchema,
} from './SubOperationSchema'
import { type UserWithRelations, UserWithRelationsSchema } from './UserSchema'

/////////////////////////////////////////
// OPERATION SCHEMA
/////////////////////////////////////////

export const OperationSchema = z.object({
	id: z.string(),
	createdAt: z.date(),
	updatedAt: z.date(),
	userId: z.string(),
	flow: z.string(),
	status: z.string(),
})

export type Operation = z.infer<typeof OperationSchema>

// OPERATION RELATION SCHEMA
//------------------------------------------------------

export type OperationRelations = {
	user: UserWithRelations
	subOperation?: SubOperationWithRelations | null
	subOperation2?: SubOperation2WithRelations | null
}

export type OperationWithRelations = z.infer<typeof OperationSchema> &
	OperationRelations

export const OperationWithRelationsSchema: z.ZodType<OperationWithRelations> =
	OperationSchema.merge(
		z.object({
			user: z.lazy(() => UserWithRelationsSchema),
			subOperation: z.lazy(() => SubOperationWithRelationsSchema).nullable(),
			subOperation2: z.lazy(() => SubOperation2WithRelationsSchema).nullable(),
		})
	)

export default OperationSchema
