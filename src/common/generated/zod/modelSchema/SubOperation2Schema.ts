import { z } from 'zod'

import {
	type OperationWithRelations,
	OperationWithRelationsSchema,
} from './OperationSchema'

/////////////////////////////////////////
// SUB OPERATION 2 SCHEMA
/////////////////////////////////////////

export const SubOperation2Schema = z.object({
	id: z.string(),
	createdAt: z.date(),
	updatedAt: z.date(),
	operationId: z.string(),
	status: z.string(),
})

export type SubOperation2 = z.infer<typeof SubOperation2Schema>

// SUB OPERATION 2 RELATION SCHEMA
//------------------------------------------------------

export type SubOperation2Relations = {
	operation: OperationWithRelations
}

export type SubOperation2WithRelations = z.infer<typeof SubOperation2Schema> &
	SubOperation2Relations

export const SubOperation2WithRelationsSchema: z.ZodType<SubOperation2WithRelations> =
	SubOperation2Schema.merge(
		z.object({
			operation: z.lazy(() => OperationWithRelationsSchema),
		})
	)

export default SubOperation2Schema
