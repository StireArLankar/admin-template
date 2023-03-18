import * as z from 'zod'

import { useLocalStorage } from '@/hooks/useLocalStorage'

const themeSchema = z.object({
	'--twc-link-active': z.string(),
	'--twc-link-hover': z.string(),
	'--twc-link-base': z.string(),
	'--twc-link-contrast': z.string(),
	'--twc-primary-50': z.string(),
	'--twc-primary-100': z.string(),
	'--twc-primary-200': z.string(),
	'--twc-primary-300': z.string(),
	'--twc-primary-400': z.string(),
	'--twc-primary-500': z.string(),
	'--twc-primary-600': z.string(),
	'--twc-primary-700': z.string(),
	'--twc-primary-800': z.string(),
	'--twc-primary-900': z.string(),
	'--twc-primary-1000': z.string(),
	'--twc-primary-text': z.string(),
})

const CUSTOM_THEME_LOCAL_STORAGE_KEY = 'customTheme'

const schema = z.preprocess((val) => {
	if (typeof val === 'string') {
		return JSON.parse(val)
	}

	return val
}, themeSchema.nullable().catch(null))

export const useCustomTheme = () =>
	useLocalStorage(CUSTOM_THEME_LOCAL_STORAGE_KEY, {
		schema,
		default: null,
	})

export type ThemeSchema = z.infer<typeof themeSchema>
