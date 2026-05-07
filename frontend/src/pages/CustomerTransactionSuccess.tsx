import {
	useEffect,
} from "react";

import {
	useNavigate,
} from "react-router-dom";

import {
	useDispatch,
} from "react-redux";

import {
	useAppSelector,
} from "@/redux/hooks";

import {
	resetTicket,
} from "@/redux/features/ticket/ticketSlice";

import {
	dateFormat,
} from "@/lib/utils";

export default function CustomerTransactionSuccess() {
	const navigate =
		useNavigate();

	const dispatch =
		useDispatch();

	/**
	 * ==================================================
	 * GET TICKET DATA
	 * ==================================================
	 */

	const {
		movie,
		detail,
	} = useAppSelector(
		(state) =>
			state.ticket,
	);

	/**
	 * ==================================================
	 * AUTO REDIRECT
	 * ==================================================
	 */

	useEffect(() => {
		const timer =
			setTimeout(() => {
				/**
				 * reset redux state
				 */

				dispatch(
					resetTicket(),
				);

				/**
				 * redirect home
				 */

				navigate(
					"/",
				);
			}, 60000);

		return () =>
			clearTimeout(
				timer,
			);
	}, [
		dispatch,
		navigate,
	]);

	return (
		<div
			id="Content-Container"
			className="relative flex flex-col w-full min-h-screen mx-auto overflow-x-hidden bg-[linear-gradient(179.86deg,_#000000_40.82%,_#0E0E24_99.88%)] text-white"
		>
			<div className="flex flex-col min-h-screen">
				{/* ================================================== */}
				{/* BACKGROUND */}
				{/* ================================================== */}

				<div
					id="Background"
					className="relative w-full h-[320px] overflow-hidden shrink-0"
				>
					<div className="absolute top-0 w-full h-[169px] bg-[linear-gradient(180deg,rgba(0,0,0,0)_50.2%,rgba(14,14,36,0)_100%)] z-10" />

					<div className="absolute bottom-0 w-full h-[169px] bg-[linear-gradient(360deg,#000000_6.6%,rgba(14,14,36,0)_99.33%)] z-10" />

					<img
						src="/assets/images/backgrounds/details.png"
						className="w-full h-full object-cover"
						alt="background"
					/>
				</div>

				{/* ================================================== */}
				{/* CONTENT */}
				{/* ================================================== */}

				<div className="relative flex flex-col items-center gap-[30px] mt-auto mb-[70px] px-5">
					<div className="flex flex-col items-center w-full max-w-[340px] gap-[6px]">
						<img
							src="/assets/images/icons/note-favorite.svg"
							className="flex-shrink-0 w-[50px] h-[50px]"
							alt="icon"
						/>

						<h1 className="text-[26px] font-bold leading-[39px] text-center">
							Booking Successful
						</h1>

						<p className="text-center text-premiere-grey">
							Tiket anda telah berhasil dibeli,
							silahkan cek detail pesanan anda
							di bawah ini
						</p>

						{/* ================================================== */}
						{/* TICKET DETAIL */}
						{/* ================================================== */}

						<div className="w-full p-5 mt-5 rounded-3xl bg-white/10 backdrop-blur-md">
							<div className="flex items-center gap-4">
								<div className="overflow-hidden rounded-2xl w-20 h-24 bg-white/10">
									<img
										src={
											movie?.thumbnailUrl
										}
										className="object-cover w-full h-full"
										alt="movie"
									/>
								</div>

								<div className="flex flex-col gap-1">
									<h2 className="text-lg font-bold">
										{
											movie?.title
										}
									</h2>

									<p className="text-sm text-premiere-grey">
										{
											movie
												?.genre
												?.name
										}
									</p>

									<p className="text-sm">
										{
											detail
												?.theater
												?.name
										}
									</p>
								</div>
							</div>

							<div className="w-full h-px my-4 bg-white/10" />

							<div className="flex flex-col gap-3 text-sm">
								<div className="flex items-center justify-between gap-3">
									<span>
										Jadwal
									</span>

									<span className="font-semibold text-right">
										{dateFormat(
											detail?.time ??
												"",
											"HH:mm, DD MMM YYYY",
										)}
									</span>
								</div>

								<div className="flex items-center justify-between gap-3">
									<span>
										Family Seat
									</span>

									<span className="font-semibold text-right">
										{detail?.seats?.join(
											", ",
										)}
									</span>
								</div>

								<div className="flex items-center justify-between gap-3">
									<span>
										Kota
									</span>

									<span className="font-semibold text-right">
										{
											detail
												?.theater
												?.city
										}
									</span>
								</div>
							</div>
						</div>

						{/* ================================================== */}
						{/* REDIRECT INFO */}
						{/* ================================================== */}

						<p className="mt-2 text-xs text-center opacity-70 animate-pulse">
							Anda akan diarahkan ke halaman utama dalam 3 detik...
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}