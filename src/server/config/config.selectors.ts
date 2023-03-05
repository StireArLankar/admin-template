import { getConfig } from './config.actions'

export const selectProductFullName = () => getConfig().devopsConfig.service.name

export const selectProductEnv = () =>
	getConfig().devopsConfig.service.environment

export const selectHostUrl = () => getConfig().devopsConfig.service.hostUrl
