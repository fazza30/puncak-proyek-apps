import { useMemo, useState } from "react";

import {
	Link,
	Navigate,
	useNavigate,
} from "react-router-dom";

import { useDispatch } from "react-redux";

import {
	useMutation,
	useQuery,
} from "@tanstack/react-query";

import {
	dateFormat,
	rupiahFormat,
} from "@/lib/utils";

import {
	setStep,
} from "@/redux/features/ticket/ticketSlice";

import { useAppSelector } from "@/redux/hooks";

import {
	buyTicket,
	getBalance,
	transactionSchema,
	type TransactionValues,
} from "@/services/global/global.service";
import { toast } from "sonner";
import { get } from "react-hook-form";

export default function CustomerTransaction() {
	const navigate =
		useNavigate();

	const dispatch =
		useDispatch();

	const [isAgree, setIsAgree] =
		useState(false);

	/**
	 * ==================================================
	 * REDUX
	 * ==================================================
	 */

	const {
		detail,
		movie,
	} = useAppSelector(
		(state) =>
			state.ticket,
	);

	/**
	 * ==================================================
	 * BALANCE
	 * ==================================================
	 */

	const { data } = useQuery({
		queryKey: [
			"get-balance",
		],

		queryFn: () =>
			getBalance(),
	});

	/**
	 * ==================================================
	 * TRANSACTION
	 * ==================================================
	 */

	const {
		isPending,
		mutateAsync,
	} = useMutation({
		mutationFn: (
			data: TransactionValues,
		) =>
			buyTicket(
				data,
			),
	});

	/**
	 * ==================================================
	 * PRICE DETAIL
	 * ==================================================
	 */

	const detailPrice =
		useMemo(() => {
			if (
				!movie ||
				!detail
			) {
				return {
					subtotal: 0,

					ppn: 0,

					bookingFee: 0,

					total: 0,
				};
			}

			/**
			 * only 1 family seat
			 */
			const subtotal =
				movie.price ??
				0;

			const ppn = 0;

			const bookingFee = 0;

			const total =
				subtotal +
				ppn +
				bookingFee;

			return {
				subtotal,

				ppn,

				bookingFee,

				total,
			};
		}, [
			movie,
			detail,
		]);

	/**
	 * ==================================================
	 * CHECK BALANCE
	 * ==================================================
	 */

	const isBalanceEnough =
		(data?.data
			.balance ??
			0) >=
		detailPrice.total;

	/**
	 * ==================================================
	 * HANDLE TRANSACTION
	 * ==================================================
	 */

	const handleTransaction = async () => {
		try {
			/**
			 * ==================================================
			 * VALIDATION
			 * ==================================================
			 */

			if (!detail?.seats?.length) {
				toast.error(
					"Silahkan pilih family seat terlebih dahulu",
				);

				return;
			}

			if (!movie?._id) {
				toast.error(
					"Movie tidak ditemukan",
				);

				return;
			}

			if (!detail?.theater?._id) {
				toast.error(
					"Teater tidak ditemukan",
				);

				return;
			}

			if (!detail?.time) {
				toast.error(
					"Jadwal tayang belum dipilih",
				);

				return;
			}

			/**
			 * ==================================================
			 * BUILD PAYLOAD
			 * ==================================================
			 */

			const payload = {
				subtotal: Number(
					detailPrice.subtotal,
				),

				total: Number(
					detailPrice.total,
				),

				tax: Number(
					detailPrice.ppn,
				),

				bookingFee: Number(
					detailPrice.bookingFee,
				),

				movieId: String(
					movie._id,
				),

				theaterId: String(
					detail.theater._id,
				),

				seats:
					detail.seats.map(
						(seat) =>
							String(seat),
					),

				date: String(
					detail.time,
				),
			};

			/**
			 * ==================================================
			 * DEBUG
			 * ==================================================
			 */

			console.log(
				"PAYLOAD:",
				payload,
			);

			/**
			 * ==================================================
			 * ZOD VALIDATION
			 * ==================================================
			 */

			const parsedPayload =
				transactionSchema.parse(
					payload,
				);

			console.log(
				"PARSED PAYLOAD:",
				parsedPayload,
			);

			/**
			 * ==================================================
			 * REQUEST
			 * ==================================================
			 */

			const response =
				await mutateAsync(
					parsedPayload,
				);

			console.log(
				"TRANSACTION SUCCESS:",
				response,
			);

			/**
			 * ==================================================
			 * RESET STEP
			 * ==================================================
			 */

			dispatch(
				setStep({
					step: "DETAIL",
					}),
			);

			/**
			 * ==================================================
			 * SUCCESS TOAST
			 * ==================================================
			 */

			toast.success(
				"Berhasil memesan tiket",
			);

			/**
			 * ==================================================
			 * REDIRECT
			 * ==================================================
			 */

			navigate(
				"/transaction-ticket/success",
			);
		} catch (error: any) {
			/**
			 * ==================================================
			 * DEBUG ERROR
			 * ==================================================
			 */

			console.log(
				"TRANSACTION ERROR:",
				error,
			);

			console.log(
				"BACKEND RESPONSE:",
				error?.response?.data,
			);

			console.log(
				"VALIDATION ERRORS:",
				error?.response?.data
					?.data,
			);

			/**
			 * ==================================================
			 * TOAST ERROR
			 * ==================================================
			 */

			const validationErrors =
				error?.response?.data
					?.data;

			if (
				Array.isArray(
					validationErrors,
				)
			) {
				toast.error(
					validationErrors.join(
						", ",
					),
				);

				return;
			}

			toast.error(
				error?.response?.data
					?.message ??
					"Transaksi gagal",
			);
		}
	};
	/**
	 * ==================================================
	 * REDIRECT
	 * ==================================================
	 */

	if (
		!movie ||
		!detail
	) {
		return (
			<Navigate to="/" />
		);
	}

	return (
		<div
			id="Content-Container"
			className="relative flex flex-col w-full min-h-screen bg-[linear-gradient(90deg,_#000000_40.82%,_#0E0E24_99.88%)] text-white overflow-x-hidden"
		>
			{/* ================================================== */}
			{/* HEADER */}
			{/* ================================================== */}

			<div
				id="Header"
				className="flex flex-col gap-5"
			>
				<div
					id="Top-Nav"
					className="relative mt-[60px] flex items-center justify-between px-5"
				>
					<button
						type="button"
						onClick={() => {
							dispatch(
								setStep(
									{
										step: "SEAT",
									},
								),
							);

							navigate(
								`/movie/${movie?._id}`,
							);
						}}
						className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#FFFFFF1A] backdrop-blur-md"
					>
						<img
							src="/assets/images/icons/arrow-left.svg"
							className="h-[22px] w-[22px] shrink-0"
							alt="back"
						/>
					</button>

					<p className="mx-auto text-center text-sm font-semibold">
						Pembayaran
						Tiket
					</p>

					<div className="w-12" />
				</div>

				<div className="mx-5 flex items-center justify-between gap-2">
					<div className="flex items-center gap-[14px]">
						<div className="flex h-[110px] w-[100px] shrink-0 overflow-hidden rounded-2xl bg-[#D9D9D9]">
							<img
								src={movie?.thumbnailUrl								}
								className="h-full w-full object-cover"
								alt="thumbnail"
							/>
						</div>

						<div className="flex flex-col gap-[6px]">
							<h3 className="line-clamp-2 font-semibold">
								{
									movie?.title
								}
							</h3>

							<div className="flex items-center gap-2">
								<img
									src="/assets/images/icons/video-vertical-grey.svg"
									className="h-[18px] w-[18px] shrink-0"
									alt="genre"
								/>

								<p className="text-sm text-premiere-grey">
									{
										movie
											?.genre
											.name
									}
								</p>
							</div>

							<div className="flex items-center gap-2">
								<img
									src="/assets/images/icons/location.svg"
									className="h-[18px] w-[18px] shrink-0"
									alt="location"
								/>

								<p className="text-sm text-premiere-grey">
									{
										detail
											?.theater
											?.city
									}
								</p>
							</div>
						</div>
					</div>

					<div className="flex items-center gap-[2px] rounded-full bg-[#FFFFFF1A] p-[8px_10px]">
						<p className="text-xs font-semibold leading-[18px]">
							4/5
						</p>

						<img
							src="/assets/images/icons/Star 1.svg"
							className="h-4 w-4 shrink-0"
							alt="star"
						/>
					</div>
				</div>
			</div>

			{/* ================================================== */}
			{/* ORDER DETAIL */}
			{/* ================================================== */}

			<section
				id="Order-Details"
				className="mt-5 px-5"
			>
				<div className="accordion group flex w-full flex-col gap-4 overflow-hidden rounded-3xl bg-white/10 p-5 transition-all duration-300 has-[:checked]:!h-16">
					<label className="relative mb-1 flex items-center justify-between">
						<h2>
							Detail
							Pesanan
						</h2>

						<img
							src="/assets/images/icons/arrow-circle-down.svg"
							className="h-6 w-6 shrink-0 transition-all duration-300 group-has-[:checked]:-rotate-180"
							alt="icon"
						/>

						<input
							type="checkbox"
							name="accordion-btn"
							className="hidden"
						/>
					</label>

					<div className="flex items-center gap-4">
						<div className="flex h-20 w-[90px] overflow-hidden rounded-2xl bg-[#D9D9D9]">
							<img
								src="/assets/images/thumbnails/theater2.png"
								className="h-full w-full object-cover"
								alt="theater"
							/>
						</div>

						<div className="flex flex-col gap-2">
							<p className="font-semibold">
								{
									detail
										?.theater
										?.name
								}
							</p>

							<p className="text-sm text-premiere-grey">
								{
									detail
										?.theater
										?.city
								}
							</p>
						</div>
					</div>

					<div className="flex items-center justify-between">
						<p>
							Jadwal
						</p>

						<p>
							{dateFormat(
								detail?.time ??
									"",
								"DD MMM YYYY",
							)}
						</p>
					</div>

					<div className="flex items-center justify-between">
						<p>
							Jumlah
						</p>

						<p>
							1 Family
							Seat
						</p>
					</div>

					<div className="flex items-center justify-between">
						<p>
							Nomor
							Kursi
						</p>

						<p>
							{detail?.seats?.join(
								", ",
							)}
						</p>
					</div>

					{/* <div className="flex items-center justify-between">
						<p>
							Harga
						</p>

						<p>
							{rupiahFormat(
								detailPrice.total,
							)}
						</p>
					</div> */}
				</div>
			</section>

			{/* ================================================== */}
			{/* BALANCE WARNING */}
			{/* ================================================== */}

			{!isBalanceEnough && (
				<div className="mx-5 mt-5 mb-10 flex items-center justify-between gap-3 rounded-[20px] bg-premiere-red p-4">
					<p className="font-semibold">
						Saldo
						ewallet
						anda
						tidak
						mencukupi
					</p>

					<Link
						to="/wallets/topup"
						className="rounded-full bg-white px-[18px] py-[12px] font-bold text-premiere-black"
					>
						Topup
					</Link>
				</div>
			)}

			{/* ================================================== */}
			{/* PAYMENT */}
			{/* ================================================== */}

			{isBalanceEnough && (
				<>
					<div className="mt-5 flex items-center gap-3 px-5">
						<input
							type="checkbox"
							checked={
								isAgree
							}
							onChange={(
								e,
							) =>
								setIsAgree(
									e
										.target
										.checked,
								)
							}
							className="h-5 w-5 accent-premiere-purple"
						/>

						<p className="text-sm">
							Saya
							menyetujui
							syarat
							dan
							ketentuan
							yang
							berlaku
						</p>
					</div>

					<div
						id="Bottom-Nav"
						className="fixed bottom-5 left-1/2 z-50 w-full max-w-[360px] -translate-x-1/2 px-5"
					>
						<div className="flex items-center justify-between gap-[14px] rounded-full bg-[#FFFFFF33] p-[10px_14px] pl-6 backdrop-blur-md">
							<div>
								{/* <p className="text-xl font-semibold leading-[30px]">
									{rupiahFormat(
										detailPrice.total,
									)}
								</p> */}

								<span className="mt-[2px] text-sm font-normal">
									Grand
									Total
								</span>
							</div>

							<button
								type="button"
								onClick={
									handleTransaction
								}
								disabled={
									isPending
								}
								className="rounded-full bg-white px-[18px] py-[12px] font-bold text-premiere-black transition-all duration-300 hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50"
							>
								{isPending
									? "Processing..."
									: "Pay Now"}
							</button>
						</div>
					</div>
				</>
			)}
		</div>
	);
}