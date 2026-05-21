import {
	useMemo,
} from "react";

import {
	useLoaderData,
} from "react-router-dom";

import TitleHeading from "@/components/TitleHeading";

import {
	Card,
	CardContent,
} from "@/components/ui/card";

import {
	Badge,
} from "@/components/ui/badge";

import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";

import {
	cn,
} from "@/lib/utils";

type SeatMonitoring = {
	seat: string;

	status:
		| "available"
		| "booked"
		| "holding";

	user?: {
		name: string;

		email: string;
	};
};

export default function AdminSeats() {
	const seats =
		useLoaderData() as SeatMonitoring[];

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
		J: 16,
	};

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
					SeatMonitoring[]
				> = {};

			for (const seat of seats) {
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
		}, [seats]);

	return (
		<div className="space-y-6">
			<TitleHeading title="Seat Monitoring" />

			{/* ================================================== */}
			{/* LEGEND */}
			{/* ================================================== */}

			<div className="flex flex-wrap items-center gap-3">
				<Badge
					variant="outline"
					className="gap-2 py-1.5"
				>
					<div className="h-3 w-3 rounded-full bg-muted" />

					Available
				</Badge>

				<Badge
					variant="destructive"
					className="gap-2 py-1.5"
				>
					<div className="h-3 w-3 rounded-full bg-white" />

					Booked
				</Badge>

				<Badge className="gap-2 py-1.5">
					<div className="h-3 w-3 rounded-full bg-white" />

					Holding
				</Badge>
			</div>

			{/* ================================================== */}
			{/* SCREEN */}
			{/* ================================================== */}

			<Card className="overflow-hidden border-border/50 bg-gradient-to-b from-background to-muted/30">
				<CardContent className="space-y-10 p-8">
					{/* SCREEN */}

					<div className="flex flex-col items-center">
						<div className="relative w-full max-w-[700px] overflow-hidden rounded-t-[999px] border border-border bg-muted/40 px-8 py-5">
							<div className="h-[80px] w-full rounded-t-[999px] bg-gradient-to-b from-primary/20 to-transparent" />
						</div>

						<p className="mt-4 text-sm font-semibold tracking-[4px] text-muted-foreground">
							PANGGUNG
							UTAMA
						</p>
					</div>

					{/* ================================================== */}
					{/* SEAT MAP */}
					{/* ================================================== */}

					<div className="overflow-x-auto">
						<div className="mx-auto flex w-fit flex-col gap-5">
							{/* COLUMN NUMBER */}

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
												"flex w-[114px] justify-center text-xs text-muted-foreground",
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

							{/* ROWS */}

							{Object.entries(
								groupedSeats,
							).map(
								([
									row,
									rowSeats,
								]) => (
									<div
										key={
											row
										}
										className="flex items-center gap-3"
									>
										{/* ROW LABEL */}

										<div className="flex w-8 justify-center text-sm font-semibold text-muted-foreground">
											{
												row
											}
										</div>

										{/* ROW */}

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
											{rowSeats.map(
												(
													item,
													index,
												) => {
													const isBooked =
														item.status ===
														"booked";

													const isHolding =
														item.status ===
														"holding";

													const splitSeat =
														item.seat.split(
															"-",
														);

													const isSingleSeat =
														splitSeat.length ===
														1;

													const leftSeat =
														splitSeat[0];

													const rightSeat =
														splitSeat[1];

													const seatButton =
														(
															label: string,
															position:
																| "single"
																| "left"
																| "right",
														) => (
															<TooltipProvider>
																<Tooltip>
																	<TooltipTrigger
																		asChild
																	>
																		<button
																			type="button"
																			className={cn(
																				`
																					relative
																					flex
																					h-[42px]
																					w-[52px]
																					items-center
																					justify-center
																					border
																					text-[10px]
																					font-semibold
																					transition-all
																				`,
																				position ===
																					"single" &&
																					"rounded-[14px]",

																				position ===
																					"left" &&
																					"rounded-l-[14px]",

																				position ===
																					"right" &&
																					"rounded-r-[14px]",

																				isBooked &&
																					`
																						border-red-500/50
																						bg-red-500/20
																						text-red-100
																					`,

																				isHolding &&
																					`
																						border-yellow-500/50
																						bg-yellow-500/20
																						text-yellow-100
																					`,

																				!isBooked &&
																					!isHolding &&
																					`
																						border-border
																						bg-muted
																						text-foreground
																					`,
																			)}
																		>
																			{
																				label
																			}
																		</button>
																	</TooltipTrigger>

																	{isBooked && (
																		<TooltipContent className="space-y-1">
																			<p className="font-semibold">
																				Seat{" "}
																				{
																					item.seat
																				}
																			</p>

																			<p className="text-xs text-muted-foreground">
																				Booked
																				by
																			</p>

																			<p className="text-sm font-medium">
																				{
																					item
																						.user
																						?.name
																				}
																			</p>

																			<p className="text-xs text-muted-foreground">
																				{
																					item
																						.user
																						?.email
																				}
																			</p>
																		</TooltipContent>
																	)}
																</Tooltip>
															</TooltipProvider>
														);

													return (
														<div
															key={
																item.seat
															}
															className="flex items-center"
														>
															{/* SINGLE */}

															{isSingleSeat ? (
																seatButton(
																	leftSeat,
																	"single",
																)
															) : (
																<div className="relative flex w-[114px] items-center justify-between">
																	<div className="absolute left-1/2 top-1/2 h-[4px] w-[14px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-border" />

																	{
																		seatButton(
																			leftSeat,
																			"left",
																		)
																	}

																	{
																		seatButton(
																			rightSeat,
																			"right",
																		)
																	}
																</div>
															)}

															{/* AISLE */}

															{(() => {
																const isSpecialRow =
																	row ===
																		"C" ||
																	row ===
																		"I";

																const normalAisle =
																	(index +
																		1) %
																		4 ===
																	0;

																const specialAisle =
																	[
																		2,
																		6,
																		10,
																	].includes(
																		index,
																	);

																const showAisle =
																	isSpecialRow
																		? specialAisle
																		: normalAisle;

																return (
																	showAisle &&
																	index !==
																		rowSeats.length -
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
					</div>
				</CardContent>
			</Card>
		</div>
	);
}