import { dateFormat } from "@/lib/utils";
import type { Transaction } from "@/services/transaction/transaction.type";
import { Link, useLoaderData } from "react-router-dom";
import QRCode from "react-qr-code";
import { getImageUrl } from "@/lib/image";

export default function CustomerOrderDetail() {
	const transaction = useLoaderData() as Transaction;

	return (
		<div
			id="Content-Container"
			className="relative flex flex-col w-full max-w-[clamp(320px,100%,1200px)] min-h-screen mx-auto bg-[linear-gradient(179.86deg,_#000000_40.82%,_#0E0E24_99.88%)] overflow-x-hidden text-white"
		>
			<div id="Header" className="flex flex-col gap-5">
				<div
					id="Top-Nav"
					className="relative flex items-center justify-between px-5 mt-[60px]"
				>
					<Link
						to={"/orders"}
						className="w-12 h-12 flex shrink-0 items-center justify-center bg-[#FFFFFF1A] backdrop-blur-md rounded-full"
					>
						<img
							src="/assets/images/icons/arrow-left.svg"
							className="w-[22px] h-[22px] flex shrink-0"
							alt=""
						/>
					</Link>
					<p className="text-center mx-auto font-semibold text-sm">
						Detail Tiket
					</p>
					<div className="dummy-button w-12" />
				</div>
				<div className="flex items-center justify-between gap-2 mx-5">
					<div className="flex items-center gap-[14px]">
						<div className="w-[100px] h-[110px] flex shrink-0 rounded-2xl bg-[#D9D9D9] overflow-hidden">
							<img
								src={getImageUrl(transaction.movie.thumbnailUrl)}
								className="w-full h-full object-cover"
								alt="thumbnail"
							/>
						</div>
						<div className="flex flex-col gap-[6px]">
							<h3 className="font-semibold line-clamp-2">
								{transaction.movie.title}
							</h3>
							<div className="flex items-center gap-[6px]">
								<div className="flex items-center gap-2">
									<img
										src="/assets/images/icons/video-vertical-grey.svg"
										className="w-[18px] h-[18px] flex shrink-0"
										alt="icon"
									/>
									<p className="text-sm text-premiere-grey">
										{transaction.movie.genre.name}
									</p>
								</div>
								<div className="flex items-center gap-2">
									<img
										src="/assets/images/icons/location.svg"
										className="w-[18px] h-[18px] flex shrink-0"
										alt="icon"
									/>
									<p className="text-sm text-premiere-grey">
										{transaction.theater.city}
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<section id="Order-Details" className="px-5 mt-5">
				<div className="accordion group flex flex-col w-full rounded-3xl p-5 gap-4 bg-white/10 has-[:checked]:!h-16 transition-all duration-300 overflow-hidden">
					<label className="relative flex items-center justify-between mb-1">
						<h2>Detail Pesanan</h2>
						<img
							src="/assets/images/icons/arrow-circle-down.svg"
							className="w-6 h-6 flex shrink-0 group-has-[:checked]:-rotate-180 transition-all duration-300"
							alt="icon"
						/>
						<input
							type="checkbox"
							name="accordion-btn"
							className="absolute hidden"
						/>
					</label>
					<div className="flex items-center gap-4">
						<div className="flex w-[90px] h-20 rounded-2xl bg-[#D9D9D9] overflow-hidden">
							<img
								src="/assets/images/thumbnails/theater2.png"
								className="w-full h-full object-cover"
								alt="image2"
							/>
						</div>
						<div className="flex flex-col gap-2">
							<p className="font-semibold">{transaction.theater.name}</p>
							<p className="text-sm text-premiere-grey">
								{transaction.theater.city}
							</p>
						</div>
					</div>
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-3">
							<img
								src="/assets/images/icons/receipt-2.svg"
								className="w-6 h-6 flex shrink-0"
								alt="icon"
							/>
							<p>Booking ID</p>
						</div>
						<p>PP2026</p>
					</div>
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-3">
							<img
								src="/assets/images/icons/calendar-2.svg"
								className="w-6 h-6 flex shrink-0"
								alt="icon"
							/>
							<p>Tanggal Tayang</p>
						</div>
						<p>{dateFormat(transaction.date, "DD MMM YYYY")}</p>
					</div>
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-3">
							<img
								src="/assets/images/icons/profile-2user.svg"
								className="w-6 h-6 flex shrink-0"
								alt="icon"
							/>
							<p>Jumlah Kursi</p>
						</div>
						<p>{transaction.seats.length} Kursi</p>
					</div>
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-3">
							<img
								src="/assets/images/icons/ticket-star.svg"
								className="w-6 h-6 flex shrink-0"
								alt="icon"
							/>
							<p>Nomor Kursi</p>
						</div>
						<p>{transaction.seats.map((s) => s.seat).join(", ")}</p>
					</div>
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-3">
							<img
								src="/assets/images/icons/note.svg"
								className="w-6 h-6 flex shrink-0"
								alt="icon"
							/>
							<p>Status Pemesanan</p>
						</div>
						<p className="w-fit rounded-full p-[6px_10px] bg-premiere-light-green text-premiere-green font-bold text-xs leading-[18px]">
							SUCCESS
						</p>
					</div>
					<div className="flex justify-center">
						<div className="p-4 bg-white rounded-2xl shadow-lg">
							<QRCode
								value={"Nomor Kursi : " + transaction.seats.map((s) => s.seat).join(", ")}
								size={160}
								bgColor="transparent"
								fgColor="black"
								level="H"
							/>
						</div>	
					</div>

					<p className="text-xs text-premiere-grey text-center">
						Tunjukkan QR ini saat masuk ke studio
					</p>
				</div>	
			</section>		
		</div>
	);
}
