export const unknownToErrorMessage = (e: unknown, def?: string): string =>
	(e instanceof Error ? e.message : JSON.stringify(e)) ||
	(def ? 'empty error ' + def : 'empty error')
