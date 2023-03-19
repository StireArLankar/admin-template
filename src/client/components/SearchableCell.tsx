import { Search } from 'lucide-react'
import { tv } from 'tailwind-variants'
import { tw } from 'typewind'

import { Button, buttonVariants } from '@/components/ui/Button'
import { stringToTWBgColor } from '@/utils/stringToColor'
import { checkNever } from '~common/utils/checkNever'

type CellProps = {
	value: string | null | undefined
	setFilterValue: (val: string) => void

	colorize?: boolean | 1 | 2
}

const btnClass = tv({
	base: buttonVariants({
		className: tw.important(tw.opacity_100).whitespace_nowrap.w_full.px_3.py_1,
		size: 'sm',
		variant: 'outline',
	}),
})

const colorizeToClass = (colorize: CellProps['colorize']) => {
	switch (colorize) {
		case true:
			return tw.bg_opacity_30.hover(tw.bg_opacity_50)
		case 1:
			return tw.bg_opacity_20.hover(tw.bg_opacity_40)
		case 2:
			return tw.bg_opacity_10.hover(tw.bg_opacity_30)
		case undefined:
		case false:
			return undefined
		default:
			checkNever(colorize)
			return undefined
	}
}

export const SearchableCell = (props: CellProps) => {
	const { colorize, value, setFilterValue } = props

	if (!value) {
		return null
	}

	return (
		<div className={tw.p_1.flex.space_x_2}>
			<div
				style={{
					backgroundColor: colorize ? stringToTWBgColor(value) : undefined,
					boxShadow: 'none',
				}}
				className={btnClass({
					className: colorizeToClass(colorize),
				})}
			>
				{value}
			</div>

			<Button
				variant='subtle'
				size='sm'
				className={tw.px_2.py_1.flex_1}
				onClick={() => setFilterValue(value)}
			>
				<Search transform='scale(0.9)' className={tw.w_6.h_6} />
			</Button>
		</div>
	)
}
