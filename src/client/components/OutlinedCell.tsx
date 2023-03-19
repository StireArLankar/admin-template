import { memo, useRef } from 'react'

import { tv } from 'tailwind-variants'
import { tw } from 'typewind'

import { buttonVariants } from '@/components/ui/Button'
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/Tooltip'

type CellProps = {
	value: string | null | undefined
	classByValue?: Record<string, string>

	tooltipValue?: string
}

const btnClass = tv({
	base: buttonVariants({
		className: tw.whitespace_nowrap.w_full.font_normal.p_1.important(
			tw.opacity_100
		),
		size: 'sm',
		variant: 'outline',
	}),
})

export const OutlinedCell = memo((props: CellProps) => {
	const { value, classByValue, tooltipValue } = props

	const triggerRef = useRef<HTMLButtonElement>(null)

	if (!value) {
		return null
	}

	if (!tooltipValue) {
		return (
			<div className={tw.p_1.flex}>
				<div
					//@ts-ignore
					disabled
					style={{ boxShadow: 'none' }}
					className={btnClass({ className: classByValue?.[value] })}
				>
					{value}
				</div>
			</div>
		)
	}

	return (
		<div className={tw.p_1.flex}>
			<TooltipProvider delayDuration={200}>
				<Tooltip>
					<TooltipTrigger
						asChild
						ref={triggerRef}
						onClick={(e) => e.preventDefault()}
					>
						<div
							style={{ boxShadow: 'none' }}
							className={btnClass({
								className: classByValue?.[value],
							})}
						>
							{value}
						</div>
					</TooltipTrigger>

					<TooltipContent
						className={tw.font_bold}
						onPointerDownOutside={(e) => {
							if (e.target === triggerRef.current) {
								e.preventDefault()
							}
						}}
					>
						<p>{tooltipValue}</p>
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>
		</div>
	)
})
