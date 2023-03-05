import { memo } from 'react'

import { tv } from 'tailwind-variants'
import { tw } from 'typewind'

import { Button } from '@/components/ui/Button'

type CellProps = {
	value: string | null | undefined
	classByValue?: Record<string, string>
}

const btnClass = tv({
	base: tw.whitespace_nowrap.w_full.font_normal.p_1.important(tw.opacity_100),
})

export const OutlinedCell = memo(({ value, classByValue }: CellProps) =>
	value ? (
		<div className={tw.p_1.flex}>
			<Button
				variant='outline'
				size='sm'
				disabled
				className={btnClass({ className: classByValue?.[value] })}
			>
				{value}
			</Button>
		</div>
	) : null
)
