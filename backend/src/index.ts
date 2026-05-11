import express, { type Express, type Request, type Response } from "express";
import dotenv from "dotenv";
import connectDB from "./utils/database";
import adminRoutes from "./routes/adminRoutes";
import bodyParser from "body-parser";
import { handleTopupBalance } from "./controllers/walletController";
import authRoutes from "./routes/authRoutes";
import customerRoutes from "./routes/customerRoutes";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import User from "./models/User";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

const allowedOrigins = [
  "http://localhost:5173",
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(bodyParser.json());
app.use(express.static("public"));
app.use(
  cors({
    origin: (origin, callback) => {
      if (
        !origin ||
        origin.includes("vercel.app") ||
        origin === "http://localhost:5173"
      ) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

console.log("CLIENT_URL:", process.env.CLIENT_URL);
console.log("ALLOWED_ORIGINS:", allowedOrigins);

/**
 * ==================================================
 * START SERVER
 * ==================================================
 */

const startServer =
	async () => {
		try {
			/**
			 * CONNECT DATABASE
			 */
			await connectDB();

			/**
			 * RESET ALL SESSION
			 */
			await User.updateMany(
				{},
				{
					isLoggedIn: false,
					activeToken: null,
					tokenExpiredAt: null,
				},
			);

			console.log(
				"All sessions reset success",
			);

			/**
			 * START SERVER
			 */
			server.listen(
				port,
				() => {
					console.log(
						`[server]: Server is running at http://localhost:${port}`,
					);
				},
			);
		} catch (error) {
			console.log(
				"Server startup error:",
				error,
			);
		}
	};

startServer();

app.get("/", (req: Request, res: Response) => {
	res.send("Express + TypeScript Server");
});

app.post("/api/global/handle-payment", handleTopupBalance);
app.use("/api", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/customer", customerRoutes);

const server = http.createServer(app);

export const io = new Server(server, {
	cors: {
		origin: [
			"http://localhost:5173",
			process.env.CLIENT_URL ?? "",
		],
		credentials: true,
	},
});

/**
 * ==================================================
 * SOCKET CONNECTION
 * ==================================================
 */

io.on("connection", async (socket) => {
	console.log("User connected:", socket.id);

	/**
	 * SYNC HOLDING SEATS
	 */
	const seats =
		Array.from(
			holdingSeats.values(),
		).map(
			(value) => ({
				movieId: value.movieId,
				seat: value.seat,
				expiredAt:
					value.expiredAt,
			}),
		);

	socket.emit(
		"sync-holding-seats",
		seats,
	);

	/**
	 * SEND ACTIVE USERS
	 */
	const activeUsers =
		await User.countDocuments({
			role: "customer",
			isLoggedIn: true,
			tokenExpiredAt: {
				$gt: new Date(),
			},
		});

	socket.emit("active-users", {
		activeUsers,
		maxUsers: 10,
	});

	/**
	 * DISCONNECT
	 */
	socket.on(
		"disconnect",
		() => {
			console.log(
				"User disconnected:",
				socket.id,
			);

			for (const [
				key,
				value,
			] of holdingSeats.entries()) {
				if (
					value.socketId ===
					socket.id
				) {
					holdingSeats.delete(
						key,
					);

					io.emit(
						"seat-released",
						{
							movieId:
								value.movieId,
								
							seat:
								value.seat,
						},
					);

					console.log(
						"Seat released on disconnect:",
						value.seat,
					);
				}
			}
		},
	);

	/**
	 * ==================================================
	 * HOLD SEAT
	 * ==================================================
	 */

	socket.on(
		"hold-seat",
		(data) => {
			const {
				movieId,
				seat,
			} = data;

			const key =
				`${movieId}-${seat}`;

			/**
			 * already held
			 */
			if (
				holdingSeats.has(
					key,
				)
			) {
				socket.emit(
					"seat-unavailable",
					seat,
				);

				return;
			}

			/**
			 * HOLD 3 MINUTES
			 */
			const expiredAt =
				Date.now() +
				3 *
				60 *
				1000;

			holdingSeats.set(
				key,
				{
					socketId:
						socket.id,

					movieId,

					seat,

					expiredAt,
				},
			);

			io.emit(
				"seat-held",
				{
					movieId,
					seat,
					expiredAt,
				},
			);
		},
	);

	/**
	 * ==================================================
	 * RELEASE SEAT
	 * ==================================================
	 */

	socket.on(
		"release-seat",
		(data) => {
			const {
				movieId,
				seat,
			} = data;

			const key =
				`${movieId}-${seat}`;

			holdingSeats.delete(
				key,
			);

			io.emit(
				"seat-released",
				{
					movieId,
					seat,
				},
			);
		},
	);
});

/**
 * ==================================================
 * AUTO RELEASE EXPIRED SEATS
 * ==================================================
 */

setInterval(() => {
	const now =
		Date.now();

	for (const [
		key,
		value,
	] of holdingSeats.entries()) {
		if (
			now >=
			value.expiredAt
		) {
			holdingSeats.delete(
				key,
			);

			const seat =
				value.seat;

			io.emit(
				"seat-released",
				{
					movieId: key.split("-")[0],
					seat,
				},
			);

			console.log(
				"Seat expired:",
				seat,
			);
		}
	}
}, 5000);

/**
 * ==================================================
 * HOLDING SEATS
 * ==================================================
 */

const holdingSeats =
	new Map<
		string,
		{
			socketId: string;
			movieId: string;
			seat: string;
			expiredAt: number;
		}
	>();