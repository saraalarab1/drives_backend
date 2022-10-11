import { Router } from "express";
import { users } from "../utilities/mock-data.js";

const router = Router();

router.get("/", (req, res) => {
  res.json(users);
});

router.get("/:id", (req, res) => {
  const id = parseInt(req.params.id);

  const user = users.filter((user) => user.id === id);

  if (user.length > 0) res.status(200).json(user.pop());
  else res.status(404).send("User not found.");
});

export default router;
