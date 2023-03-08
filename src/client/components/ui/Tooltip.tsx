import * as React from 'react'

import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import { tv } from 'tailwind-variants'
import { tw } from 'typewind'

const TooltipProvider = TooltipPrimitive.Provider

const Tooltip = TooltipPrimitive.Root
Tooltip.displayName = TooltipPrimitive.Tooltip.displayName

const TooltipTrigger = TooltipPrimitive.Trigger

const contentClass = tv({
	base: tw.z_50.overflow_hidden.rounded_md.border.bg_primary_800.text_primary_text.border_primary_600.fade_in_50.animate_in.shadow_md.text_sm.px_3.py_[1.5]
		.variant('&[data-side=bottom]', tw.slide_in_from_top_1)
		.variant('&[data-side=top]', tw.slide_in_from_bottom_1)
		.variant('&[data-side=left]', tw.slide_in_from_right_1)
		.variant('&[data-side=right]', tw.slide_in_from_left_1),
})

const TooltipContent = React.forwardRef<
	React.ElementRef<typeof TooltipPrimitive.Content>,
	React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
	<TooltipPrimitive.Content
		ref={ref}
		sideOffset={sideOffset}
		className={contentClass({ className })}
		{...props}
	/>
))
TooltipContent.displayName = TooltipPrimitive.Content.displayName

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
