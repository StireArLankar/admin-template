import parser from 'url-parse'

import type { AdminConfig } from '~/config/devops.zod'

export const basePath = (() => {
	const baseNode = document.getElementsByTagName('base')

	const href = baseNode.item(0)?.href || '/'

	const { pathname } = parser(href)

	return pathname
})()

declare global {
	interface Window {
		__clientConfig__: {
			role?: AdminConfig[number]['role'] | null
		}

		__clientGlobalConfig__: GlobalState

		log: typeof console.log
	}
}

window.log = () => {}

if (import.meta.env.DEV) {
	window.log = console.log

	window.__clientConfig__ = {
		role: 'admin',
	}
}

export {}
