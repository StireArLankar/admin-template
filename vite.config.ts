import fs from 'node:fs'
import path from 'node:path'

import react from '@vitejs/plugin-react'
import yaml from 'js-yaml'
import { defineConfig, UserConfig } from 'vite'
import { inject } from 'vite-plugin-parse-html'
import svgr from 'vite-plugin-svgr'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig(({ mode }) => {
	const data = getData(mode)

	return {
		plugins: [
			tsconfigPaths(),
			react({ babel: { plugins: ['typewind/babel'] } }),
			svgr(),
			inject({ data }),
		],
		build: {
			outDir: 'build/client',
		},
		base: '',
		server: {
			proxy: {
				'/api': {
					target: 'http://localhost:9001',
					changeOrigin: true,
					secure: false,
				},
			},
		},
	} as UserConfig
})

const getData = (mode: string) => {
	switch (mode) {
		case 'development':
			const _path = path.join(process.cwd(), 'config', 'config.yml')
			const config: any = yaml.load(fs.readFileSync(_path, 'utf8'))

			return {
				client: JSON.stringify(config.client),
				title: 'Title',
			}

		default:
			return {
				client: '"%CLIENT_CONFIG%"',
				title: 'Title',
			}
	}
}
