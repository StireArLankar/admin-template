import {
	createBrowserHistory,
	ReactRouter,
	Route,
	RouterProvider,
} from '@tanstack/react-router'

import { layoutRoute } from './layout'
import { rootRoute } from './rootRoute'

import operationsRoute from '@/router/operations'
import settingsRoute from '@/router/settings'
import subOperationsRoute from '@/router/sub-operations'

// Create an index route
const indexRoute = new Route({
	getParentRoute: () => rootRoute,
	path: '/',
	component: () => <></>,
	beforeLoad({ router }) {
		router.navigate({ to: '/operations' })
	},
})

// Create the route tree using your routes
const routeTree = rootRoute.addChildren([
	indexRoute,
	layoutRoute.addChildren([subOperationsRoute, operationsRoute, settingsRoute]),
])

// Create the router using your route tree
const router = new ReactRouter({ routeTree })

// Register your router for maximum type safety
declare module '@tanstack/react-router' {
	interface Register {
		router: typeof router
	}
}

const history = createBrowserHistory()

const getBasePath = () => {
	const baseNode = document.getElementsByTagName('base')

	const href = baseNode.item(0)?.href || '/'

	const { pathname } = new URL(href)

	return pathname
}

const basePath = getBasePath()

export default function Router() {
	return (
		<RouterProvider
			router={router}
			history={history}
			basepath={basePath === '/' ? undefined : basePath}
		/>
	)
}
