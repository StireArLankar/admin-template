import * as React from 'react'

import * as TabsPrimitive from '@radix-ui/react-tabs'
import { tv } from 'tailwind-variants'
import { tw } from 'typewind'

const Tabs = TabsPrimitive.Root

const classes = tv({
	slots: {
		list: tw.bg_primary_700.dark(tw.bg_primary_800).border_primary_500
			.inline_flex.items_center.border.justify_center.rounded_md.p_1,

		trigger:
			tw.inline_flex.items_center.justify_center.text_sm.font_medium.transition_all
				.disabled(tw.pointer_events_none.opacity_50)
				.text_primary_200.variant(
					'&[data-state=active]',
					tw.bg_primary_1000.text_primary_text
				).rounded_['0.285rem'].px_3.py_[1.5],

		content: tw.mt_2.rounded_md.border.border_primary_600.p_6.variant(
			'&[data-state=inactive]',
			tw.hidden
		),
	},
})()

const TabsList = React.forwardRef<
	React.ElementRef<typeof TabsPrimitive.List>,
	React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
	<TabsPrimitive.List
		ref={ref}
		className={classes.list({ className })}
		{...props}
	/>
))
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = React.forwardRef<
	React.ElementRef<typeof TabsPrimitive.Trigger>,
	React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
	<TabsPrimitive.Trigger
		className={classes.trigger({ className })}
		{...props}
		ref={ref}
	/>
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
	React.ElementRef<typeof TabsPrimitive.Content>,
	React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
	<TabsPrimitive.Content
		className={classes.content({ className })}
		{...props}
		ref={ref}
	/>
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }
