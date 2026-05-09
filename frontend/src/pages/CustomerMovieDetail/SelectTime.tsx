import { useState } from "react";
import { useLoaderData } from "react-router-dom";
import { LoaderData } from ".";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setStep, setTicketDetail } from "@/redux/features/ticket/ticketSlice";
import dayjs from "dayjs";
import "dayjs/locale/id";
import clsx from "clsx";
import { toast } from "react-hot-toast";

export default function SelectTime() {
	const { detail } = useLoaderData() as LoaderData;
	const dispatch = useAppDispatch();

	const [date, setDate] = useState<string | null>(null);

	const detailTicket = useAppSelector((state) => state.ticket.detail);

	const fixedDate = dayjs("23 May 2026").locale("id").format("DD MMM YYYY");

	const [ selectedDate, setSelectedDate ] = useState("");
	console.log(detailTicket);

	const handleContinue = () => {
		if (date === null) {
			toast.error("Please select date first");

			return;
		}

		dispatch(
			setTicketDetail({
				time: date,
			}),
		);

		dispatch(
			setStep({
				step: "SEAT",
			}),
		);
	};

	return (
		<div
			id="Content-Container"
			className="
				relative
				flex
				flex-col
				w-full
				min-h-screen
				mx-auto
				overflow-x-hidden
				pb-32
				bg-[linear-gradient(179.86deg,_#000000_40.82%,_#0E0E24_99.88%)]
				text-white
			"
		>
			<div id="Header" className="flex flex-col gap-5">
				<div
					id="Top-Nav"
					className="relative flex items-center justify-between px-5 mt-[60px]"
				>
					<button
						type="button"
						onClick={() => {
							dispatch(
								setStep({
									step: "THEATER",
								}),
							);
						}}
						className="w-12 h-12 flex shrink-0 items-center justify-center bg-[#FFFFFF1A] backdrop-blur-md rounded-full"
					>
						<img
							src="/assets/images/icons/arrow-left.svg"
							className="w-[22px] h-[22px] flex shrink-0"
							alt=""
						/>
					</button>
					<p className="text-center mx-auto font-semibold text-sm">
						Pilih Jadwal Tayang
					</p>
					<div className="dummy-button w-12" />
				</div>
				<div className="flex items-center justify-between gap-2 mx-5">
					<div className="flex items-center gap-[14px]">
						<div className="w-[100px] h-[110px] flex shrink-0 rounded-2xl bg-[#D9D9D9] overflow-hidden">
							<img
								src={detail.thumbnailUrl}
								className="w-full h-full object-cover"
								alt="thumbnail"
							/>
						</div>
						<div className="flex flex-col gap-[6px]">
							<h3 className="font-semibold line-clamp-2">{detail.title}</h3>
							<div className="flex items-center gap-2">
								<img
									src="/assets/images/icons/video-vertical-grey.svg"
									className="w-[18px] h-[18px] flex shrink-0"
									alt="icon"
								/>
								<p className="text-sm text-premiere-grey">
									{detail.genre.name}
								</p>
							</div>
							<div className="flex items-center gap-2">
								<img
									src="/assets/images/icons/location.svg"
									className="w-[18px] h-[18px] flex shrink-0"
									alt="icon"
								/>
								<p className="text-sm text-premiere-grey">
									{detail.theaters[0].city}
								</p>
							</div>
						</div>
					</div>
					<div className="flex items-center gap-[2px] rounded-full p-[8px_10px] bg-[#FFFFFF1A]">
						<p className="font-semibold text-xs leading-[18px]">4/5</p>
						<img
							src="/assets/images/icons/Star 1.svg"
							className="w-4 h-4 flex shrink-0"
							alt="star"
						/>
					</div>
				</div>
			</div>
			<div className="flex flex-col gap-4 mt-5 px-5">
				<h2 className="font-semibold">Teater terpilih</h2>
				<div className="theather-card flex items-center rounded-3xl p-4 gap-2 bg-white/10 backdrop-blur-md">
					<div className="w-[100px] h-[110px] flex shrink-0 rounded-2xl overflow-hidden bg-[#D9D9D9]">
						<img
							src="/assets/images/thumbnails/theater1.png"
							className="w-full h-full object-cover"
							alt="theater"
						/>
					</div>
					<div className="flex flex-col gap-2">
						<h3 className="font-semibold">{detailTicket?.theater?.name}</h3>
						<p className="text-sm text-premiere-grey">
							{detailTicket?.theater?.city}
						</p>
					</div>
				</div>
			</div>
			<form action="choose-seat.html" className="relative px-5 mt-5">
				<div id="Theaters" className="tab-content flex flex-col gap-4">
					<h2 className="font-semibold">Pilih Jadwal Tayang</h2>

					<div className="grid grid-cols-2 gap-4">
						{detail.times.map((item, i) => {
							const value = `${fixedDate} ${item}`;
							const isSelected = selectedDate === value;

							return (
								<button
									type="button"
									onClick={() => {
										console.log(value);
										setSelectedDate(value);
										setDate(fixedDate);
									}}
									key={`${item + i}`}
									className={clsx(
										"group relative theather-card flex flex-col rounded-3xl p-4 gap-[2px] backdrop-blur-md transition-all duration-300",
										isSelected
											? "bg-premiere-purple"
											: "bg-white/10 hover:bg-premiere-purple"
									)}
								>
									{/* 🔥 Radio sekarang beneran sync */}
									<input
										type="radio"
										name="Time"
										checked={isSelected}
										readOnly
										className="absolute top-1/2 left-1/2 opacity-0"
									/>

									<p className="font-semibold text-xs leading-[18px]">
										Available
									</p>

									<p className="font-semibold text-xl leading-[30px]">
										{item}
									</p>

									<p className="font-semibold text-xs leading-[18px]">
										{fixedDate}
									</p>
								</button>
							);
						})}
					</div>
				</div>
				
				<div
				id="Bottom-Nav"
				className="fixed bottom-5 left-1/2 z-50 w-full max-w-[360px] -translate-x-1/2 px-5"
			>
				<div
					className="
						group
						flex
						cursor-pointer
						items-center
						justify-center
						rounded-full
						bg-[#FFFFFF33]
						p-[10px_14px]
						backdrop-blur-md
						transition-all
						duration-300
						hover:bg-white
						hover:shadow-[0_0_30px_rgba(255,255,255,0.3)]
					"
				>
					<button
						type="button"
						onClick={handleContinue}
						className="
							bg-transparent
							font-bold
							uppercase
							text-white
							transition-all
							duration-300
							group-hover:text-black
						"
					>
						Buy Ticket
					</button>
				</div>
			</div>
			</form>
		</div>
	);
}
