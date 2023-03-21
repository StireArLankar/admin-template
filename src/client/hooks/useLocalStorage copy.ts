import { SetStateAction } from 'react'

import { useAtom } from 'jotai'

import { atomWithStorage, Options } from './test'

const atoms: Record<string, any> = {}

export function useLocalStorage<T>(options: Options<T>) {
	if (!atoms[options.key]) {
		atoms[options.key] = atomWithStorage(options)
	}

	return useAtom<T, [SetStateAction<T | null>], void>(atoms[options.key])
}
