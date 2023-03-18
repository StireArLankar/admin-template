import * as React from 'react'

import * as SliderPrimitive from '@radix-ui/react-slider'
import { tv } from 'tailwind-variants'
import { tw } from 'typewind'

const classes = tv({
	slots: {
		root: tw.relative.flex.w_full.touch_none.select_none.items_center,
		track:
			tw.relative.h_2.w_full.grow.overflow_hidden.rounded_full.bg_primary_700,
		range: tw.absolute.h_full.bg_primary_400,
		thumb:
			tw.block.h_5.w_5.rounded_full.border_2.border_primary_800.bg_primary_400.transition_colors
				.focus(tw.outline_none.ring_2.ring_primary_800.ring_offset_2)
				.disabled(tw.pointer_events_none.opacity_50),
	},
})()

const Slider = React.forwardRef<
	React.ElementRef<typeof SliderPrimitive.Root>,
	React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
	<SliderPrimitive.Root
		ref={ref}
		className={classes.root({ className })}
		{...props}
	>
		<SliderPrimitive.Track className={classes.track()}>
			<SliderPrimitive.Range className={classes.range()} />
		</SliderPrimitive.Track>

		<SliderPrimitive.Thumb className={classes.thumb()} />
	</SliderPrimitive.Root>
))

Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
