import { Router } from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();
const router = Router();
const GOOGLE_MAPS_KEY = process.env.MAPS_API_KEY;

router.get("/suggestions/:location", async (req, res) => {
  const location = req.params.location;

  if (location === "") res.json({ result: [] });
  else {
    const result = await fetch(
      "https://maps.googleapis.com/maps/api/place/autocomplete/json?input=" +
        location +
        "&components=country:lb" +
        "&key=" +
        GOOGLE_MAPS_KEY
    ).then((res) => res.json());

    res.json({ result: result.predictions });
  }
});

router.get("/details/:place_id", async (req, res) => {
  const place_id = req.params.place_id;

  const result = await fetch(
    "https://maps.googleapis.com/maps/api/place/details/json?place_id=" +
      place_id +
      "&key=" +
      GOOGLE_MAPS_KEY
  ).then((res) => res.json());

  res.json({ result: result.result.geometry.location });
});

router.get("/possibleRoutes", async (req, res) => {
  let start_id = req.query.start_id || "ChIJ-Ylp-M0QHxURZtOZgiymDpI";
  let destination_id =
    req.query.destination_id || "ChIJi7oiX0hbHxURmrRW3kLWd7c";

  const url =
    "https://maps.googleapis.com/maps/api/directions/json?origin=place_id:" +
    start_id +
    "&destination=place_id:" +
    destination_id +
    "&alternatives=true" +
    "&key=" +
    GOOGLE_MAPS_KEY;
  const result = await fetch(url).then((res) => res.json());

  res.json({ result: result });
});

export default router;
