import { createExpressMiddleware } from '@trpc/server/adapters/express'
import { applyWSSHandler } from '@trpc/server/adapters/ws'
import express from 'express'
import { createOpenApiExpressMiddleware } from 'trpc-openapi'
import type WebSocket from 'ws'

import { adminRouter } from './admin'

import { t } from '~/trpc/context'
import {
	createContextWithLogger,
	createWSContextWithLogger,
} from '~/trpc/context'

const router = t.router({
	admin: adminRouter,
})

export type AppRouter = typeof router

export const addTrpcRoute = async (app: express.Router) => {
	const { getLogger } = await import('~/logger')
	const { getPrismaClient } = await import('~/prisma')

	const logger = getLogger()

	const prisma = await getPrismaClient()

	const createContext = createContextWithLogger(logger, prisma)

	const middleware = createExpressMiddleware({
		router,
		createContext,
	})

	app.use('/trpc', middleware)

	const mw = createOpenApiExpressMiddleware({
		router,
		createContext,
	})

	app.use('/oas', mw)

	return router
}

export const addTRPCWsRoute = async (
	wss: WebSocket.Server<WebSocket.WebSocket>
) => {
	const { getLogger } = await import('~/logger')

	const { getPrismaClient } = await import('~/prisma')
	const prisma = await getPrismaClient()

	const logger = getLogger()

	applyWSSHandler({
		wss,
		router,
		createContext: createWSContextWithLogger(logger, prisma),
	})
}
