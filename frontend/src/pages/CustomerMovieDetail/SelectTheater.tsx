import { useState } from "react";
import { useLoaderData } from "react-router-dom";
import clsx from "clsx";
import { toast } from "sonner";

import type { LoaderData } from ".";
import { useAppDispatch } from "@/redux/hooks";

import {
	setStep,
	setTicketDetail,
} from "@/redux/features/ticket/ticketSlice";

import type { Theater } from "@/services/theater/theater.type";
import { getImageUrl } from "@/lib/image";

export default function SelectTheater() {
	const { detail } =
		useLoaderData() as LoaderData;

	const dispatch =
		useAppDispatch();

	/**
	 * ==================================================
	 * STATES
	 * ==================================================
	 */
	const [
		selectedTheater,
		setSelectedTheater,
	] =
		useState<Theater | null>(
			null,
		);

	/**
	 * ==================================================
	 * CONTINUE
	 * ==================================================
	 */
	const handleContinue =
		() => {
			if (
				!selectedTheater
			) {
				toast.error(
					"Silahkan pilih teater terlebih dahulu",
				);

				return;
			}

			dispatch(
				setTicketDetail({
					theater:
						selectedTheater,
				}),
			);

			dispatch(
				setStep({
					step: "TIME",
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
			{/* HEADER */}
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
								setStep({
									step:
										"DETAIL",
								}),
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
						Pilih Teater
					</p>

					<div className="w-12" />
				</div>

				<div className="mx-5 flex items-center justify-between gap-2">
					<div className="flex items-center gap-[14px]">
						<div className="flex h-[110px] w-[100px] shrink-0 overflow-hidden rounded-2xl bg-[#D9D9D9]">
							<img
								src={
									getImageUrl(
										detail.thumbnailUrl
									)
								}
								className="h-full w-full object-cover"
								alt="thumbnail"
							/>
						</div>

						<div className="flex flex-col gap-[6px]">
							<h3 className="line-clamp-2 font-semibold">
								{
									detail.title
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
										detail
											.genre
											.name
									}
								</p>
							</div>

							<div className="flex items-center gap-2">
								<img
									src="/assets/images/icons/location.svg"
									className="h-[18px] w-[18px] shrink-0"
									alt="city"
								/>

								<p className="text-sm text-premiere-grey">
									{
										detail
											.theaters[0]
											.city
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

			{/* CONTENT */}
			<div className="relative mt-5 px-5 pb-40">
				<div
					id="Theaters"
					className="flex flex-col gap-4"
				>
					<h2 className="font-semibold">
						Silahkan Pilih
						Teater
					</h2>

					{detail.theaters.map(
						(item) => {
							const isSelected =
								selectedTheater?._id ===
								item._id;

							return (
								<button
									type="button"
									key={
										item._id
									}
									onClick={() => {
										setSelectedTheater(
											item,
										);
									}}
									className={clsx(
										"relative flex items-center gap-2 rounded-3xl p-4 backdrop-blur-md transition-all duration-300",
										isSelected
											? "bg-premiere-purple"
											: "bg-white/10 hover:bg-premiere-purple",
									)}
								>
									<div className="flex h-[110px] w-[100px] shrink-0 overflow-hidden rounded-2xl bg-[#D9D9D9]">
										<img
											src="/assets/images/thumbnails/theater1.png"
											className="h-full w-full object-cover"
											alt="theater"
										/>
									</div>

									<div className="flex flex-col gap-2 text-left">
										<h3 className="font-semibold">
											{
												item.name
											}
										</h3>

										<p className="text-sm text-premiere-grey">
											{
												item.city
											}
										</p>
									</div>
								</button>
							);
						},
					)}
				</div>

				{/* BOTTOM BUTTON */}
				<div
					id="Bottom-Nav"
					className="fixed bottom-5 left-1/2 z-50 w-full max-w-[360px] -translate-x-1/2 px-5"
				>
					<div
						className="
							group
							flex
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
							onClick={
								handleContinue
							}
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
							Lanjutkan
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}