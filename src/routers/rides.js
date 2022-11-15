import { Router } from "express";
import { rides, stopRequests } from "../utilities/mock-data.js";
import createConnection from "../../config/databaseConfig.js";
import searchForDrivers from "../utilities/searchForDrivers.js";

var connection = createConnection();
const router = Router();

router.get("/stopRequests", (req, res) => {
    const { rideID, studentID } = req.query;
    var query = 'SELECT * FROM STOPREQUEST ';
    if (rideID || studentID) {
        query += 'WHERE';
    }
    if (rideID) {
        query += ` rideID = ${rideID}`;
    }
    if (rideID && studentID) {
        query += ' & ';
    }
    if (studentID) {
        query += ` studentID = ${studentID}`;
    }
    connection.query(`${query};`, function(error, results) {
        if (results) {
            let output = results;
            res.json(output);

        } else {
            console.log(error);
        }
    });

    // output = output.filter(
    //   (stopRequest) => stopRequest.rideID === parseInt(rideID)
    // );

    // if (studentID)
    //     output = output.filter(
    //         (stopRequest) => stopRequest.studentID === parseInt(studentID)
    //     );

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
    const { driverID } = req.query;
    if (driverID) {
        const query = `SELECT * FROM RIDE WHERE studentID = ${driverID}`;
        connection.query(`${query};`, function(error, results) {
            if (results) {
                let rides = results;
                if (rides.length > 0) res.status(200).json(rides);
                else res.status(404).send("No Rides Found.");
  const { driverID, location } = req.query;
  let output = rides;
  if (driverID)
    output = output.filter(
      (stopRequest) => stopRequest.driverID === parseInt(driverID)
    );
  if (location) {
    try {
      const latLng = JSON.parse(location);
      output = searchForDrivers(latLng[0], latLng[1]);
    } catch (e) {
      console.log(e);
      output = "Invalid location format.";
    }
  }

            } else {
                console.log(error);
            }
        });
    } else res.status(404).send('Please select a driver');

});

router.get("/:id", (req, res) => {
    const id = parseInt(req.params.id);

    const query = `SELECT * FROM RIDE WHERE ID = ${id}`;
    connection.query(`${query};`, function(error, results) {
        if (results) {
            let rides = results;
            if (rides.length > 0) res.status(200).json(rides.pop());
            else res.status(404).send("No Rides Found.");

        } else {
            console.log(error);
        }
    });

});

export default router;