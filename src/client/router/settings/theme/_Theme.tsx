import { memo, useCallback } from 'react'

import * as colors from '@radix-ui/colors'
import { Colord, colord } from 'colord'
import { useTheme } from 'next-themes'
import { tw } from 'typewind'

import { Button, buttonVariants } from '@/components/ui/Button'
import { ScrollArea } from '@/components/ui/ScrollArea'
import { Slider } from '@/components/ui/Slider'
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
	TooltipProvider,
} from '@/components/ui/Tooltip'
import { useCustomTheme, ThemeSchema } from '@/store/customTheme'
import { useFontSize, MAX_FONT_SIZE, MIN_FONT_SIZE } from '@/store/fontSize'

const colordToToken = (val: Colord) => {
	const temp = val.toHsl()
	return `${temp.h} ${temp.s}% ${temp.l}%`
}

console.log(colors.amberDark, colors.amberDarkA)

const zxc123 = Object.entries(colors)
	.filter((item) => {
		if (item[0].endsWith('A')) {
			return false
		}

		return true
	})
	.map(([title, obj]) => {
		const arr = Object.values(obj)

		const data: ThemeSchema = {
			'--twc-link-active': colordToToken(colord(colors.cyan.cyan6)),
			'--twc-link-base': colordToToken(colord(colors.cyan.cyan5)),
			'--twc-link-contrast': colordToToken(colord(colors.cyan.cyan4)),
			'--twc-link-hover': colordToToken(colord(colors.cyan.cyan12)),

			'--twc-primary-50': colordToToken(colord(arr[10])),
			'--twc-primary-100': colordToToken(colord(arr[9])),
			'--twc-primary-200': colordToToken(colord(arr[8])),
			'--twc-primary-300': colordToToken(colord(arr[7])),
			'--twc-primary-400': colordToToken(colord(arr[6])),
			'--twc-primary-500': colordToToken(colord(arr[5])),
			'--twc-primary-600': colordToToken(colord(arr[4])),
			'--twc-primary-700': colordToToken(colord(arr[3])),
			'--twc-primary-800': colordToToken(colord(arr[2])),
			'--twc-primary-900': colordToToken(colord(arr[1])),
			'--twc-primary-1000': colordToToken(colord(arr[0])),
			'--twc-primary-text': colordToToken(colord(arr[11])),
		}

		return { title, data }
	})

const Temp = memo(() => {
	const [val, setFontSize] = useFontSize()

	const { setTheme } = useTheme()

	const [data, setCustomTheme] = useCustomTheme()

	const onClick = useCallback((data: ThemeSchema) => {
		setCustomTheme(data)
		setTheme('custom')
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return (
		<div className={tw.flex_1.flex.flex_col.p_2.h_full}>
			<div className={tw.flex.flex_row.gap_2.my_4}>
				<div className={buttonVariants({ variant: 'outline', size: 'sm' })}>
					<div className={tw.w_['4ch'].text_center}>{val}</div>
				</div>

				<Button variant='subtle' size='sm' onClick={() => setFontSize(null)}>
					Reset
				</Button>

				<Slider
					value={[val]}
					onValueChange={([val]) => setFontSize(val)}
					min={MIN_FONT_SIZE}
					max={MAX_FONT_SIZE}
				/>
			</div>

			{data && (
				<Button variant='subtle' size='sm' onClick={() => setCustomTheme(null)}>
					Delete custom theme
				</Button>
			)}

			{data && (
				<ScrollArea className={tw.p_0.bg_primary_1000.rounded_md.mt_2}>
					<div className={tw.p_2.pb_3}>
						<ThemePreivew data={data} title='Theme preview' />
					</div>
				</ScrollArea>
			)}

			<ScrollArea
				className={
					tw.p_0.max_w_full.flex_grow.basis_0.min_h_0.bg_primary_1000.rounded_md
						.mt_2
				}
			>
				<div className={tw.p_2.pt_0.pb_3}>
					{zxc123.map(({ title, data }) => (
						<ThemePreivew
							key={title}
							onClick={onClick}
							data={data}
							title={title}
						/>
					))}
				</div>
			</ScrollArea>
		</div>
	)
})

const ThemePreivew = memo(
	({
		data,
		title,
		onClick,
	}: {
		data: ThemeSchema
		title: string
		onClick?: (data: ThemeSchema) => void
	}) => {
		return (
			<div>
				<div className={tw.text_2xl.font_bold} onClick={() => onClick?.(data)}>
					{title}
				</div>

				<div className={tw.flex.gap_1.mt_2} style={data as any}>
					{Object.entries(data).map(([name]) => (
						<div className={tw.flex} key={name}>
							<TooltipProvider delayDuration={100}>
								<Tooltip>
									<TooltipTrigger
										style={{
											border: '1px solid white',
										}}
									>
										<div
											style={{
												height: '2rem',
												width: '2rem',
												border: '1px solid black',
												backgroundColor: `hsl(var(${name}))`,
											}}
										/>
									</TooltipTrigger>

									<TooltipContent>{name}</TooltipContent>
								</Tooltip>
							</TooltipProvider>
						</div>
					))}
				</div>
			</div>
		)
	}
)

export default function Item() {
	return <Temp />
}
