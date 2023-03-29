import { createServer } from 'node:http'
import path from 'node:path'

import cors from 'cors'
import { config } from 'dotenv'
import express from 'express'
import session from 'express-session'
import referrerPolicy from 'referrer-policy'
import parse from 'url-parse'
import { WebSocketServer } from 'ws'

import { getConfig, readConfig } from '~/config/config.actions'
import { getDemoLogger } from '~/utils/demoLogger'

declare module 'express' {
	interface Request {
		rawBody?: Buffer
	}
}

declare module 'node:http' {
	interface IncomingMessage {
		rawBody?: Buffer
	}
}

config()

const buildDir = path.join(process.cwd(), 'build', 'client')

export const initApp = async () => {
	const config = await readConfig()

	const { getLogger } = await import('~/logger')

	const logger = getLogger()

	const { service, ports } = config.devopsConfig
	const { environment, hostUrl } = service
	const { application: port, management: managementPort } = ports

	const PORT = parseInt(port.toString() || '9001', 10)

	/** Base path */
	const prefix = parse(hostUrl).pathname

	const redirect = express()
	const app = express()

	redirect.use(getDemoLogger(logger))

	const server = createServer(redirect)

	const wss = new WebSocketServer({
		server,
		path: prefix.endsWith('/') ? prefix + 'ws/socket' : prefix + '/ws/socket',
	})

	const { addTRPCWsRoute } = await import('~/trpc')

	await addTRPCWsRoute(wss)

	redirect.use(express.urlencoded({ extended: false }))

	const rawBodyMw = express.json({
		verify: (req, _, buf) => {
			req.rawBody = buf
		},
	})

	redirect.use(rawBodyMw)

	redirect.use(cors())

	redirect.use(referrerPolicy({ policy: 'no-referrer' }))

	redirect.use(prefix, app)

	const { getApiRouter } = await import('~/routes/api.router')
	const { getHostUrl, createReadHTML } = await import('~/utils')

	const sessionMiddleware = session({
		name: 'user_sid',
		secret: 'somerandonstuffs',
		resave: false,
		saveUninitialized: false,
		rolling: true,
		cookie: {
			maxAge: 24 * 60 * 60 * 1000,
		},
	})

	app.use(sessionMiddleware)

	const apiRouter = await getApiRouter()

	app.use('/api', apiRouter)

	const readFrameHTML = createReadHTML(path.join(buildDir, 'index.html'))

	const htmlHandler: express.RequestHandler = (req, res) => {
		let fullUrl = getHostUrl(req)

		try {
			fullUrl = new URL(fullUrl).pathname
		} catch {}

		const html = readFrameHTML(
			['<base href="/" />', `<base href="${fullUrl}" />`],
			[/"%GLOBAL%"/gi, JSON.stringify({ role: getRoleFromRequest(req) })],
			[/"%CLIENT_CONFIG%"/gi, JSON.stringify(config.devopsConfig.client)]
		)

		return res.send(html)
	}

	app.get('/', htmlHandler)

	app.get('/test', (req, res) => {
		const data =
			'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='

		const img = Buffer.from(data, 'base64')

		res.writeHead(200, {
			'Content-Type': 'image/png',
			'Content-Length': img.length,
		})

		res.end(img)
	})

	app.use(express.static(buildDir))

	app.get('*', htmlHandler)

	server.listen(PORT, () => {
		logger.info(`Server started on port ${PORT}`)
	})

	const managementApp = express()
	const PORT2 = parseInt(managementPort.toString() || '9000', 10)
	const server2 = createServer(managementApp)
	managementApp.get('/health', (_, res) => res.json({ health: 'ok' }))
	managementApp.get('/version', (_, res) =>
		res.json({ version: process.env.VERSION || 'local' })
	)
	if (environment === 'develop' || environment === 'stable') {
		managementApp.get('/__dev_config__', (_, res) => res.json(getConfig()))
	}
	server2.listen(PORT2, () => {
		logger.info(`Management Server started on port ${PORT2}`)
	})
}

initApp()

const getRoleFromRequest = (req: express.Request) => {
	if (!req?.session?.user) {
		return undefined
	}

	return req.session.user.role
}
