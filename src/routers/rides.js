import { Router } from "express";
import { rides, stopRequests } from "../utilities/mock-data.js";
import searchForDrivers from "../utilities/searchForDrivers.js";

const router = Router();

router.get("/stopRequests", (req, res) => {
  const { rideID, studentID } = req.query;
  let output = stopRequests;

  if (rideID)
    output = output.filter(
      (stopRequest) => stopRequest.rideID === parseInt(rideID)
    );

  if (studentID)
    output = output.filter(
      (stopRequest) => stopRequest.studentID === parseInt(studentID)
    );

  res.json(output);
});

router.get("/stopRequests/:id", (req, res) => {
  const id = parseInt(req.params.id);

  const stopRequest = stopRequests.filter(
    (stopRequest) => stopRequest.id === id
  );

  if (stopRequest.length > 0) res.status(200).json(stopRequest.pop());
  else res.status(404).send("Stop request not found.");
});

router.get("/", (req, res) => {
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

  res.json(output);
});

router.get("/:id", (req, res) => {
  const id = parseInt(req.params.id);

  const ride = rides.filter((ride) => ride.id === id);

  if (ride.length > 0) res.status(200).json(ride.pop());
  else res.status(404).send("Ride not found.");
});

export default router;
