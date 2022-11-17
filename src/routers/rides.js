import { Router } from "express";
import createConnection from "../../config/databaseConfig.js";
import searchForDrivers from "../utilities/searchForDrivers.js";
import buildQueryConditions from "../utilities/query-builder.js";
import { fetchData, generateCreateQuery, generateDeleteQuery } from "../functions/functions.js";

var connection = createConnection();
const router = Router();

router.get("/stopRequests", (req, res) => {
    const { rideID, studentID } = req.query;
    var queryConditions = buildQueryConditions(
        ["rideID", rideID], ["studentID", studentID]
    );
    connection.query(
        `SELECT * FROM STOPREQUEST${queryConditions};`,
        function(error, results) {
            if (results) {
                let output = results;
                res.json(output);
            } else {
                console.log(error);
            }
        }
    );
});

router.get("/stopRequests/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const query = `SELECT * FROM STOPREQUEST WHERE id = ${id}`;
    connection.query(`${query};`, function(error, results) {
        if (results) {
            let stopRequest = results;
            if (stopRequest.length > 0) res.status(200).json(stopRequest.pop());
            else res.status(404).send("Stop request not found.");
        } else {
            console.log(error);
        }
    });
});

router.get("/", (req, res) => {
    const {
        driverID,
        departureCoordinates,
        destinationCoordinates,
        pickupCoordinates,
    } = req.query;

    var queryConditions = buildQueryConditions(
        ["studentID", driverID], ["departureCoordinates", departureCoordinates], ["destinationCoordinates", destinationCoordinates]
    );

    connection.query(
        `SELECT * FROM RIDE${queryConditions};`,
        function(error, results) {
            if (results) {
                if (results.length > 0) {
                    let rides = results.map((ride) => ({
                        ...ride,
                        departureCoordinates: JSON.parse(ride.departureCoordinates),
                        destinationCoordinates: JSON.parse(ride.destinationCoordinates),
                    }));
                    if (pickupCoordinates) {
                        try {
                            const { latitude, longitude } = JSON.parse(pickupCoordinates);
                            res
                                .status(200)
                                .json(searchForDrivers(latitude, longitude, rides));
                        } catch (e) {
                            console.log(e);
                        }
                    } else res.status(200).json(rides);
                } else res.status(200).send([]);
            } else {
                console.log(error);
            }
        }
    );
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
            console.log(error);
        }
    });
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
})
router.post("/stoprequests", (req, res) => {
    var par = req.body;
    var data = fetchData(par);
    const query = generateCreateQuery(data[0], [data[1]], 'STOPREQUEST');
    connection.query(query, function(error, results) {
        if (results) {
            console.log(results);
        }
    })
    res.status(200).json('request ride');
})
router.delete("/:id", (req, res) => {
    var id = req.params.id;
    var query = generateDeleteQuery(id, 'ID', 'RIDE');
    connection.query(query, function(error, results) {
        if (results) {
            console.log(results);
        }
    });
    res.status(200).json('Deleted ride');

})

router.delete("/stoprequests/:id", (req, res) => {
    var id = req.params.id;
    var query = generateDeleteQuery(id, 'ID', 'STOPREQUEST');
    connection.query(query, function(error, results) {
        if (results) {
            console.log(results);
        }
    });
    res.status(200).json('Deleted stop request');

})
export default router;