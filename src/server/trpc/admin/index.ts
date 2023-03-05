import { adminAuthRouter } from './auth'
import { operationsRouter } from './operations'
import { subOperationsRouter } from './subOperations'

import { t } from '~/trpc/context'

export const adminRouter = t.router({
	auth: adminAuthRouter,
	operations: operationsRouter,
	sub: subOperationsRouter,
})
