import { Router } from 'express'

import { addTrpcRoute } from '~/trpc'

export const getApiRouter = async () => {
	const api = Router()

	addTrpcRoute(api)

	return api
}
