import express from "express";
import locationsRouter from "./src/routers/locations.js";
import ridesRouter from "./src/routers/rides.js";
import usersRouter from "./src/routers/users.js";
import authenticationRouter from "./src/routers/authentication.js";
import reviewsRouter from "./src/routers/reviews.js";
import getIpAddress from "./src/utilities/get-ip.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import createConnection from "./config/databaseConfig.js";
import chatRouter from "./src/routers/chat.js";
import { createWebsocketServer } from "./config/websocketConfig.js";
const app = express();

dotenv.config();
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(cookieParser());
app.use(express.json());
var connection = createConnection();
var wsUsers = createWebsocketServer();

const port = process.env.PORT || 3737;

app.listen(port, () => {
  console.log(`Backend running on IP: ${getIpAddress(port)}`);
});

app.get("/", (req, res) => {
  res.send("API Running.");
});

app.use("/users", usersRouter);
app.use("/locations", locationsRouter);
app.use("/rides", ridesRouter);
app.use("/chat", chatRouter);
app.use("/authentication", authenticationRouter);
app.use("/reviews", reviewsRouter);
