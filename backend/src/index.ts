import express, { type Express, type Request, type Response } from "express";
import dotenv from "dotenv";
import connectDB from "./utils/database";
import adminRoutes from "./routes/adminRoutes";
import bodyParser from "body-parser";
import { handleTopupBalance } from "./controllers/walletController";
import authRoutes from "./routes/authRoutes";
import customerRoutes from "./routes/customerRoutes";
import cors from "cors";

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
      if (!origin || allowedOrigins.includes(origin)) {
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

app.listen(port, () => {
	console.log(`[server]: Server is running at http://localhost:${port}`);
});