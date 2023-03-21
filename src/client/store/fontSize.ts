import * as z from 'zod'

import { useLocalStorage } from '@/hooks/useLocalStorage copy'

export const DEFAULT_FONT_SIZE = 16
export const MIN_FONT_SIZE = 6
export const MAX_FONT_SIZE = 30
const FONT_SIZE_LOCAL_STORAGE_KEY = 'fontSize'

const schema = z.preprocess((val) => {
	try {
		let number: number

		if (typeof val === 'string') {
			number = parseInt(val)
		} else if (typeof val === 'number') {
			number = val
		} else {
			throw new Error('Invalid value')
		}

		if (number > MAX_FONT_SIZE) {
			return MAX_FONT_SIZE
		}

		if (number < MIN_FONT_SIZE) {
			return MIN_FONT_SIZE
		}

		return number
	} catch {
		return DEFAULT_FONT_SIZE
	}
}, z.number())

export const useFontSize = () =>
	useLocalStorage({
		schema,
		default: DEFAULT_FONT_SIZE,
		key: FONT_SIZE_LOCAL_STORAGE_KEY,
	})
