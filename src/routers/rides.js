import { Router } from "express";
import createConnection from "../../config/databaseConfig.js";
import searchForDrivers from "../utilities/searchForDrivers.js";
import buildQueryConditions from "../utilities/query-builder.js";
import formatLocalDate from "../utilities/format-date.js";
import {
    fetchData,
    generateCreateQuery,
    generateDeleteQuery,
} from "../functions/functions.js";
import fetch from "node-fetch";
import dotenv from "dotenv";
import orderQuery from "../utilities/order-by-query.js";

dotenv.config();
var connection = createConnection();
const router = Router();
const GOOGLE_MAPS_KEY = process.env.MAPS_API_KEY;

router.get("/", (req, res) => {
    const {
        driverId,
        searcherId,
        departureCoordinates,
        destinationCoordinates,
        pickupCoordinates,
        dateOfDeparture,
        numberOfSeats,
        minPrice,
        maxPrice,
        orderBy,
        descending,
    } = req.query;

    let minDateTime = undefined;
    let maxDateTime = undefined;

    if (dateOfDeparture) {
        minDateTime = new Date(dateOfDeparture);
        maxDateTime = new Date(dateOfDeparture);

        minDateTime.setHours(maxDateTime.getHours() - 2);
        maxDateTime.setHours(maxDateTime.getHours() + 2);
    }

    var queryConditions = buildQueryConditions(
        ["studentId", driverId], ["studentId", searcherId, "!="], ["departureCoordinates", departureCoordinates], ["destinationCoordinates", destinationCoordinates], ["numberOfAvailableSeats", numberOfSeats, ">="], ["price", [minPrice, maxPrice]],
        dateOfDeparture ?
        [
            "dateOfDeparture", [formatLocalDate(minDateTime), formatLocalDate(maxDateTime)],
        ] :
        undefined
    );

    queryConditions = orderQuery(queryConditions,orderBy,descending)

    console.log(queryConditions)
    connection.query(
        `SELECT * FROM RIDE${queryConditions};`,
        function(error, results) {
            if (results) {
                if (results.length > 0) {
                    let rides = results.map((ride) => ({
                        ...ride,
                        departureCoordinates: JSON.parse(ride.departureCoordinates),
                        destinationCoordinates: JSON.parse(ride.destinationCoordinates),
                        dateOfDeparture: new Date(ride.dateOfDeparture),
                        dateOfCreation: new Date(ride.dateOfCreation),
                    }));
                    if (pickupCoordinates) {
                        try {
                            const { latitude, longitude } = JSON.parse(pickupCoordinates);
                            res
                                .status(200)
                                .json(searchForDrivers(latitude, longitude, rides));
                        } catch (e) {
                            console.error(e);
                        }
                    } else res.status(200).json(rides);
                } else res.status(200).send([]);
            } else {
                console.error(error);
            }
        }
    );
});

router.post("/", async(req, res) => {
    var par = req.body;
    const rideDetails = {
        ...par,
        dateOfDeparture: formatLocalDate(new Date(par.dateOfDeparture)),
        dateOfCreation: formatLocalDate(new Date()),
    };

    var store = false;
    if (par.route) {
        store = true;
    } else {
        const url =
            "https://maps.googleapis.com/maps/api/directions/json?origin=" +
            `${JSON.parse(rideDetails.departureCoordinates).latitude},${
        JSON.parse(rideDetails.departureCoordinates).longitude
      }` +
            "&destination=" +
            `${JSON.parse(rideDetails.destinationCoordinates).latitude},${
        JSON.parse(rideDetails.destinationCoordinates).longitude
      }` +
            "&alternatives=true" +
            "&key=" +
            GOOGLE_MAPS_KEY;

        const result = await fetch(url).then(async(res) => {
            const data = await res.json();
            if (data.status === "NOT_FOUND") return undefined;
            else return data.routes.map((route) => route.overview_polyline.points);
        });
        if (!result) res.status(400).json("No route found.");
        else {
            if (result.length === 1) {
                rideDetails.route = result[0];
                store = true;
            } else
                res
                .status(200)
                .json({ status: "REQUIRE_ROUTE_SELECTION", content: result });
        }
    }
    if (store) {
        var data = fetchData(rideDetails);
        const query = generateCreateQuery(data[0], [data[1]], "RIDE");
        connection.query(query.replace(/\\/g, "\\\\"), function(error, results) {
            if (results) {
                res.status(201).json({ status: "SUCCESS" });
            } else {
                console.error(error);
                res
                    .status(400)
                    .json({ status: "FAILED", content: "Failed to create ride." });
            }
        });
    }
});

router.get("/stopRequests", (req, res) => {
    const { rideId, studentId } = req.query;
    var queryConditions = buildQueryConditions(
        ["rideId", rideId], ["studentId", studentId]
    );
    connection.query(
        `SELECT * FROM STOPREQUEST${queryConditions};`,
        function(error, results) {
            if (results) {
                let output = results;
                res.json(output);
            } else {
                console.error(error);
            }
        }
    );
});

router.post("/", (req, res) => {
    var par = req.body;
    var data = fetchData(par);
    const query = generateCreateQuery(data[0], [data[1]], 'RIDE');
    connection.query(query, function(error, results) {
        if (results) {
            console.log(results);
        }
    })
    res.status(200).json('created a ride');
});

router.post("/stoprequests", (req, res) => {
    var par = req.body;
    var data = fetchData(par);
    const query = generateCreateQuery(data[0], [data[1]], "STOPREQUEST");
    connection.query(query, function(error, results) {
        if (results) {
            console.log(results);
        }
    });
    res.status(200).json("request ride");
});

router.get("/stopRequests/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const query = `SELECT * FROM STOPREQUEST WHERE id = ${id}`;
    connection.query(`${query};`, function(error, results) {
        if (results) {
            let stopRequest = results;
            if (stopRequest.length > 0) res.status(200).json(stopRequest.pop());
            else res.status(404).send("Stop request not found.");
        } else console.error(error);
    });
});

router.delete("/stoprequests/:id", (req, res) => {
    var id = req.params.id;
    var query = generateDeleteQuery(id, "ID", "STOPREQUEST");
    connection.query(query, function(error, results) {
        if (results) {
            console.log(results);
        }
    });
    res.status(200).json("Deleted stop request");
});

router.get("/:id", (req, res) => {
    const id = parseInt(req.params.id);

    const query = `SELECT * FROM RIDE WHERE ID = ${id}`;
    connection.query(`${query};`, function(error, results) {
        if (results) {
            if (results.length > 0) {
                let ride = results.pop();
                ride = {
                    ...ride,
                    departureCoordinates: JSON.parse(ride.departureCoordinates),
                    destinationCoordinates: JSON.parse(ride.destinationCoordinates),
                };
                res.status(200).json(ride);
            } else res.status(404).send("No Rides Found.");
        } else {
            console.error(error);
        }
    });
});

router.delete("/:id", (req, res) => {
    var id = req.params.id;
    var query = generateDeleteQuery(id, "ID", "RIDE");
    connection.query(query, function(error, results) {
        if (results) {
            console.log(results);
        }
    });
    res.status(200).json("Deleted ride");
});

export default router;