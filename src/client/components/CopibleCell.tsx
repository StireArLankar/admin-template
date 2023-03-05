import copy from 'copy-to-clipboard'
import { Copy } from 'lucide-react'
import { tv } from 'tailwind-variants'
import { tw } from 'typewind'

import { Button } from '@/components/ui/Button'
import { stringToTWBgColor } from '@/utils/stringToColor'

type CellProps = {
	value: string | null | undefined
	colorize?: boolean
}

const btnClass = tv({
	base: tw.whitespace_nowrap.w_full.px_3.py_1.important(tw.opacity_100),
})

export const CopibleCell = (props: CellProps) => {
	const { colorize, value } = props

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
				onClick={() => copy(value)}
			>
				<Copy transform='scale(0.9)' />
			</Button>
		</div>
	)
}
