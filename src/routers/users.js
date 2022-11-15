import { Router } from "express";
import { users } from "../utilities/mock-data.js";
import createConnection from "../../config/databaseConfig.js";

var connection = createConnection();
const router = Router();

router.get("/", (req, res) => {
    res.json(users);
});

router.get("/:id", (req, res) => {
    const id = parseInt(req.params.id);

    // var user = users.filter((user) => user.id === id);
    connection.query(`SELECT * FROM STUDENT WHERE ID= ${id}`, function(error, results) {
        if (results) {
            var user = results;
            if (user.length > 0) res.status(200).json(user.pop());
            else res.status(404).send("User not found.");
        } else {
            console.log(error);
        }
    });
});

export default router;