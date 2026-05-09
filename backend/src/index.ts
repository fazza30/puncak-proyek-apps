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

connectDB();

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
	socket.on("disconnect", () => {
		console.log(
			"User disconnected:",
			socket.id,
		);
	});
});

server.listen(port, () => {
	console.log(
		`[server]: Server is running at http://localhost:${port}`,
	);
});