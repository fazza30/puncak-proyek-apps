import type { MovieDetail } from "@/services/global/global.type";

import type { Theater } from "@/services/theater/theater.type";

import {
	createSlice,
	type PayloadAction,
} from "@reduxjs/toolkit";

/**
 * ==================================================
 * TICKET TYPE
 * ==================================================
 */

export type Ticket = {
	theater?: Theater;

	time?: string;

	/**
	 * family seat
	 * only 1 seat allowed
	 */
	seats?: string[];
};

/**
 * ==================================================
 * STATE TYPE
 * ==================================================
 */

export interface TicketState {
	step?:
		| "DETAIL"
		| "THEATER"
		| "TIME"
		| "SEAT";

	detail?: Ticket | null;

	movie?: MovieDetail | null;
}

/**
 * ==================================================
 * INITIAL STATE
 * ==================================================
 */

const initialState: TicketState =
	{
		step: "DETAIL",

		detail: null,

		movie: null,
	};

/**
 * ==================================================
 * SLICE
 * ==================================================
 */

export const ticketSlice =
	createSlice({
		name: "ticket",

		initialState,

		reducers: {
			/**
			 * ==================================================
			 * SET STEP
			 * ==================================================
			 */

			setStep: (
				state,
				action: PayloadAction<TicketState>,
			) => {
				state.step =
					action.payload.step;
			},

			/**
			 * ==================================================
			 * SET TICKET DETAIL
			 * ==================================================
			 */

			setTicketDetail: (
				state,
				action: PayloadAction<Ticket>,
			) => {
				state.detail = {
					...state.detail,

					...action.payload,
				};
			},

			/**
			 * ==================================================
			 * SET MOVIE DETAIL
			 * ==================================================
			 */

			setMovieDetail: (
				state,
				action: PayloadAction<MovieDetail>,
			) => {
				state.movie =
					action.payload;
			},

			/**
			 * ==================================================
			 * RESET TICKET
			 * ==================================================
			 */

			resetTicket: (
				state,
			) => {
				state.step =
					"DETAIL";

				state.detail =
					null;

				state.movie =
					null;
			},
		},
	});

/**
 * ==================================================
 * EXPORT ACTIONS
 * ==================================================
 */

export const {
	setMovieDetail,
	setStep,
	setTicketDetail,
	resetTicket,
} = ticketSlice.actions;

/**
 * ==================================================
 * EXPORT REDUCER
 * ==================================================
 */

export default ticketSlice.reducer;