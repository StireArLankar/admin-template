import { Controller, SubmitHandler, useForm } from 'react-hook-form'

import { tv } from 'tailwind-variants'
import { tw } from 'typewind'

import { ThemeToggle } from './ThemeToggle'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useAuthStore } from '@/store/auth'
import { trpc } from '@/utils/trpc'

type Inputs = {
	login: string
	password: string
}

const classes = tv({
	slots: {
		root: tw.bg_primary_800,
		inner: tw.lg(tw.py_0).flex.flex_col.items_center.justify_center.px_6.py_8
			.mx_auto.h_screen,

		inner1: tw.w_full.bg_primary_900.rounded_lg.shadow.border
			.md(tw.mt_0)
			.sm(tw.max_w_md)
			.xl(tw.p_0).border_primary_100,

		inner2: tw.p_6.space_y_4.md(tw.space_y_6).sm(tw.p_8),

		inner3: tw.flex.justify_between.items_end,

		title: tw.text_xl.font_bold.leading_tight.tracking_tight.text_gray_900.md(
			tw.text_2xl
		).text_primary_text,

		label: tw.block.mb_2.text_sm.font_medium.text_primary_200,

		form: tw.space_y_4.md(tw.space_y_6),
	},
})()

export const LoginForm = () => {
	const { setAuth } = useAuthStore()

	const { mutateAsync } = trpc.admin.auth.login.useMutation()

	const { control, handleSubmit, setError } = useForm<Inputs>()

	const onSubmit: SubmitHandler<Inputs> = async (data) => {
		try {
			const role = await mutateAsync(data)
			setAuth(role)
		} catch {
			setError('login', {
				type: 'value',
				message: 'Invalid login or password',
			})
		}
	}

	const renderForm = () => (
		<form className={classes.form()} onSubmit={handleSubmit(onSubmit)}>
			<div>
				<Controller
					name='login'
					control={control}
					defaultValue=''
					render={({ field }) => (
						<>
							<label htmlFor='login' className={classes.label()}>
								Login
							</label>

							<Input type='login' id='login' {...field} />
						</>
					)}
				/>
			</div>
			<div>
				<Controller
					name='password'
					control={control}
					defaultValue=''
					render={({ field }) => (
						<>
							<label htmlFor='password' className={classes.label()}>
								Password
							</label>

							<Input type='password' id='password' {...field} />
						</>
					)}
				/>
			</div>

			<Button type='submit' variant='subtle'>
				Sign in
			</Button>
		</form>
	)

	return (
		<section className={classes.root()}>
			<div className={classes.inner()}>
				<div className={classes.inner1()}>
					<div className={classes.inner2()}>
						<div className={classes.inner3()}>
							<h1 className={classes.title()}>Sign in</h1>

							<ThemeToggle />
						</div>

						{renderForm()}
					</div>
				</div>
			</div>
		</section>
	)
}
