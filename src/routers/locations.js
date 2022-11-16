import { Router } from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();
const router = Router();
const GOOGLE_MAPS_KEY = process.env.MAPS_API_KEY;

router.get("/suggestions/:location", async (req, res) => {
  const { location } = req.params;

  if (location === "") res.json({ result: [] });
  else {
    const result = await fetch(
      "https://maps.googleapis.com/maps/api/place/autocomplete/json?input=" +
        location +
        "&components=country:lb" +
        "&key=" +
        GOOGLE_MAPS_KEY
    ).then((res) => res.json());

    res.json(result.predictions);
  }
});

router.get("/coordinates/:address", async (req, res) => {
  const { address } = req.params;
  try {
    const result = await fetch(
      "https://maps.googleapis.com/maps/api/geocode/json?address=" +
        address +
        "&key=" +
        GOOGLE_MAPS_KEY
    ).then((res) => res.json());

    res.json(result.results[0].geometry.location);
  } catch (e) {
    res.status(400).json("Invalid location");
  }
});

router.get("/possibleRoutes", async (req, res) => {
  const {
    start_id = "ChIJ-Ylp-M0QHxURZtOZgiymDpI",
    destination_id = "ChIJi7oiX0hbHxURmrRW3kLWd7c",
  } = req.query;

  const url =
    "https://maps.googleapis.com/maps/api/directions/json?origin=place_id:" +
    start_id +
    "&destination=place_id:" +
    destination_id +
    "&alternatives=true" +
    "&key=" +
    GOOGLE_MAPS_KEY;

  const result = await fetch(url).then((res) => res.json());

  res.json(result);
});

export default router;
