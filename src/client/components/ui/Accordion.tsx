import * as React from 'react'

import * as AccordionPrimitive from '@radix-ui/react-accordion'
import { ChevronDown } from 'lucide-react'
import { tv } from 'tailwind-variants'
import { tw } from 'typewind'

const Accordion = AccordionPrimitive.Root

const itemClass = tv({
	extend: tw.border_b.border_b_primary_700,
})

const AccordionItem = React.forwardRef<
	React.ElementRef<typeof AccordionPrimitive.Item>,
	React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
	<AccordionPrimitive.Item
		ref={ref}
		className={itemClass({ className })}
		{...props}
	/>
))
AccordionItem.displayName = 'AccordionItem'

const triggerClass = tv({
	base: tw.flex.flex_1.items_center.justify_between.py_4.font_medium.transition_all.text_primary_text
		.hover(tw.text_opacity_50)
		.variant('&[data-state=open]>svg', tw.rotate_180),
})

const AccordionTrigger = React.forwardRef<
	React.ElementRef<typeof AccordionPrimitive.Trigger>,
	React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
	<AccordionPrimitive.Header className={tw.flex}>
		<AccordionPrimitive.Trigger
			ref={ref}
			className={triggerClass({ className })}
			{...props}
		>
			{children}
			<ChevronDown className={tw.h_4.w_4.transition_transform.duration_200} />
		</AccordionPrimitive.Trigger>
	</AccordionPrimitive.Header>
))
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName

const contentClass = tv({
	base: tw.overflow_hidden.text_sm.transition_all
		.variant('&[data-state=open]', tw.animate_accordion_down)
		.variant('&[data-state=closed]', tw.animate_accordion_up),
})

const AccordionContent = React.forwardRef<
	React.ElementRef<typeof AccordionPrimitive.Content>,
	React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
	<AccordionPrimitive.Content
		ref={ref}
		className={contentClass({ className })}
		{...props}
	>
		<div className={tw.pt_0.pb_4}>{children}</div>
	</AccordionPrimitive.Content>
))

AccordionContent.displayName = AccordionPrimitive.Content.displayName

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
