import { Outlet, RootRoute } from '@tanstack/react-router'

import { LoginForm } from '@/components/LoginForm'
import { useAuthStore } from '@/store/auth'

const Root = () => {
	const { auth } = useAuthStore()

	if (auth) {
		return <Outlet />
	}

	return <LoginForm />
}

export const rootRoute = new RootRoute({
	component: Root,
})
