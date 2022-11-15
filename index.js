import express from "express";
import locationsRouter from "./src/routers/locations.js";
import ridesRouter from "./src/routers/rides.js";
import usersRouter from "./src/routers/users.js";
import authenticationRouter from "./src/routers/authentication.js";
import getIpAddress from "./src/utilities/get-ip.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import db from "./src/config/database.js";
dotenv.config();

const app = express();

app.use(cors({ credentials:true, origin:'http://localhost:3000' }));
app.use(cookieParser());
app.use(express.json());

const port = process.env.PORT || 3737;

app.listen(port, () => {
  console.log(`Backend running on IP: ${getIpAddress(port)}`);
});

app.get("/", (req, res) => {
  res.send("API Running.");
});

app.use("/users", usersRouter);
app.use("/locations", locationsRouter);
app.use("/rides", ridesRouter)
app.use("/authentication", authenticationRouter)
