import 'express-session'

import type { PrismaClient } from '@prisma/client'
import { initTRPC, TRPCError } from '@trpc/server'
import { CreateExpressContextOptions } from '@trpc/server/adapters/express'
import { CreateWSSContextFnOptions } from '@trpc/server/adapters/ws'
import superjson from 'superjson'
import { OpenApiMeta } from 'trpc-openapi'
import { ZodError } from 'zod'

import type { AdminConfig } from '~/config/devops.zod'
import type { Logger } from '~/logger'
import { unknownToErrorMessage } from '~/utils/unknownToErrorMessage'

declare module 'express-session' {
	interface SessionData {
		user: AdminConfig[number]
	}
}

export const t = initTRPC
	.meta<OpenApiMeta>()
	.context<Context>()
	.create({
		transformer: superjson,
		errorFormatter({ shape, error }) {
			delete shape.data.stack
			delete error.stack

			return {
				...shape,
				message:
					error.cause instanceof ZodError
						? 'ZodError'
						: unknownToErrorMessage(error),
				data: {
					...shape.data,
					zodError:
						error.cause instanceof ZodError ? error.cause.flatten() : null,
				},
			}
		},
	})

export const isAuthed = t.middleware(({ next, ctx }) => {
	if (!ctx.user) {
		process.env.TS_NODE_DEV && console.log('not authed')
		throw new TRPCError({ code: 'UNAUTHORIZED' })
	}

	return next({ ctx: { ...ctx, user: ctx.user } })
})

export const createContextWithLogger =
	(logger: Logger, prisma: PrismaClient) =>
	async ({ req, res }: CreateExpressContextOptions): Promise<Context> => {
		if (req.cookies?.user_sid && !req.session?.user) {
			res.clearCookie('user_sid')
		}

		return { logger, user: req.session?.user, req, res, prisma }
	}

export const createWSContextWithLogger =
	(logger: Logger, prisma: PrismaClient) =>
	async ({ req, res }: CreateWSSContextFnOptions): Promise<Context> => {
		return { logger, req, res, prisma } as any
	}

export type Context = {
	logger: Logger
	user?: AdminConfig[number]
	prisma: PrismaClient
} & CreateExpressContextOptions

const logger = t.middleware(async ({ path, type, next, ctx }) => {
	const logger = ctx.logger

	const start = process.hrtime()

	const result = await next()

	const [seconds, nanoseconds] = process.hrtime(start)
	const duration = `${seconds + nanoseconds / 1_000_000_000}`

	if (seconds > 1) {
		const str = `${duration} -- ${path} ${type}`
		logger.warn(`LONG request timing: ${str}`)
	}

	if (!result.ok) {
		const msg =
			result.error.cause instanceof ZodError
				? JSON.stringify(result.error.cause.flatten())
				: result.error.message

		logger.warn(`${path} ${type}: ${msg}`)
	}

	return result
})

export const procedure = t.procedure.use(logger)

export const protectedProcedure = procedure.use(isAuthed)
