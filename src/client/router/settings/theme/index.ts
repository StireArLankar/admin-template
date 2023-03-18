import { Route } from '@tanstack/react-router'

import rootRoute from '../rootRoute'

import Component from './_Theme'

const themeRoute = new Route({
	getParentRoute: () => rootRoute,
	path: 'theme',
	component: Component,
})

export default themeRoute
