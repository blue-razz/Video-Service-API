import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { connectToDatabase, disconnectFromDatabase } from "./utils/database";
import logger from "./utils/logger";
import { CORS_ORIGIN } from "./constants";
import helmet from "helmet";
import userRoute from "./modules/user/user.route";
import authRoute from "./modules/auth/auth.route";
import deserializeUser from "./middleware/deserializeUser";
import videoRoute from "./modules/videos/video.route";

// Create express instance
const PORT = process.env.PORT || 4000;
const app = express();

// Middleware
app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin: CORS_ORIGIN,
    credentials: true,
  })
);
app.use(helmet());
app.use(deserializeUser);

// Routes
app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/videos", videoRoute);

// Run the server!
const server = app.listen(PORT, async () => {
  await connectToDatabase();
  logger.info(`Server listening at http://localhost:${PORT}`);
});

const signals = ["SIGTERM", "SIGINT"];

function gracefulShutdown(signal: string) {
  process.on(signal, async () => {
    logger.info(`Received ${signal}`);
    server.close();

    // Disconnect from the database
    await disconnectFromDatabase();

    logger.info("My work here is done");
    process.exit(0);
  });
}

// When ctrl+c, etc. is pressed disconnect from the database... gracefully
for (let i = 0; i < signals.length; i++) {
  gracefulShutdown(signals[i]);
}
