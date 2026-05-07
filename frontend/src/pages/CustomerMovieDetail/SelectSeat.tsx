import { useCallback, useMemo, useState } from "react";

import "../../customer.css";

import {
	useLoaderData,
	useNavigate,
} from "react-router-dom";

import type { LoaderData } from ".";

import {
	useAppDispatch,
	useAppSelector,
} from "@/redux/hooks";

import { cn } from "@/lib/utils";

import { useQuery } from "@tanstack/react-query";

import { checkSeats } from "@/services/global/global.service";

import {
	resetTicket,
	setMovieDetail,
	setTicketDetail,
} from "@/redux/features/ticket/ticketSlice";

import { toast } from "react-hot-toast";

export default function SelectSeat() {
	const { detail } =
		useLoaderData() as LoaderData;

	const dispatch =
		useAppDispatch();

	const navigate =
		useNavigate();

	const detailTicket =
		useAppSelector(
			(state) =>
				state.ticket.detail,
		);

	/**
	 * ==================================================
	 * STATE
	 * ==================================================
	 */

	const [
		selectedSeat,
		setSelectedSeat,
	] = useState<
		string | null
	>(null);

	/**
	 * ==================================================
	 * GET BOOKED SEATS
	 * ==================================================
	 */

	const {
		isLoading,
		data,
	} = useQuery({
		queryKey: [
			"selected-seats",
			detail._id,
			detailTicket?.time,
		],

		queryFn: () =>
			checkSeats(
				detail._id,
				detailTicket?.time ??
					"",
			),
	});

	/**
	 * ==================================================
	 * CHECK BOOKED
	 * ==================================================
	 */

	const isBooked =
		useCallback(
			(seat: string) => {
				if (isLoading)
					return false;

				return !!data?.data.find(
					(
						val,
					) =>
						val.seat ===
						seat,
				);
			},
			[
				data?.data,
				isLoading,
			],
		);

	/**
	 * ==================================================
	 * GROUP SEATS BY ROW
	 * ==================================================
	 */

	const groupedSeats =
		useMemo(() => {
			const rows:
				Record<
					string,
					typeof detail.seats
				> = {};

			for (const seat of detail.seats) {
				const row =
					seat.seat.charAt(
						0,
					);

				if (
					!rows[row]
				) {
					rows[row] =
						[];
				}

				rows[row].push(
					seat,
				);
			}

			return rows;
		}, [detail.seats]);

	/**
	 * ==================================================
	 * HANDLE SELECT SEAT
	 * ==================================================
	 */

	const handleSelectSeat = (
		seat: string,
	) => {
		if (
			isBooked(seat)
		) {
			toast.error(
				"Family seat sudah dipesan",
			);

			return;
		}

		if (
			selectedSeat ===
			seat
		) {
			setSelectedSeat(
				null,
			);

			return;
		}

		setSelectedSeat(
			seat,
		);
	};

	/**
	 * ==================================================
	 * HANDLE CONTINUE
	 * ==================================================
	 */

	const handleContinue =
		() => {
			if (
				!selectedSeat
			) {
				toast.error(
					"Silahkan pilih family seat terlebih dahulu",
				);

				return;
			}

			dispatch(
				setTicketDetail(
					{
						seats: [
							selectedSeat,
						],
					},
				),
			);

			dispatch(
				setMovieDetail(
					detail,
				),
			);

			navigate(
				"/transaction-ticket",
			);
		};

	return (
		<div className="relative mx-auto flex min-h-screen w-full flex-col overflow-hidden bg-[radial-gradient(circle_at_top,_#1B1B3A_0%,_#080811_45%,_#000000_100%)] text-white">
			{/* ================================================== */}
			{/* CINEMA LIGHT */}
			{/* ================================================== */}

			<div className="absolute left-1/2 top-[-140px] h-[320px] w-[320px] -translate-x-1/2 rounded-full bg-premiere-purple/30 blur-[140px]" />

			{/* ================================================== */}
			{/* HEADER */}
			{/* ================================================== */}

			<div className="relative z-20 px-5 pt-[60px]">
				<div className="flex items-center justify-between">
					<button
						type="button"
						onClick={() => {
							dispatch(resetTicket());

							navigate("/");
						}}
						className="
							flex
							h-12
							w-12
							items-center
							justify-center
							rounded-full
							border
							border-white/10
							bg-white/10
							backdrop-blur-xl
							transition-all
							duration-300
							hover:scale-105
							hover:bg-white
						"
					>
						<img
							src="/assets/images/icons/arrow-left.svg"
							className="h-5 w-5"
							alt="back"
						/>
					</button>

					<div className="text-center">
						<p className="mx-auto text-center text-sm font-semibold">
							Pilih Family Seat
						</p>
					</div>

					<div className="w-12" />
				</div>

				{/* ================================================== */}
				{/* SCREEN */}
				{/* ================================================== */}

				<div className="relative mt-12 flex flex-col items-center">
					<div className="absolute top-0 h-[160px] w-[80%] rounded-full bg-white/10 blur-3xl" />

					<div className="relative w-full max-w-[780px] overflow-hidden rounded-t-[999px] border border-white/10 bg-white/5 px-10 py-6 backdrop-blur-2xl">
						<div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent" />

						<img
							src="/assets/images/thumbnails/th3.png"
							className="h-[140px] w-full rounded-t-[999px] object-cover opacity-40"
							alt="screen"
						/>

						<div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/80" />
					</div>

					<div className="mt-5 h-[4px] w-[70%] rounded-full bg-gradient-to-r from-transparent via-premiere-purple to-transparent shadow-[0_0_40px_rgba(124,58,237,0.9)]" />

					<p className="mt-4 text-sm font-semibold tracking-[3px] text-white/70">
						PANGGUNG UTAMA
					</p>
				</div>
			</div>

			{/* ================================================== */}
			{/* SEATS */}
			{/* ================================================== */}

			<div className="relative z-10 mt-16 overflow-x-auto px-5 pb-40">
				{!isLoading && (
					<div className="mx-auto flex w-fit flex-col gap-7">
						{Object.entries(
							groupedSeats,
						).map(
							([
								row,
								seats,
							]) => (
								<div
									key={
										row
									}
									className="flex items-center gap-5"
								>
									{/* ROW LABEL */}

									<div className="flex h-[110px] w-10 items-center justify-center text-lg font-bold text-white/40">
										{
											row
										}
									</div>

									{/* ROW SEATS */}

									<div className="flex items-center gap-6">
										{seats.map(
											(
												item,
												i,
											) => {
												const selected =
													selectedSeat ===
													item.seat;

												const booked =
													isBooked(
														item.seat,
													);

												return (
													<button
														key={`${item.seat}-${i}`}
														type="button"
														disabled={
															booked
														}
														onClick={() =>
															handleSelectSeat(
																item.seat,
															)
														}
														className={cn(
															`
																group
																relative
																h-[110px]
																w-[138px]
																overflow-hidden
																rounded-[34px]
																border
																transition-all
																duration-500
															`,
															booked &&
																`
																	cursor-not-allowed
																	border-zinc-800
																	bg-zinc-900/30
																	opacity-40
																`,
															selected &&
																`
																	scale-105
																	border-premiere-purple
																	bg-premiere-purple/20
																	shadow-[0_0_45px_rgba(124,58,237,0.75)]
																`,
															!selected &&
																!booked &&
																`
																	border-white/10
																	bg-white/[0.04]
																	backdrop-blur-xl
																	hover:-translate-y-1
																	hover:border-premiere-purple/60
																	hover:bg-white/[0.08]
																`,
														)}
													>
														{/* GLOW */}

														<div
															className={cn(
																`
																	absolute
																	inset-0
																	opacity-0
																	transition-all
																	duration-500
																`,
																selected &&
																	"opacity-100",
															)}
														>
															<div className="absolute left-1/2 top-1/2 h-[120px] w-[120px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-premiere-purple/40 blur-3xl" />
														</div>

														{/* ================================================== */}
														{/* PREMIUM SOFA */}
														{/* ================================================== */}

														<div className="absolute inset-0 flex items-center justify-center">
															<div className="relative flex items-end gap-[5px]">
																{/* LEFT */}

																<div
																	className={cn(
																		`
																			relative
																			h-[54px]
																			w-[46px]
																			rounded-t-[20px]
																			rounded-b-[16px]
																			border
																			border-white/10
																			bg-gradient-to-b
																			from-zinc-100
																			via-zinc-300
																			to-zinc-500
																			shadow-inner
																			transition-all
																			duration-500
																		`,
																		selected &&
																			`
																				from-violet-100
																				via-violet-300
																				to-premiere-purple
																				border-premiere-purple
																			`,
																	)}
																>
																	<div className="absolute left-1/2 top-[8px] h-[8px] w-[60%] -translate-x-1/2 rounded-full bg-black/10" />

																	<div className="absolute bottom-[-6px] left-1/2 h-[7px] w-[75%] -translate-x-1/2 rounded-full bg-black/40" />
																</div>

																{/* RIGHT */}

																<div
																	className={cn(
																		`
																			relative
																			h-[54px]
																			w-[46px]
																			rounded-t-[20px]
																			rounded-b-[16px]
																			border
																			border-white/10
																			bg-gradient-to-b
																			from-zinc-100
																			via-zinc-300
																			to-zinc-500
																			shadow-inner
																			transition-all
																			duration-500
																		`,
																		selected &&
																			`
																				from-violet-100
																				via-violet-300
																				to-premiere-purple
																				border-premiere-purple
																			`,
																	)}
																>
																	<div className="absolute left-1/2 top-[8px] h-[8px] w-[60%] -translate-x-1/2 rounded-full bg-black/10" />

																	<div className="absolute bottom-[-6px] left-1/2 h-[7px] w-[75%] -translate-x-1/2 rounded-full bg-black/40" />
																</div>
															</div>
														</div>

														{/* ================================================== */}
														{/* CONTENT */}
														{/* ================================================== */}

														<div className="relative z-20 flex h-full flex-col items-center justify-end pb-4">
															<p className="text-lg font-bold">
																{item.seat}
															</p>

															<p className="text-[11px] text-white/70">
																Family Seat
															</p>
														</div>
													</button>
												);
											},
										)}
									</div>
								</div>
							),
						)}
					</div>
				)}

				{/* ================================================== */}
				{/* LEGEND */}
				{/* ================================================== */}

				<div className="mt-14 flex flex-wrap items-center justify-center gap-6">
					<div className="flex items-center gap-2">
						<div className="h-4 w-4 rounded-md bg-white" />

						<p className="text-xs font-semibold text-white/70">
							Tersedia
						</p>
					</div>

					<div className="flex items-center gap-2">
						<div className="h-4 w-4 rounded-md bg-zinc-700" />

						<p className="text-xs font-semibold text-white/70">
							Terpesan
						</p>
					</div>

					<div className="flex items-center gap-2">
						<div className="h-4 w-4 rounded-md bg-premiere-purple" />

						<p className="text-xs font-semibold text-white/70">
							Dipilih
						</p>
					</div>
				</div>
			</div>

			{/* ================================================== */}
			{/* BOTTOM NAV */}
			{/* ================================================== */}

			<div className="fixed bottom-5 left-1/2 z-50 w-full max-w-[460px] -translate-x-1/2 px-5">
				<div
					className="
						relative
						overflow-hidden
						rounded-[32px]
						border
						border-white/10
						bg-white/[0.08]
						p-4
						backdrop-blur-2xl
					"
				>
					<div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent" />

					<div className="relative flex items-center justify-between">
						<div>
							<p className="text-xl font-semibold leading-[30px]">
								{selectedSeat ??
									"--"}
							</p>

							<p className="mt-1 text-sm text-white/70">
								1 Family Seat
							</p>
						</div>

						<button
							type="button"
							onClick={
								handleContinue
							}
							className="
								rounded-full
								bg-white
								px-7
								py-4
								font-bold
								text-black
								transition-all
								duration-300
								hover:scale-105
								hover:bg-premiere-purple
								hover:text-white
							"
						>
							<span className="relative z-10">
								Lanjutkan
							</span>
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}