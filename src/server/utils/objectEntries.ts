export function objectEntries<T extends {}>(obj: T): ObjectEntries<T> {
	//@ts-ignore
	return Object.entries(obj)
}

type ObjectEntries<T extends {}> = {
	[K in keyof T]: [K, T[K]]
}[keyof T][]
