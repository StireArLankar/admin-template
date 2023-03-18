import { useCallback, useRef, useState, useSyncExternalStore } from 'react'

import * as z from 'zod'

const StorageTypes = ['localStorage', 'sessionStorage', 'none'] as const

export type StorageType = (typeof StorageTypes)[number]

const DefaultStorageType: StorageType = 'localStorage'

// window.addEventListener('storage') only works for different windows...
// so for current window we have to dispatch the event manually
// Now we can listen for both cross-window / current-window storage changes!
// see https://stackoverflow.com/a/71177640/82609
// see https://stackoverflow.com/questions/26974084/listen-for-changes-with-localstorage-on-the-same-window
function dispatchChangeEvent<T>({
	key,
	oldValue,
	newValue,
	storage,
}: {
	key: string
	oldValue: T | null
	newValue: T | null
	storage: Storage
}) {
	const event = document.createEvent('StorageEvent')
	event.initStorageEvent(
		'storage',
		false,
		false,
		key,
		oldValue as any,
		newValue as any,
		window.location.href,
		storage
	)
	window.dispatchEvent(event)
}

/**
 * Will return `null` if browser storage is unavailable (like running Docusaurus
 * in an iframe). This should NOT be called in SSR.
 *
 * @see https://github.com/facebook/docusaurus/pull/4501
 */
function getBrowserStorage(
	storageType: StorageType = DefaultStorageType
): Storage | null {
	if (typeof window === 'undefined') {
		throw new Error(
			'Browser storage is not available on Node.js/Docusaurus SSR process.'
		)
	}
	if (storageType === 'none') {
		return null
	}
	try {
		return window[storageType]
	} catch (err) {
		logOnceBrowserStorageNotAvailableWarning(err as Error)
		return null
	}
}

let hasLoggedBrowserStorageNotAvailableWarning = false
/**
 * Poor man's memoization to avoid logging multiple times the same warning.
 * Sometimes, `localStorage`/`sessionStorage` is unavailable due to browser
 * policies.
 */
function logOnceBrowserStorageNotAvailableWarning(error: Error) {
	if (!hasLoggedBrowserStorageNotAvailableWarning) {
		console.warn(
			`Docusaurus browser storage is not available.
Possible reasons: running Docusaurus in an iframe, in an incognito browser session, or using too strict browser privacy settings.`,
			error
		)
		hasLoggedBrowserStorageNotAvailableWarning = true
	}
}

// Convenient storage interface for a single storage key
export type StorageSlot<T> = {
	get: () => T
	set: (value: T) => void
	del: () => void
	listen: (onChange: (event: StorageEvent) => void) => () => void
}

const NoopStorageSlot: StorageSlot<any> = {
	get: () => null,
	set: () => {},
	del: () => {},
	listen: () => () => {},
}

// Fail-fast, as storage APIs should not be used during the SSR process
function createServerStorageSlot(key: string): StorageSlot<any> {
	function throwError(): never {
		throw new Error(`Illegal storage API usage for storage key "${key}".
Docusaurus storage APIs are not supposed to be called on the server-rendering process.
Please only call storage APIs in effects and event handlers.`)
	}

	return {
		get: throwError,
		set: throwError,
		del: throwError,
		listen: throwError,
	}
}

type Options<T> = {
	persistence?: StorageType
	schema: z.ZodType<T> | z.ZodEffects<any, T>
	default: T
}

/**
 * Creates an interface to work on a particular key in the storage model.
 * Note that this function only initializes the interface, but doesn't allocate
 * anything by itself (i.e. no side-effects).
 *
 * The API is fail-safe, since usage of browser storage should be considered
 * unreliable. Local storage might simply be unavailable (iframe + browser
 * security) or operations might fail individually. Please assume that using
 * this API can be a no-op. See also https://github.com/facebook/docusaurus/issues/6036
 */
export function createStorageSlot<T>(
	key: string,
	options: Options<T>
): StorageSlot<T> {
	if (typeof window === 'undefined') {
		return createServerStorageSlot(key)
	}

	const storage = getBrowserStorage(options?.persistence)

	if (storage === null) {
		return NoopStorageSlot
	}

	return {
		get: () => {
			try {
				const val = storage.getItem(key)
				return options.schema.parse(val)
			} catch (err) {
				console.error(`Docusaurus storage error, can't get key=${key}`, err)

				try {
					if (options.default) {
						storage.setItem(key, JSON.stringify(options.default))
					} else {
						storage.removeItem(key)
					}
				} catch {}

				return options.default
			}
		},
		set: (newValue) => {
			try {
				const oldValue = (() => {
					try {
						return options.schema.parse(storage.getItem(key))
					} catch {
						return options.default
					}
				})()

				if (newValue) {
					storage.setItem(key, JSON.stringify(newValue))
				} else {
					storage.removeItem(key)
				}

				dispatchChangeEvent<T>({
					key,
					oldValue,
					newValue,
					storage,
				})
			} catch (err) {
				console.error(
					`Docusaurus storage error, can't set ${key}=${newValue}`,
					err
				)
			}
		},
		del: () => {
			try {
				const oldValue = storage.getItem(key)
				storage.removeItem(key)
				dispatchChangeEvent({ key, oldValue, newValue: null, storage })
			} catch (err) {
				console.error(`Docusaurus storage error, can't delete key=${key}`, err)
			}
		},
		listen: (onChange) => {
			try {
				const listener = (event: StorageEvent) => {
					if (event.storageArea === storage && event.key === key) {
						onChange(event)
					}
				}
				window.addEventListener('storage', listener)
				return () => window.removeEventListener('storage', listener)
			} catch (err) {
				console.error(
					`Docusaurus storage error, can't listen for changes of key=${key}`,
					err
				)
				return () => {}
			}
		},
	}
}

export function useLocalStorage<T>(
	key: string | null,
	options: Options<T>
): [T, StorageSlot<T>] {
	// Not ideal but good enough: assumes storage slot config is constant
	const [storageSlot] = useState(() => {
		if (key === null) {
			return NoopStorageSlot as StorageSlot<T>
		}

		return createStorageSlot<T>(key, options)
	})

	const listen: StorageSlot<T>['listen'] = useCallback(
		(onChange) => {
			// Do not try to add a listener during SSR
			if (typeof window === 'undefined') {
				return () => {}
			}

			return storageSlot.listen(onChange)
		},
		[storageSlot]
	)

	const currentRef = useRef(storageSlot.get())

	const currentValue = useSyncExternalStore(
		listen,
		() => {
			if (
				JSON.stringify(currentRef.current) !== JSON.stringify(storageSlot.get())
			) {
				currentRef.current = storageSlot.get()
			}

			return currentRef.current
		},
		() => options.default
	)

	return [currentValue, storageSlot]
}

/**
 * Returns a list of all the keys currently stored in browser storage,
 * or an empty list if browser storage can't be accessed.
 */
export function listStorageKeys(
	storageType: StorageType = DefaultStorageType
): string[] {
	const browserStorage = getBrowserStorage(storageType)
	if (!browserStorage) {
		return []
	}

	const keys: string[] = []
	for (let i = 0; i < browserStorage.length; i += 1) {
		const key = browserStorage.key(i)
		if (key !== null) {
			keys.push(key)
		}
	}
	return keys
}
