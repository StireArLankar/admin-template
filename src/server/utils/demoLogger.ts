import express from 'express'

import type { Logger } from '~/logger'

type GetDemoLogger = (logger: Logger) => express.RequestHandler
export const getDemoLogger: GetDemoLogger = (logger) => (req, res, next) => {
	res.once('finish', () => {
		const method = req.method
		const url = req.originalUrl

		if (url.includes('/trpc/')) {
			return
		}

		const status = res.statusCode
		const log = `${method}:${url} ${status}`

		logger.trace(log, { status, method })
	})

	next()
}
