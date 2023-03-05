import { build } from 'esbuild'

build({
	entryPoints: ['./src/server/index.ts'],
	tsconfig: './src/server/tsconfig.json',
	bundle: true,
	outfile: './build/server.js',
	platform: 'node',
	metafile: true,
})
	.then((res) => {
		console.log(Object.keys(res.metafile.outputs))
		process.exit(0)
	})
	.catch(() => process.exit(1))
