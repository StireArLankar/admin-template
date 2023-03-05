import { Route } from '@tanstack/react-router'

import Component from './_Item'
import rootRoute from './rootRoute'

export default new Route({
	getParentRoute: () => rootRoute,
	path: '$id',
	component: Component,
})
