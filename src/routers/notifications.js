import { Router } from "express";
import admin  from "../../config/firebaseconfig.js";

const router = Router();

const tokens = [];


router.post("/register", (req, res) => {
    tokens.push(req.body.token);
    res.status(200).json({ message: "Successfully registered FCM Token!" });
  });
  
  router.post("/", async (req, res) => {
    try {
      const { title, body, imageUrl } = req.body;
      await admin.messaging().sendMulticast({
        tokens,
        notification: {
          title,
          body,
          imageUrl,
        },
      });
      res.status(200).json({ message: "Successfully sent notifications!" });
    } catch (err) {
      res
        .status(err.status || 500)
        .json({ message: err.message || "Something went wrong!" });
    }
  });