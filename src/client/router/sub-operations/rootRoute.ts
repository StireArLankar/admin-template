import { Route } from '@tanstack/react-router'

import { layoutRoute as rootRoute } from '@/router/layout'

export default new Route({
	getParentRoute: () => rootRoute,
	path: '/sub-operations',
})
