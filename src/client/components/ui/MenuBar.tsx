import * as React from 'react'

import * as MenubarPrimitive from '@radix-ui/react-menubar'
import { Check, ChevronRight, Circle } from 'lucide-react'
import { tv } from 'tailwind-variants'
import { tw } from 'typewind'

const classes = tv({
	slots: {
		root: tw.flex.h_10.items_center.space_x_1.rounded_md.border.p_1
			.border_primary_500.bg_primary_800,

		trigger: tw.rounded_[
			'0.2rem'
		].py_[1.5].px_3.flex.cursor_default.select_none.items_center.text_sm.font_medium.outline_none
			.focus(tw.bg_primary_700)
			.variant('&[data-state=open]', tw.bg_primary_700),

		subContent:
			tw.z_50.overflow_hidden.rounded_md.border.border_primary_700
				.bg_primary_800.p_1.shadow_md.animate_in.slide_in_from_left_1.min_w_[
				'8rem'
			],

		content:
			tw.bg_primary_1000.border_primary_600.text_primary_400.z_50.border.p_1
				.rounded_md.shadow_md.animate_in.slide_in_from_top_1.overflow_hidden
				.min_w_['12rem'],

		chevronRight: tw.ml_auto.h_4.w_4,

		checkboxItem:
			tw.relative.flex.cursor_default.select_none.items_center.rounded_sm.py_[1.5].pl_8.pr_2.text_sm.font_medium.outline_none
				.focus(tw.bg_primary_700)
				.variant('&[data-disabled]', tw.pointer_events_none.opacity_50),

		checkboxItemSpan:
			tw.absolute.left_2.flex.h_[3.5].w_[3.5].items_center.justify_center,

		checkboxItemCheck: tw.h_4.w_4,

		radioItem:
			tw.relative.flex.cursor_default.select_none.items_center.rounded_sm.py_[1.5].pl_8.pr_2.text_sm.font_medium.outline_none
				.focus(tw.bg_primary_700)
				.variant('&[data-disabled]', tw.pointer_events_none.opacity_50),
		radioItemSpan:
			tw.absolute.left_2.flex.h_[3.5].w_[3.5].items_center.justify_center,

		radioItemCircle: tw.h_2.w_2.fill_current,

		separator: tw.mx_[-1].my_1.h_px.bg_primary_700,

		shortcut: tw.ml_auto.text_xs.tracking_widest.text_primary_500,
	},
})()

const subTriggerClass = tv({
	base: tw.flex.cursor_default.select_none.items_center.rounded_sm.py_[1.5].px_2.text_sm.font_medium.outline_none
		.focus(tw.bg_primary_700)
		.variant('&[data-state=open]', tw.bg_primary_700),

	variants: {
		inset: {
			true: tw.pl_8,
		},
	},
})

const itemClass = tv({
	base: tw.relative.flex.cursor_default.select_none.items_center.rounded_sm.py_[1.5].px_2.text_sm.font_medium.outline_none
		.focus(tw.bg_primary_700)
		.variant('&[data-disabled]', tw.pointer_events_none.opacity_50),

	variants: {
		inset: {
			true: tw.pl_8,
		},
	},
})

const labelClass = tv({
	base: tw.px_2.py_[1.5].text_sm.font_semibold.text_primary_300,

	variants: {
		inset: {
			true: tw.pl_8,
		},
	},
})

const MenubarMenu = MenubarPrimitive.Menu

const MenubarGroup = MenubarPrimitive.Group

const MenubarPortal = MenubarPrimitive.Portal

const MenubarSub = MenubarPrimitive.Sub

const MenubarRadioGroup = MenubarPrimitive.RadioGroup

const Menubar = React.forwardRef<
	React.ElementRef<typeof MenubarPrimitive.Root>,
	React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Root>
>(({ className, ...props }, ref) => (
	<MenubarPrimitive.Root
		ref={ref}
		className={classes.root({ className })}
		{...props}
	/>
))
Menubar.displayName = MenubarPrimitive.Root.displayName

const MenubarTrigger = React.forwardRef<
	React.ElementRef<typeof MenubarPrimitive.Trigger>,
	React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Trigger>
>(({ className, ...props }, ref) => (
	<MenubarPrimitive.Trigger
		ref={ref}
		className={classes.trigger({ className })}
		{...props}
	/>
))
MenubarTrigger.displayName = MenubarPrimitive.Trigger.displayName

const MenubarSubTrigger = React.forwardRef<
	React.ElementRef<typeof MenubarPrimitive.SubTrigger>,
	React.ComponentPropsWithoutRef<typeof MenubarPrimitive.SubTrigger> & {
		inset?: boolean
	}
>(({ className, inset, children, ...props }, ref) => (
	<MenubarPrimitive.SubTrigger
		ref={ref}
		className={subTriggerClass({ className, inset })}
		{...props}
	>
		{children}
		<ChevronRight className={classes.chevronRight()} />
	</MenubarPrimitive.SubTrigger>
))
MenubarSubTrigger.displayName = MenubarPrimitive.SubTrigger.displayName

const MenubarSubContent = React.forwardRef<
	React.ElementRef<typeof MenubarPrimitive.SubContent>,
	React.ComponentPropsWithoutRef<typeof MenubarPrimitive.SubContent>
>(({ className, ...props }, ref) => (
	<MenubarPrimitive.SubContent
		ref={ref}
		className={classes.subContent({ className })}
		{...props}
	/>
))
MenubarSubContent.displayName = MenubarPrimitive.SubContent.displayName

const MenubarContent = React.forwardRef<
	React.ElementRef<typeof MenubarPrimitive.Content>,
	React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Content>
>(
	(
		{ className, align = 'start', alignOffset = -4, sideOffset = 8, ...props },
		ref
	) => (
		<MenubarPrimitive.Portal>
			<MenubarPrimitive.Content
				ref={ref}
				align={align}
				alignOffset={alignOffset}
				sideOffset={sideOffset}
				className={classes.content({ className })}
				{...props}
			/>
		</MenubarPrimitive.Portal>
	)
)
MenubarContent.displayName = MenubarPrimitive.Content.displayName

const MenubarItem = React.forwardRef<
	React.ElementRef<typeof MenubarPrimitive.Item>,
	React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Item> & {
		inset?: boolean
	}
>(({ className, inset, ...props }, ref) => (
	<MenubarPrimitive.Item
		ref={ref}
		className={itemClass({ className, inset })}
		{...props}
	/>
))
MenubarItem.displayName = MenubarPrimitive.Item.displayName

const MenubarCheckboxItem = React.forwardRef<
	React.ElementRef<typeof MenubarPrimitive.CheckboxItem>,
	React.ComponentPropsWithoutRef<typeof MenubarPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
	<MenubarPrimitive.CheckboxItem
		ref={ref}
		className={classes.checkboxItem({ className })}
		checked={checked}
		{...props}
	>
		<span className={classes.checkboxItemSpan()}>
			<MenubarPrimitive.ItemIndicator>
				<Check className={classes.checkboxItemCheck()} />
			</MenubarPrimitive.ItemIndicator>
		</span>
		{children}
	</MenubarPrimitive.CheckboxItem>
))
MenubarCheckboxItem.displayName = MenubarPrimitive.CheckboxItem.displayName

const MenubarRadioItem = React.forwardRef<
	React.ElementRef<typeof MenubarPrimitive.RadioItem>,
	React.ComponentPropsWithoutRef<typeof MenubarPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
	<MenubarPrimitive.RadioItem
		ref={ref}
		className={classes.radioItem({ className })}
		{...props}
	>
		<span className={classes.radioItemSpan()}>
			<MenubarPrimitive.ItemIndicator>
				<Circle className={classes.radioItemCircle()} />
			</MenubarPrimitive.ItemIndicator>
		</span>
		{children}
	</MenubarPrimitive.RadioItem>
))
MenubarRadioItem.displayName = MenubarPrimitive.RadioItem.displayName

const MenubarLabel = React.forwardRef<
	React.ElementRef<typeof MenubarPrimitive.Label>,
	React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Label> & {
		inset?: boolean
	}
>(({ className, inset, ...props }, ref) => (
	<MenubarPrimitive.Label
		ref={ref}
		className={labelClass({ className, inset })}
		{...props}
	/>
))
MenubarLabel.displayName = MenubarPrimitive.Label.displayName

const MenubarSeparator = React.forwardRef<
	React.ElementRef<typeof MenubarPrimitive.Separator>,
	React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Separator>
>(({ className, ...props }, ref) => (
	<MenubarPrimitive.Separator
		ref={ref}
		className={classes.separator({ className })}
		{...props}
	/>
))
MenubarSeparator.displayName = MenubarPrimitive.Separator.displayName

type MenubarShortcutProps = React.HTMLAttributes<HTMLSpanElement>
const MenubarShortcut = ({ className, ...props }: MenubarShortcutProps) => (
	<span {...props} className={classes.shortcut({ className })} />
)
MenubarShortcut.displayname = 'MenubarShortcut'

export {
	Menubar,
	MenubarMenu,
	MenubarTrigger,
	MenubarContent,
	MenubarItem,
	MenubarSeparator,
	MenubarLabel,
	MenubarCheckboxItem,
	MenubarRadioGroup,
	MenubarRadioItem,
	MenubarPortal,
	MenubarSubContent,
	MenubarSubTrigger,
	MenubarGroup,
	MenubarSub,
	MenubarShortcut,
}
