import { useEffect, useState } from "react";

import { socket } from "@/lib/socket";

export const description =
	"A realtime admin overview dashboard with online users monitoring.";

type OnlineUser = {
	userId: string;

	name: string;

	email: string;

	currentPage: string;

	loginAt: number;

	tokenExpiredAt: string;

	socketId: string;

	lastActivity: number;
};

export default function AdminOverview() {
	const [
		users,
		setUsers,
	] = useState<
		OnlineUser[]
	>([]);

	const [
		activeUsers,
		setActiveUsers,
	] = useState(0);

	const [
		maxUsers,
		setMaxUsers,
	] = useState(10);

	/**
	 * realtime rerender
	 */
	const [
		currentTime,
		setCurrentTime,
	] = useState(
		Date.now(),
	);

	/**
	 * ==================================================
	 * SOCKET REALTIME
	 * ==================================================
	 */

	useEffect(() => {
		if (!socket.connected) {
			socket.connect();
		}

		/**
		 * JOIN ADMIN ROOM
		 */
		socket.emit(
			"join-admin-room",
		);

		/**
		 * RECEIVE ONLINE USERS
		 */
		socket.on(
			"online-users",
			(data) => {
				console.log(
					"ONLINE USERS:",
					data,
				);

				setUsers(
					data.users ?? [],
				);

				setActiveUsers(
					data?.activeUsers ?? 0,
				);

				setMaxUsers(
					data?.maxUsers ?? 10,
				);
			},
		);

		return () => {
			socket.off(
				"online-users",
			);
		};
	}, []);

	/**
	 * ==================================================
	 * REALTIME TIMER
	 * ==================================================
	 */

	useEffect(() => {
		const interval =
			setInterval(() => {
				setCurrentTime(
					Date.now(),
				);
			}, 1000);

		return () => {
			clearInterval(
				interval,
			);
		};
	}, []);

	/**
	 * ==================================================
	 * FORMAT LOGIN TIME
	 * ==================================================
	 */

	const formatTime = (
		time: number,
	) => {
		return new Date(
			time,
		).toLocaleTimeString(
			"id-ID",
			{
				hour: "2-digit",
				minute:
					"2-digit",
				second:
					"2-digit",
			},
		);
	};

	/**
	 * ==================================================
	 * TOKEN COUNTDOWN
	 * ==================================================
	 */

	const getRemainingToken = (
	tokenExpiredAt?: string,
) => {
	if (!tokenExpiredAt) {
		return "-";
	}

	/**
	 * convert timestamp
	 */
	const expiredTime =
		new Date(
			tokenExpiredAt,
		).getTime();

	/**
	 * invalid date
	 */
	if (
		isNaN(
			expiredTime,
		)
	) {
		return "-";
	}

	const remaining =
		expiredTime -
		currentTime;

	/**
	 * expired
	 */
	if (
		remaining <= 0
	) {
		return "Expired";
	}

	const minutes =
		Math.floor(
			remaining /
				1000 /
				60,
		);

	const seconds =
		Math.floor(
			(remaining /
				1000) %
				60,
		);

	return `${minutes}m ${seconds}s`;
};
	return (
		<div className="flex flex-col gap-6">
			{/* ================================================== */}
			{/* HEADER */}
			{/* ================================================== */}

			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold">
						Overview
					</h1>

					<p className="text-sm text-muted-foreground">
						Realtime monitoring user WAR Ticket
					</p>
				</div>

				<div className="rounded-xl border bg-background px-4 py-3 shadow-sm">
					<p className="text-sm text-muted-foreground">
						Online Users
					</p>

					<h2 className="text-2xl font-bold">
						{activeUsers}/{maxUsers}
					</h2>
				</div>
			</div>

			{/* ================================================== */}
			{/* TABLE */}
			{/* ================================================== */}

			<div className="overflow-hidden rounded-2xl border bg-background shadow-sm">
				<div className="overflow-x-auto">
					<table className="w-full">
						<thead className="border-b bg-muted/50">
							<tr>
								<th className="px-4 py-4 text-left text-sm font-semibold">
									User
								</th>

								<th className="px-4 py-4 text-left text-sm font-semibold">
									Email
								</th>

								<th className="px-4 py-4 text-left text-sm font-semibold">
									Current Page
								</th>

								<th className="px-4 py-4 text-left text-sm font-semibold">
									Login Time
								</th>

								<th className="px-4 py-4 text-left text-sm font-semibold">
									Token
								</th>

								<th className="px-4 py-4 text-left text-sm font-semibold">
									Last Activity
								</th>
							</tr>
						</thead>

						<tbody>
							{users?.length ===
							0 ? (
								<tr>
									<td
										colSpan={
											6
										}
										className="px-4 py-10 text-center text-sm text-muted-foreground"
									>
										Belum ada user online
									</td>
								</tr>
							) : (
								users?.map(
									(
										user,
									) => (
										<tr
											key={
												user.userId
											}
											className="border-b transition-colors hover:bg-muted/40"
										>
											<td className="px-4 py-4">
												<div className="flex items-center gap-3">
													<div className="h-3 w-3 rounded-full bg-green-500 animate-pulse" />

													<div>
														<p className="font-medium">
															{
																user.name
															}
														</p>

														<p className="text-xs text-muted-foreground">
															{
																user.userId
															}
														</p>
													</div>
												</div>
											</td>

											<td className="px-4 py-4 text-sm">
												{
													user.email
												}
											</td>

											<td className="px-4 py-4">
												<span className="rounded-lg bg-muted px-3 py-1 text-xs font-medium">
													{
														user.currentPage
													}
												</span>
											</td>

											<td className="px-4 py-4 text-sm">
												{formatTime(
													user.loginAt,
												)}
											</td>

											<td className="px-4 py-4">
												<span className="rounded-lg bg-green-500/10 px-3 py-1 text-xs font-semibold text-green-600">
													{getRemainingToken(
														user.tokenExpiredAt,
													)}
												</span>
											</td>

											<td className="px-4 py-4 text-sm">
												{Math.floor(
													(currentTime -
														user.lastActivity) /
														1000,
												)}
												s ago
											</td>
										</tr>
									),
								)
							)}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}