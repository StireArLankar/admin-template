import { assign, createMachine } from 'xstate'

export type DatePickerContext = Partial<DatesRange>

export type DatePickerEvent =
	| { type: 'SELECT_START'; start: number }
	| { type: 'INSERT_START'; start: number }
	| { type: 'INSERT_END'; end: number }
	| { type: 'SELECT_END'; end: number }
	| { type: 'SET_RANGE'; range: DatesRange }
	| { type: 'CANCEL' }

export interface DatesRange {
	start: number
	end: number
}

type States1 =
	| { value: 'IDLE'; context: DatePickerContext }
	| { value: 'START_SELECTED'; context: DatePickerContext }
	| { value: 'DONE'; context: DatePickerContext }

export const datePickerMachine = createMachine<
	DatePickerContext,
	DatePickerEvent,
	States1
>(
	{
		id: 'date-picker',
		initial: 'IDLE',
		predictableActionArguments: true,
		context: {},
		on: {
			CANCEL: {
				target: 'IDLE',
				actions: assign((_, __) => ({ start: undefined, end: undefined })),
			},
		},
		states: {
			IDLE: {
				on: {
					INSERT_START: {
						target: 'START_SELECTED',
						actions: assign((ctx, e) => ({
							start: e.start,
							end: ctx.end && e.start > ctx.end ? undefined : ctx.end,
						})),
					},
					SELECT_START: {
						target: 'START_SELECTED',
						actions: assign((_, e) => ({ start: e.start, end: undefined })),
					},
					SET_RANGE: {
						target: 'DONE',
						actions: assign((_, e) => ({
							start: e.range.start,
							end: e.range.end,
						})),
					},
				},
			},
			START_SELECTED: {
				on: {
					INSERT_START: {
						target: 'START_SELECTED',
						actions: assign((ctx, e) => ({
							start: e.start,
							end: ctx.end && e.start > ctx.end ? undefined : ctx.end,
						})),
					},
					INSERT_END: {
						target: 'DONE',
						cond: (ctx, e) => {
							const check = ctx.start ? ctx.start < e.end : true

							return check
						},
						actions: assign((ctx, e) => ({
							start: ctx.start,
							end: e.end,
						})),
					},
					SELECT_END: {
						target: 'DONE',
						actions: assign((ctx, e) => ({
							end: ctx.start && ctx.start > e.end ? ctx.start : e.end,
							start: ctx.start && ctx.start > e.end ? e.end : ctx.start,
						})),
					},
					SET_RANGE: {
						target: 'DONE',
						actions: assign((_, e) => ({
							start: e.range.start,
							end: e.range.end,
						})),
					},
				},
			},
			DONE: {
				on: {
					INSERT_START: [
						{
							target: 'START_SELECTED',
							cond: (ctx, e) => (ctx.end ? e.start > ctx.end : true),
							actions: assign((_, e) => ({
								start: e.start,
								end: undefined,
							})),
						},
						{
							target: 'DONE',
							actions: assign((ctx, e) => ({
								start: e.start,
								end: ctx.end,
							})),
						},
					],
					SELECT_START: {
						target: 'START_SELECTED',
						actions: assign((_, e) => ({ start: e.start, end: undefined })),
					},
					SET_RANGE: {
						target: 'DONE',
						actions: assign((_, e) => ({
							start: e.range.start,
							end: e.range.end,
						})),
					},
				},
			},
		},
	},
	{
		actions: {
			cancel: () => ({ start: undefined, end: undefined }),
		},
	}
)
