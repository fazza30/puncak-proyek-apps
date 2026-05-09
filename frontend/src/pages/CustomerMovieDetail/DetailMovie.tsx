import { useState } from "react";
import { Link, useLoaderData } from "react-router-dom";
import type { LoaderData } from ".";

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import { useAppDispatch } from "@/redux/hooks";
import { setStep } from "@/redux/features/ticket/ticketSlice";
import { getImageUrl } from "@/lib/image";

export default function DetailMovie() {
	const [tab, setTab] = useState<"about" | "reviews" | "theaters" | "cast">(
		"about",
	);

	const { detail } = useLoaderData() as LoaderData;

	const dispatch = useAppDispatch();

	console.log(detail);

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
			<div
				id="Background"
				className="absolute top-0 w-full h-[480px] overflow-hidden"
			>
				<div className="absolute w-full h-[169px] top-0 bg-[linear-gradient(180deg,rgba(0,0,0,0)_50.2%,rgba(14,14,36,0)_100%)]" />
				<div className="absolute w-full h-[169px] bottom-0 bg-[linear-gradient(360deg,#000000_6.6%,rgba(14,14,36,0)_99.33%)]" />
				<img src={getImageUrl(detail.thumbnailUrl)} alt="background" />
			</div>
			<div
				id="Top-Nav"
				className="relative flex items-center justify-between px-5 mt-[60px] mb-[337px]"
			>
				<Link
					to="/"
					className="w-12 h-12 flex shrink-0 items-center justify-center bg-[#FFFFFF1A] backdrop-blur-md rounded-full"
				>
					<img
						src="/assets/images/icons/arrow-left.svg"
						className="w-[22px] h-[22px] flex shrink-0"
						alt=""
					/>
				</Link>
				<p className="text-center mx-auto font-semibold text-sm">
					Tentang Film
				</p>
				<div className="w-12 h-12 flex shrink-0 items-center justify-center bg-[#FFFFFF1A] backdrop-blur-md rounded-full">
					<img
						src="/assets/images/icons/heart.svg"
						className="w-[22px] h-[22px] flex shrink-0"
						alt=""
					/>
				</div>
			</div>
			<div
				id="Title"
				className="relative flex items-center justify-between px-5"
			>
				<h1 className="font-bold text-[30px] leading-[45px]">{detail.title}</h1>
				<button
					type="button"
					className="w-[60px] h-[60px] flex shrink-0 items-center justify-center bg-[#FFFFFF1A] backdrop-blur-md rounded-full"
				>
					<img
						src="/assets/images/icons/video-circle.svg"
						className="w-9 h-9 flex shrink-0"
						alt="icon"
					/>
				</button>
			</div>
			<section id="Details" className="flex flex-col gap-5 mt-5">
				<div className="swiper-tabs w-full overflow-hidden">
					<Swiper
						spaceBetween={15}
						slidesPerView={"auto"}
						slidesOffsetBefore={20}
						slidesOffsetAfter={20}
						className="swiper-wrapper"
					>
						<SwiperSlide className="swiper-slide !w-fit py-[1px]">
							<button
								className="tab-link"
								type="button"
								onClick={() => setTab("about")}
							>
								<div className="flex rounded-full p-[12px_14px] bg-[#FFFFFF1A] font-semibold text-sm hover:ring-1 hover:ring-white transition-all duration-300 !bg-white !text-premiere-black">
									Sinopsis
								</div>
							</button>
						</SwiperSlide>
						<SwiperSlide className="swiper-slide !w-fit py-[1px]">
							<button
								className="tab-link"
								type="button"
								onClick={() => setTab("reviews")}
							>
								<div className="flex rounded-full p-[12px_14px] bg-[#FFFFFF1A] font-semibold text-sm hover:ring-1 hover:ring-white transition-all duration-300">
									Ulasan
								</div>
							</button>
						</SwiperSlide>
						<SwiperSlide className="swiper-slide !w-fit py-[1px]">
							<button
								className="tab-link"
								type="button"
								onClick={() => setTab("theaters")}
							>
								<div className="flex rounded-full p-[12px_14px] bg-[#FFFFFF1A] font-semibold text-sm hover:ring-1 hover:ring-white transition-all duration-300">
									Teater
								</div>
							</button>
						</SwiperSlide>
						<SwiperSlide className="swiper-slide !w-fit py-[1px]">
							<button
								className="tab-link"
								type="button"
								onClick={() => setTab("cast")}
							>
								<div className="flex rounded-full p-[12px_14px] bg-[#FFFFFF1A] font-semibold text-sm hover:ring-1 hover:ring-white transition-all duration-300">
									Pemeran
								</div>
							</button>
						</SwiperSlide>
					</Swiper>
				</div>
				<div className="px-5">
					{tab === "about" && (
						<div id="About-Tab" className="tab-content flex flex-col gap-5">
							<div className="flex flex-col gap-3">
								<h2 className="font-semibold">Sinopsis</h2>
								<p className="leading-[28px]">{detail.description}</p>
							</div>
							<div className="flex items-center gap-2">
								<div className="flex items-center rounded-full p-[8px_14px] gap-1 bg-[#FFFFFF1A] backdrop-blur-md">
									<img
										src="/assets/images/icons/video-vertical-white.svg"
										className="w-[18px] h-[18px] flex shrink-0"
										alt="icon"
									/>
									<p className="text-sm">{detail.genre.name}</p>
								</div>
								<div className="flex items-center rounded-full p-[8px_14px] gap-1 bg-[#FFFFFF1A] backdrop-blur-md">
									<img
										src="/assets/images/icons/location.svg"
										className="w-[18px] h-[18px] flex shrink-0"
										alt="icon"
									/>
									<p className="text-sm">{detail.theaters[0].city}</p>
								</div>
								<div className="flex items-center rounded-full p-[8px_14px] gap-1 bg-[#FFFFFF1A] backdrop-blur-md">
									<p className="text-sm">4/5</p>
									<img
										src="/assets/images/icons/Star 1.svg"
										className="w-[18px] h-[18px] flex shrink-0"
										alt="icon"
									/>
								</div>
							</div>
						</div>
					)}
					{tab === "reviews" && (
						<div id="Reviews-Tab" className="tab-content flex flex-col gap-4">
							<h2 className="font-semibold">Ulasan Pelanggan</h2>
							<div className="review-card flex flex-col rounded-3xl p-4 gap-2 bg-white/10 backdrop-blur-md">
								<div className="flex items-center gap-1">
									<img
										src="/assets/images/icons/Star 1.svg"
										className="w-5 h-5 flex shrink-0"
										alt="star"
									/>
									<img
										src="/assets/images/icons/Star 1.svg"
										className="w-5 h-5 flex shrink-0"
										alt="star"
									/>
									<img
										src="/assets/images/icons/Star 1.svg"
										className="w-5 h-5 flex shrink-0"
										alt="star"
									/>
									<img
										src="/assets/images/icons/Star 1.svg"
										className="w-5 h-5 flex shrink-0"
										alt="star"
									/>
								</div>
								<p className="leading-[28px]">
									It was okay for me, just so so...
								</p>
								<p className="font-semibold">Abbe Parnaman</p>
							</div>
							<div className="review-card flex flex-col rounded-3xl p-4 gap-2 bg-white/10 backdrop-blur-md">
								<div className="flex items-center gap-1">
									<img
										src="/assets/images/icons/Star 1.svg"
										className="w-5 h-5 flex shrink-0"
										alt="star"
									/>
									<img
										src="/assets/images/icons/Star 1.svg"
										className="w-5 h-5 flex shrink-0"
										alt="star"
									/>
									<img
										src="/assets/images/icons/Star 1.svg"
										className="w-5 h-5 flex shrink-0"
										alt="star"
									/>
									<img
										src="/assets/images/icons/Star 1.svg"
										className="w-5 h-5 flex shrink-0"
										alt="star"
									/>
									<img
										src="/assets/images/icons/Star 1.svg"
										className="w-5 h-5 flex shrink-0"
										alt="star"
									/>
								</div>
								<p className="leading-[28px]">
									Movie was good, we were happy couple watching this every time
									again again.
								</p>
								<p className="font-semibold">Sarina Putri</p>
							</div>
							<div className="review-card flex flex-col rounded-3xl p-4 gap-2 bg-white/10 backdrop-blur-md">
								<div className="flex items-center gap-1">
									<img
										src="/assets/images/icons/Star 1.svg"
										className="w-5 h-5 flex shrink-0"
										alt="star"
									/>
									<img
										src="/assets/images/icons/Star 1.svg"
										className="w-5 h-5 flex shrink-0"
										alt="star"
									/>
									<img
										src="/assets/images/icons/Star 1.svg"
										className="w-5 h-5 flex shrink-0"
										alt="star"
									/>
									<img
										src="/assets/images/icons/Star 1.svg"
										className="w-5 h-5 flex shrink-0"
										alt="star"
									/>
									<img
										src="/assets/images/icons/Star 1.svg"
										className="w-5 h-5 flex shrink-0"
										alt="star"
									/>
								</div>
								<p className="leading-[28px]">
									It was okay for me, just so so...
								</p>
								<p className="font-semibold">Abbe Parnaman</p>
							</div>
						</div>
					)}
					{tab === "theaters" && (
						<div id="Theaters-Tab" className="tab-content flex flex-col gap-4">
							<h2 className="font-semibold">Tayang di Teater</h2>
							{detail.theaters?.map((item) => (
								<div
									key={item._id}
									className="theather-card flex items-center rounded-3xl p-4 gap-2 bg-white/10 backdrop-blur-md"
								>
									<div className="w-[100px] h-[110px] flex shrink-0 rounded-2xl overflow-hidden bg-[#D9D9D9]">
										<img
											src="/assets/images/thumbnails/theater1.png"
											className="w-full h-full object-cover"
											alt="theater"
										/>
									</div>
									<div className="flex flex-col gap-2">
										<h3 className="font-semibold">{item.name}</h3>
										<p className="text-sm text-premiere-grey">{item.city}</p>
									</div>
								</div>
							))}
						</div>
					)}
				</div>
			</section>
			{/* <section id="bonus" className="flex flex-col gap-4 mt-5">
				<h2 className="font-semibold px-5">Bonus Tickets</h2>
				<div className="swiper-bonus w-full overflow-hidden">
					<Swiper
						spaceBetween={15}
						slidesPerView={"auto"}
						slidesOffsetBefore={20}
						slidesOffsetAfter={20}
						className="swiper-wrapper"
					>
						<SwiperSlide className="swiper-slide !w-fit">
							<div className="flex items-center w-[230px] rounded-[20px] p-[10px] gap-[14px] bg-white/10">
								<div className="w-20 h-20 rounded-2xl bg-[#D9D9D9] overflow-hidden">
									<img
										src="/assets/images/thumbnails/popcorn.png"
										className="w-full h-full object-cover"
										alt="image2"
									/>
								</div>
								<div className="flex flex-col min-w-[120px] gap-[6px]">
									<h3 className="font-semibold">{detail.bonus}</h3>
									<div className="flex items-center gap-2">
										<img
											src="/assets/images/icons/coffee.svg"
											className="w-[18px] h-[18px] flex shrink-0"
											alt="icon"
										/>
										<p className="text-sm text-premiere-grey">Snacks</p>
									</div>
								</div>
							</div>
						</SwiperSlide>
					</Swiper>
				</div>
			</section> */}
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
						onClick={() => {
							dispatch(
								setStep({
									step: "THEATER",
								}),
							);
						}}
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
	);
}
