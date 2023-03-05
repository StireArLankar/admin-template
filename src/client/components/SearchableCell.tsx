import { Search } from 'lucide-react'
import { tv } from 'tailwind-variants'
import { tw } from 'typewind'

import { Button } from '@/components/ui/Button'
import { stringToTWBgColor } from '@/utils/stringToColor'

type CellProps = {
	value: string | null | undefined
	setFilterValue: (val: string) => void

	colorize?: boolean
}

const btnClass = tv({
	base: tw.whitespace_nowrap.w_full.px_3.py_1.important(tw.opacity_100),
})

export const SearchableCell = (props: CellProps) => {
	const { colorize, value, setFilterValue } = props

	if (!value) {
		return null
	}

	return (
		<div className={tw.p_1.flex.space_x_2}>
			<Button
				variant='outline'
				size='sm'
				disabled
				style={{
					backgroundColor: colorize ? stringToTWBgColor(value) : undefined,
				}}
				className={btnClass({
					className: colorize ? tw.bg_opacity_30 : undefined,
				})}
			>
				{value}
			</Button>

			<Button
				variant='subtle'
				size='sm'
				className={tw.px_2.py_1.flex_1}
				onClick={() => setFilterValue(value)}
			>
				<Search transform='scale(0.9)' />
			</Button>
		</div>
	)
}
