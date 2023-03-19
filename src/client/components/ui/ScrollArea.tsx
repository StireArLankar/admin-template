import * as React from 'react'

import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area'
import { tv } from 'tailwind-variants'
import { tw } from 'typewind'

import classes1 from './css.module.css'

const scrollbar = tv({
	extend: tw.touch_none.select_none.transition_colors.z_10.p_['1px'],
})

const classes = tv({
	slots: {
		root: tw.relative.overflow_hidden,
		viewport: tw.block.h_full.w_full.rounded_['inherit'].flex_1.flex,
		thumb: tw.relative.flex_1.rounded_full.bg_primary_700,
		verticalScrollbar: scrollbar({
			className: tw.h_full.w_[3.5].p_['0.1rem'].border_l_transparent.border_l,
		}),
		horizontalScrollbar: scrollbar({
			className: tw.w_full.h_[3.5].p_['0.1rem'].border_t_transparent.border_t,
		}),
	},
})()

const ScrollArea = React.forwardRef<
	React.ElementRef<
		typeof ScrollAreaPrimitive.Root & { scrollTopTop: () => {} }
	>,
	React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root> & {
		noTable?: boolean
	}
>(({ className, children, noTable, ...props }, ref) => {
	const ref1 = React.useRef<HTMLDivElement>(null)

	React.useImperativeHandle(
		ref,
		() => {
			//@ts-ignore
			if (ref.current) {
				//@ts-ignore
				ref.current.scrollTopTop = () => {
					if (ref1.current) {
						ref1.current.scrollTop = 0
					}
				}
			}

			//@ts-ignore
			return ref.current as any
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[]
	)

	return (
		<ScrollAreaPrimitive.Root
			ref={ref}
			className={classes.root({ className })}
			{...props}
		>
			<ScrollAreaPrimitive.Viewport
				ref={ref1}
				className={classes.viewport({
					className: noTable ? classes1.noTable : undefined,
				})}
			>
				{children}
			</ScrollAreaPrimitive.Viewport>

			<ScrollBar orientation='horizontal' />
			<ScrollBar orientation='vertical' />

			<ScrollAreaPrimitive.Corner />
		</ScrollAreaPrimitive.Root>
	)
})

ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName

const ScrollBar = React.forwardRef<
	React.ElementRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
	React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>
>(({ className, orientation = 'vertical', ...props }, ref) => (
	<ScrollAreaPrimitive.ScrollAreaScrollbar
		ref={ref}
		orientation={orientation}
		{...props}
		className={
			orientation === 'horizontal'
				? classes.horizontalScrollbar({ className })
				: classes.verticalScrollbar({ className })
		}
	>
		<ScrollAreaPrimitive.ScrollAreaThumb
			className={classes.thumb()}
			style={
				orientation === 'horizontal' ? { height: '100%' } : { width: '100%' }
			}
		/>
	</ScrollAreaPrimitive.ScrollAreaScrollbar>
))

ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName

export { ScrollArea, ScrollBar }
