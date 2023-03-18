import { Laptop, Moon, Sun, Settings } from 'lucide-react'
import { useTheme } from 'next-themes'
import { tw } from 'typewind'

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/Tabs'

export const ThemeToggle = () => {
	const { setTheme, theme, themes } = useTheme()

	return (
		<Tabs value={theme} onValueChange={setTheme} className={tw.flex}>
			<TabsList>
				<TabsTrigger value='light'>
					<Sun className='h-4 w-4' />
					<span className={tw.hidden.md(tw.inline.ml_2)}>Light</span>
				</TabsTrigger>
				<TabsTrigger value='dark'>
					<Moon className='h-4 w-4' />
					<span className={tw.hidden.md(tw.inline.ml_2)}>Dark</span>
				</TabsTrigger>
				{themes.includes('custom') && (
					<TabsTrigger value='custom'>
						<Settings className='h-4 w-4' />
						<span className={tw.hidden.md(tw.inline.ml_2)}>Custom</span>
					</TabsTrigger>
				)}
				<TabsTrigger value='system'>
					<Laptop className='h-4 w-4' />
					<span className={tw.hidden.md(tw.inline.ml_2)}>System</span>
				</TabsTrigger>
			</TabsList>
		</Tabs>
	)
}
