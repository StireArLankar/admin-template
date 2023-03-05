import { Request } from 'express'
import parse from 'url-parse'

import { selectHostUrl } from '~/config/config.selectors'

export const getHostUrl = (req: Request): string => {
	const hostUrl = selectHostUrl()

	const prefix = parse(hostUrl).pathname

	const header = req.headers['x-original-url']

	const protocol = process.env.TS_NODE_DEV ? 'http' : 'https'

	if (!header) {
		// const fullUrl = req.protocol + "://" + req.get("host") + prefix + "/";
		const fullUrl = protocol + '://' + req.get('host') + prefix + '/'
		return fullUrl.replace(/([^:]\/)\/+/g, '$1')
	}

	const temp = Array.isArray(header) ? header[0] : header

	const { host } = parse(temp)
	const temp2 = protocol + '://' + host + prefix + '/'
	return temp2.replace(/([^:]\/)\/+/g, '$1')
}
