import { colord } from 'colord'

// function to convert string to color
export const stringToColor = (str: string) => {
	let hash = 0

	for (let i = 0; i < str.length; i++) {
		hash = str.charCodeAt(i) + ((hash << 5) - hash)
	}

	let color = '#'

	for (let i = 0; i < 3; i++) {
		const value = (hash >> (i * 8)) & 0xff
		color += ('00' + value.toString(16)).substr(-2)
	}

	return color
}

const resByStr = new Map<string, string>()

export const stringToTWBgColor = (str: string) => {
	const valInCache = resByStr.get(str)

	if (valInCache) {
		return valInCache
	}

	const bgColor = colord(stringToColor(str))

	const rgb = bgColor.toRgb()

	const res = `rgb(${rgb.r} ${rgb.g} ${rgb.b} / var(--tw-bg-opacity))`

	resByStr.set(str, res)

	return res
}
