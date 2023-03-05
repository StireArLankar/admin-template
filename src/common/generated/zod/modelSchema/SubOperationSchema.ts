import { z } from 'zod'

import {
	type OperationWithRelations,
	OperationWithRelationsSchema,
} from './OperationSchema'

/////////////////////////////////////////
// SUB OPERATION SCHEMA
/////////////////////////////////////////

export const SubOperationSchema = z.object({
	id: z.string(),
	createdAt: z.date(),
	updatedAt: z.date(),
	status: z.string(),
})

export type SubOperation = z.infer<typeof SubOperationSchema>

// SUB OPERATION RELATION SCHEMA
//------------------------------------------------------

export type SubOperationRelations = {
	operation: OperationWithRelations
}

export type SubOperationWithRelations = z.infer<typeof SubOperationSchema> &
	SubOperationRelations

export const SubOperationWithRelationsSchema: z.ZodType<SubOperationWithRelations> =
	SubOperationSchema.merge(
		z.object({
			operation: z.lazy(() => OperationWithRelationsSchema),
		})
	)

export default SubOperationSchema
