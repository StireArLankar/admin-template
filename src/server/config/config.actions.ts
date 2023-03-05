import fs from 'node:fs/promises'
import path from 'node:path'

import yaml from 'js-yaml'

import { tryToValidate } from './config.validate'
import { DevopsConfig } from './devops.zod'

type Config = {
	devopsConfig: DevopsConfig
}

let config: Config

export const getConfig = (): Config => {
	if (config) {
		return config
	}

	throw Error('Config undefined. Call readConfig() before')
}

export const readConfig = async () => {
	const devopsConfig = await readDevopsConfig()

	config = { devopsConfig }

	return config
}

export const readDevopsConfig = async (): Promise<DevopsConfig> => {
	try {
		const p = path.join(process.cwd(), 'config', 'config.local.yml')
		const res = await readAndParseConfig(p)
		return res
	} catch {
		const p = path.join(process.cwd(), 'config', 'config.yml')
		const res = await readAndParseConfig(p)
		return res
	}
}

const readAndParseConfig = async (path: string): Promise<DevopsConfig> => {
	const buffer = await fs.readFile(path)
	const parsed = yaml.load(buffer.toString())

	if (parsed !== null && typeof parsed === 'object') {
		const devops = tryToValidate(parsed)

		return devops
	}

	throw new Error('cant read yaml')
}
