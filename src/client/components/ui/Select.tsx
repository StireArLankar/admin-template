import * as React from 'react'

import * as SelectPrimitive from '@radix-ui/react-select'
import { Check, ChevronDown } from 'lucide-react'
import { tv } from 'tailwind-variants'
import { tw } from 'typewind'

const classes = tv({
	slots: {
		trigger:
			tw.flex.h_10.w_full.items_center.justify_between.rounded_md.border.bg_transparent.py_2.px_3.text_sm
				.placeholder(tw.text_primary_400)
				.focus(
					tw.outline_none.ring_2.ring_primary_400.ring_offset_2
						.ring_offset_primary_900
				)
				.disabled(tw.cursor_not_allowed.opacity_50).border_primary_700
				.text_primary_text,

		chevronDown: tw.h_4.w_4.opacity_50,

		content:
			tw.bg_primary_1000.relative.z_50.overflow_hidden.rounded_md.border
				.shadow_md.animate_in.fade_in_80.border_primary_600.text_primary_300
				.min_w_['8rem'],

		viewport: tw.p_1,

		label: tw.py_[1.5].pr_2.pl_8.text_sm.font_semibold.text_primary_300,

		item: tw.relative.flex.cursor_pointer.select_none.items_center.rounded_sm.py_[1.5].pr_2.pl_8.text_sm.font_medium.outline_none
			.focus(tw.bg_primary_700)
			.variant('&[data-disabled]', tw.pointer_events_none.opacity_50),

		itemSpan:
			tw.absolute.left_2.flex.h_[3.5].w_[3.5].items_center.justify_center,

		check: tw.h_4.w_4,

		separator: tw.mx_[-1].my_1.h_px.bg_primary_700,
	},
})()

const Select = SelectPrimitive.Root

const SelectGroup = SelectPrimitive.Group

const SelectValue = SelectPrimitive.Value

const SelectTrigger = React.forwardRef<
	React.ElementRef<typeof SelectPrimitive.Trigger>,
	React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger> & {
		hideArrow?: boolean
	}
>(({ className, children, hideArrow, ...props }, ref) => (
	<SelectPrimitive.Trigger
		ref={ref}
		className={classes.trigger({ className })}
		{...props}
	>
		{children}
		{hideArrow ? null : <ChevronDown className={classes.chevronDown()} />}
	</SelectPrimitive.Trigger>
))
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName

const SelectContent = React.forwardRef<
	React.ElementRef<typeof SelectPrimitive.Content>,
	React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, ...props }, ref) => (
	<SelectPrimitive.Portal>
		<SelectPrimitive.Content
			ref={ref}
			className={classes.content({ className })}
			{...props}
		>
			<SelectPrimitive.Viewport className={classes.viewport()}>
				{children}
			</SelectPrimitive.Viewport>
		</SelectPrimitive.Content>
	</SelectPrimitive.Portal>
))

SelectContent.displayName = SelectPrimitive.Content.displayName

const SelectLabel = React.forwardRef<
	React.ElementRef<typeof SelectPrimitive.Label>,
	React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
	<SelectPrimitive.Label
		ref={ref}
		className={classes.label({ className })}
		{...props}
	/>
))
SelectLabel.displayName = SelectPrimitive.Label.displayName

const SelectItem = React.forwardRef<
	React.ElementRef<typeof SelectPrimitive.Item>,
	React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
	<SelectPrimitive.Item
		ref={ref}
		className={classes.item({ className })}
		{...props}
	>
		<span className={classes.itemSpan()}>
			<SelectPrimitive.ItemIndicator>
				<Check className={classes.check()} />
			</SelectPrimitive.ItemIndicator>
		</span>

		<SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
	</SelectPrimitive.Item>
))
SelectItem.displayName = SelectPrimitive.Item.displayName

const SelectSeparator = React.forwardRef<
	React.ElementRef<typeof SelectPrimitive.Separator>,
	React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
	<SelectPrimitive.Separator
		ref={ref}
		className={classes.separator({ className })}
		{...props}
	/>
))
SelectSeparator.displayName = SelectPrimitive.Separator.displayName

export {
	Select,
	SelectGroup,
	SelectValue,
	SelectTrigger,
	SelectContent,
	SelectLabel,
	SelectItem,
	SelectSeparator,
}
