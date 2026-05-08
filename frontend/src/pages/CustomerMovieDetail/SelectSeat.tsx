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
	 * ROW CONFIG
	 * ==================================================
	 */

	const rowSeatLimit: Record<
		string,
		number
	> = {
		A: 16,
		B: 15,
		C: 14,
		D: 16,
		E: 16,
		F: 16,
		G: 16,
		H: 15,
		I: 14,
	};

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
	 * GROUP SEATS
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

			Object.keys(
				rows,
			).forEach(
				(row) => {
					rows[row].sort(
						(a, b) => {
							const aNum =
								Number(
									a.seat.match(
										/\d+/,
									)?.[0],
								);

							const bNum =
								Number(
									b.seat.match(
										/\d+/,
									)?.[0],
								);

							return (
								aNum -
								bNum
							);
						},
					);

					rows[row] =
						rows[
							row
						].slice(
							0,
							rowSeatLimit[
								row
							] ??
								16,
						);
				},
			);

			return rows;
		}, [detail.seats]);

	/**
	 * ==================================================
	 * HANDLE SELECT
	 * ==================================================
	 */

	const handleSelectSeat = (
		seat: string,
	) => {
		if (
			isBooked(seat)
		) {
			toast.error(
				"Couple seat sudah dipesan",
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
					"Silahkan pilih couple seat terlebih dahulu",
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
		<div className="relative mx-auto flex min-h-screen w-full flex-col overflow-hidden bg-[#0A0A12] text-white">
			{/* ================================================== */}
			{/* BACKGROUND */}
			{/* ================================================== */}

			<div className="absolute left-1/2 top-[-120px] h-[260px] w-[260px] -translate-x-1/2 rounded-full bg-premiere-purple/20 blur-[120px]" />

			{/* ================================================== */}
			{/* HEADER */}
			{/* ================================================== */}

			<div className="relative z-20 px-5 pt-[60px]">
				<div className="flex items-center justify-between">
					<button
						type="button"
						onClick={() => {
							dispatch(
								resetTicket(),
							);

							navigate(
								"/",
							);
						}}
						className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 backdrop-blur-md"
					>
						<img
							src="/assets/images/icons/arrow-left.svg"
							className="h-5 w-5"
							alt="back"
						/>
					</button>

					<p className="text-sm font-semibold">
						Pilih Couple
						Seat
					</p>

					<div className="w-12" />
				</div>

				{/* ================================================== */}
				{/* SCREEN */}
				{/* ================================================== */}

				<div className="mt-10 flex flex-col items-center">
					<div className="relative w-full max-w-[720px]">
						<div className="absolute inset-0 rounded-b-[100px] bg-premiere-purple/20 blur-3xl" />

						<div className="relative overflow-hidden rounded-t-[999px] border border-white/10 bg-white/5 px-8 py-5 backdrop-blur-xl">
							<div className="h-[90px] w-full rounded-t-[999px] bg-gradient-to-b from-white/20 to-transparent" />
						</div>
					</div>

					<p className="mt-4 text-sm font-semibold tracking-[3px] text-white/60">
						PANGGUNG
						UTAMA
					</p>

					{/* ================================================== */}
					{/* LEGEND */}
					{/* ================================================== */}

					<div className="mt-5 flex items-center justify-center gap-6">
						<div className="flex items-center gap-2">
							<div className="h-4 w-4 rounded-md bg-[#D9D6FE]" />

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
			</div>

			{/* ================================================== */}
			{/* SEAT MAP */}
			{/* ================================================== */}

			<div className="relative mt-12 overflow-x-auto px-5 pb-40">
				{!isLoading && (
					<div className="mx-auto flex w-fit flex-col gap-5">
						{/* ================================================== */}
						{/* COLUMN NUMBER */}
						{/* ================================================== */}

						<div className="ml-[50px] flex items-center gap-3">
							{Array.from({
								length: 16,
							}).map(
								(
									_,
									index,
								) => (
									<div
										key={
											index
										}
										className={cn(
											"flex w-[114px] justify-center text-xs text-white/35",
											(index +
												1) %
												4 ===
												0 &&
												"mr-8",
										)}
									>
										{
											index +
												1
										}
									</div>
								),
							)}
						</div>

						{/* ================================================== */}
						{/* ROWS */}
						{/* ================================================== */}

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
									className="flex items-center gap-3"
								>
									{/* ROW LABEL */}

									<div className="flex w-8 justify-center text-sm font-semibold text-white/40">
										{
											row
										}
									</div>

									{/* SEAT ROW */}

									<div
										className={cn(
											"flex items-center gap-3",

											(row ===
												"B" ||
												row ===
													"H") &&
												"pl-[60px]",

											(row ===
												"C" ||
												row ===
													"I") &&
												"pl-[120px]",
										)}
									>
										{seats.map(
											(
												item,
												index,
											) => {
												const selected =
													selectedSeat ===
													item.seat;

												const booked =
													isBooked(
														item.seat,
													);

												const splitSeat =
													item.seat.split("-");

												const isSingleSeat =
													splitSeat.length === 1;

												const leftSeat =
													splitSeat[0];

												const rightSeat =
													splitSeat[1];

												return (
													<div
														key={
															item.seat
														}
														className="flex items-center"
													>
														{/* ================================================== */}
														{/* COUPLE SEAT */}
														{/* ================================================== */}

														{isSingleSeat ? (
														/* ================================================== */
														/* SINGLE SEAT */
														/* ================================================== */

														<button
															type="button"
															disabled={booked}
															onClick={() =>
																handleSelectSeat(
																	item.seat,
																)
															}
															className={cn(
																`
																	group
																	relative
																	flex
																	h-[42px]
																	w-[52px]
																	items-center
																	justify-center
																	rounded-[16px]
																	border-2
																	transition-all
																	duration-300
																`,
																selected
																	? `
																		scale-105
																		border-premiere-purple
																		bg-premiere-purple
																		shadow-[0_0_20px_rgba(124,58,237,0.8)]
																	`
																	: `
																		border-[#8B5CF6]
																		bg-[#D9D6FE]
																		hover:scale-105
																		hover:bg-[#C4B5FD]
																	`,
																booked &&
																	`
																		cursor-not-allowed
																		border-zinc-700
																		bg-zinc-800/50
																		opacity-40
																	`,
															)}
														>
															<div
																className={cn(
																	`
																		absolute
																		inset-[3px]
																		rounded-[12px]
																		border
																		border-black/10
																	`,
																	selected
																		? "bg-premiere-purple"
																		: "bg-[#E9E6FF]",
																)}
															/>

															<span
																className={cn(
																	`
																		relative
																		z-10
																		text-[10px]
																		font-semibold
																	`,
																	selected
																		? "text-white"
																		: "text-[#6D28D9]",
																)}
															>
																{leftSeat}
															</span>
														</button>
													) : (
														/* ================================================== */
														/* COUPLE SEAT */
														/* ================================================== */

														<div
															className={cn(
																`
																	relative
																	flex
																	w-[114px]
																	items-center
																	justify-between
																`,
																booked &&
																	"opacity-40",
															)}
														>
															{/* CONNECTOR */}

															<div
																className={cn(
																	`
																		absolute
																		left-1/2
																		top-1/2
																		h-[4px]
																		w-[14px]
																		-translate-x-1/2
																		-translate-y-1/2
																		rounded-full
																	`,
																	selected
																		? "bg-premiere-purple"
																		: "bg-[#8B5CF6]",
																)}
															/>

															{/* LEFT */}

															<button
																type="button"
																disabled={booked}
																onClick={() =>
																	handleSelectSeat(
																		item.seat,
																	)
																}
																className={cn(
																	`
																		group
																		relative
																		flex
																		h-[42px]
																		w-[52px]
																		items-center
																		justify-center
																		rounded-l-[16px]
																		border-2
																		transition-all
																		duration-300
																	`,
																	selected
																		? `
																			z-10
																			scale-105
																			border-premiere-purple
																			bg-premiere-purple
																			shadow-[0_0_20px_rgba(124,58,237,0.8)]
																		`
																		: `
																			border-[#8B5CF6]
																			bg-[#D9D6FE]
																			hover:scale-105
																			hover:bg-[#C4B5FD]
																		`,
																	booked &&
																		`
																			cursor-not-allowed
																			border-zinc-700
																			bg-zinc-800/50
																		`,
																)}
															>
																<div
																	className={cn(
																		`
																			absolute
																			inset-[3px]
																			rounded-l-[12px]
																			border
																			border-black/10
																		`,
																		selected
																			? "bg-premiere-purple"
																			: "bg-[#E9E6FF]",
																	)}
																/>

																<span
																	className={cn(
																		`
																			relative
																			z-10
																			text-[10px]
																			font-semibold
																		`,
																		selected
																			? "text-white"
																			: "text-[#6D28D9]",
																	)}
																>
																	{leftSeat}
																</span>
															</button>

															{/* RIGHT */}

															<button
																type="button"
																disabled={booked}
																onClick={() =>
																	handleSelectSeat(
																		item.seat,
																	)
																}
																className={cn(
																	`
																		group
																		relative
																		flex
																		h-[42px]
																		w-[52px]
																		items-center
																		justify-center
																		rounded-r-[16px]
																		border-2
																		transition-all
																		duration-300
																	`,
																	selected
																		? `
																			z-10
																			scale-105
																			border-premiere-purple
																			bg-premiere-purple
																			shadow-[0_0_20px_rgba(124,58,237,0.8)]
																		`
																		: `
																			border-[#8B5CF6]
																			bg-[#D9D6FE]
																			hover:scale-105
																			hover:bg-[#C4B5FD]
																		`,
																	booked &&
																		`
																			cursor-not-allowed
																			border-zinc-700
																			bg-zinc-800/50
																		`,
																)}
															>
																<div
																	className={cn(
																		`
																			absolute
																			inset-[3px]
																			rounded-r-[12px]
																			border
																			border-black/10
																		`,
																		selected
																			? "bg-premiere-purple"
																			: "bg-[#E9E6FF]",
																	)}
																/>

																<span
																	className={cn(
																		`
																			relative
																			z-10
																			text-[10px]
																			font-semibold
																		`,
																		selected
																			? "text-white"
																			: "text-[#6D28D9]",
																	)}
																>
																	{rightSeat}
																</span>
															</button>
														</div>
													)}

														{/* ================================================== */}
														{/* AISLE */}
														{/* ================================================== */}

														{(() => {
															const isSpecialRow =
																row === "C" ||
																row === "I";

															const normalAisle =
																(index + 1) % 4 ===
																0;

															const specialAisle =
																[2, 6, 10].includes(
																	index,
																);

															const showAisle =
																isSpecialRow
																	? specialAisle
																	: normalAisle;

															return (
																showAisle &&
																index !==
																	seats.length -
																		1 && (
																	<div className="w-8" />
																)
															);
														})()}
													</div>
												);
											},
										)}
									</div>
								</div>
							),
						)}
					</div>
				)}
			</div>

			{/* ================================================== */}
			{/* BOTTOM NAV */}
			{/* ================================================== */}

			<div className="fixed bottom-5 left-1/2 z-50 w-full max-w-[420px] -translate-x-1/2 px-5">
				<div className="flex items-center justify-between rounded-full border border-white/10 bg-white/10 p-3 pl-6 backdrop-blur-xl">
					<div>
						<p className="text-xl font-semibold leading-[30px]">
							{selectedSeat ??
								"--"}
						</p>

						<p className="text-sm text-white/70">
							1 Couple
							Seat
						</p>
					</div>

					<button
						type="button"
						onClick={
							handleContinue
						}
						className="rounded-full bg-white px-7 py-4 font-bold text-black transition-all duration-300 hover:scale-105 hover:bg-premiere-purple hover:text-white"
					>
						Lanjutkan
					</button>
				</div>
			</div>
		</div>
	);
}