import { Route } from '@tanstack/react-router'

import Component from './_Root'

import { layoutRoute as rootRoute } from '@/router/layout'

export default new Route({
	getParentRoute: () => rootRoute,
	path: '/settings',
	component: Component,
})
