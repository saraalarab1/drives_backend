import express from "express";
import locationsRouter from "./src/routers/locations.js";
import ridesRouter from "./src/routers/rides.js";
import usersRouter from "./src/routers/users.js";
import getIpAddress from "./src/utilities/get-ip.js";
import createConnection from "./config/databaseConfig.js";

const app = express();
app.use(express.json());
var connection = createConnection();
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