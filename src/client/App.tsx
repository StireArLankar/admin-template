import './index.css'
import './global'

import { ThemeProvider } from 'next-themes'
import { tw } from 'typewind'

import Router from './router'

import TRPCProvider from '@/utils/trpc'

const rootClass =
	tw.flex_col.flex.min_h_screen.max_h_screen.bg_primary_1000.font_sans
		.text_primary_text.antialiased

function App() {
	return (
		<ThemeProvider attribute='data-theme'>
			<TRPCProvider>
				<div className={rootClass}>
					<Router />
				</div>
			</TRPCProvider>
		</ThemeProvider>
	)
}

export default App
