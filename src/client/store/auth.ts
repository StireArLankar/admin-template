import { create } from 'zustand'
import { combine } from 'zustand/middleware'

type State = {
	auth: typeof window.__clientConfig__.role
}

const initialState: State = {
	auth: window.__clientConfig__.role,
}

export const useAuthStore = create(
	combine(initialState, (set) => ({
		setAuth: (auth: State['auth']) => set({ auth }),
	}))
)
