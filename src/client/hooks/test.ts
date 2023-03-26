import { SetStateAction } from 'react'

import { atom } from 'jotai/vanilla'
import type { WritableAtom } from 'jotai/vanilla'
import * as z from 'zod'

export type Options<T> = {
	schema: z.ZodType<T> | z.ZodEffects<any, T>
	default: T
	key: string
}

export function atomWithStorage<Value>(
	options: Options<Value>
): WritableAtom<Value, [SetStateAction<Value | null>], void> {
	const baseAtom = (() => {
		const value = localStorage.getItem(options.key)

		try {
			const val = options.schema.parse(value)
			return atom(val)
		} catch {}

		return atom(options.default)
	})()

	baseAtom.onMount = (setAtom) => {
		const storageEventCallback = (e: StorageEvent) => {
			if (e.key !== options.key) {
				return
			}

			if (e.newValue === null) {
				try {
					const val = options.schema.parse(e.newValue)
					setAtom(val)
				} catch {
					setAtom(options.default)
				}

				return
			}

			try {
				const val = options.schema.parse(JSON.parse(e.newValue))
				setAtom(val)
			} catch {
				setAtom(options.default)
			}
		}

		window.addEventListener('storage', storageEventCallback)

		return () => {
			window.removeEventListener('storage', storageEventCallback)
		}
	}

	const anAtom = atom(
		(get) => get(baseAtom),
		(get, set, update) => {
			const nextValue: Value =
				// @ts-ignore
				typeof update === 'function' ? update(get(baseAtom)) : update

			if (nextValue === null) {
				localStorage.removeItem(options.key)
				set(baseAtom, options.default)
				return
			}

			try {
				const parsed = options.schema.parse(nextValue)
				set(baseAtom, parsed)
				localStorage.setItem(options.key, JSON.stringify(parsed))
			} catch {}
		}
	)

	return anAtom
}
