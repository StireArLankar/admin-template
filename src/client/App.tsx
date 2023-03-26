import './global'
import './index.css'

import { memo, useEffect, useLayoutEffect } from 'react'

import { ThemeProvider, useTheme } from 'next-themes'
import { tw } from 'typewind'

import { useCustomTheme } from './store/customTheme'

import Router from '@/router'
import { useFontSize } from '@/store/fontSize'
import TRPCProvider from '@/utils/trpc'

const rootClass =
	tw.flex_col.flex.min_h_screen.max_h_screen.bg_primary_1000.font_sans
		.text_primary_text.antialiased

function App() {
	const [fontSize] = useFontSize()

	const [val] = useCustomTheme()

	useLayoutEffect(() => {
		document.documentElement.style.setProperty('font-size', fontSize + 'px')
	}, [fontSize])

	return (
		<ThemeProvider
			attribute='data-theme'
			disableTransitionOnChange
			themes={val ? ['dark', 'light', 'custom'] : ['dark', 'light']}
			// themes={['dark', 'light']}
		>
			<CustomThemeControlller />
			<TRPCProvider>
				<div className={rootClass}>
					<Router />
				</div>
			</TRPCProvider>
		</ThemeProvider>
	)
}

const CustomThemeControlller = memo(() => {
	const { theme, setTheme } = useTheme()

	const [data] = useCustomTheme()

	useEffect(() => {
		if (theme !== 'custom') {
			return
		}

		if (!data) {
			setTheme('system')
			return
		}

		const zxc = Object.entries(data)

		zxc.forEach((v) => document.documentElement.style.setProperty(v[0], v[1]))

		return () => {
			zxc.forEach((v) => document.documentElement.style.removeProperty(v[0]))
		}
	}, [theme, data, setTheme])

	return null
})

export default App
