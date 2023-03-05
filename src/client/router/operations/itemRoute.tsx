import { Route } from '@tanstack/react-router'

import Component from './_Item'
import rootRoute from './rootRoute'

const itemRootRoute = new Route({
	getParentRoute: () => rootRoute,
	path: '$id',
	component: Component,
})

const indexRoute = new Route({
	getParentRoute: () => itemRootRoute,
	path: '/',
})

const jsonRoute = new Route({
	getParentRoute: () => itemRootRoute,
	path: '/json',
})

export default itemRootRoute.addChildren([indexRoute, jsonRoute])
