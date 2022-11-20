import { Router } from "express";
import { users } from "../utilities/mock-data.js";
import createConnection from "../../config/databaseConfig.js";
import {
    fetchData,
    generateCreateQuery,
    generateDeleteQuery,
} from "../functions/functions.js";
var connection = createConnection();
const router = Router();

router.get("/", (req, res) => {
    connection.query(
        `SELECT * FROM STUDENT`,
        function(error, results) {
            if (results) {
                var users = results;
                if (users.length > 0) res.status(200).json(users);
                else res.status(404).send("No Users found.");
            } else console.error(error);
        }
    );
});

router.get("/:id", (req, res) => {
    const id = parseInt(req.params.id);
    // var user = users.filter((user) => user.id === id);
    connection.query(
        `SELECT * FROM STUDENT WHERE ID= ${id}`,
        function(error, results) {
            if (results) {
                var user = results;
                if (user.length > 0) res.status(200).json(user.pop());
                else res.status(404).send("User not found.");
            } else console.error(error);
        }
    );
});

router.patch("/:id", (req, res) => {
    console.log(req.body);
    connection.query(
        `UPDATE STUDENT SET firstName = '${req.body.firstName}', lastName = '${req.body.lastName}', phoneNumber = ${req.body.phoneNumber}, dateOfBirth = '${req.body.dateOfBirth}' WHERE ID = ${req.body.studentId};`,
        function(error, results) {
            if (results) {
                console.log(results);
                res.send(200).json(results);
            } else console.error(error);
        }
    )
})
router.get("/car/:id", (req, res) => {
    const id = parseInt(req.params.id);

    connection.query(
        `SELECT * FROM CAR WHERE studentId= ${id}`,
        function(error, results) {
            if (results) {
                let car = results;
                if (car.length > 0) res.status(200).json(car.pop());
                else res.status(404).send("car not found.");
            } else console.error(error);

        });
});

router.post("/car", (req, res) => {
    var par = req.body;
    var data = fetchData(par);
    const query = generateCreateQuery(data[0], [data[1]], "CAR");
    connection.query(query, function(error, results) {
        if (results) {
            console.log(results);
        }
    });
    res.status(200).json("add car ");
});

router.delete("/car/:id", (req, res) => {
    const id = parseInt(req.params.id);
    var query = generateDeleteQuery(id, "studentId", "CAR");

    connection.query(query, function(error, results) {
        if (results) {
            console.log(results)
        } else {
            console.error(error);
        }
    });
    res.status(200).json("Deleted car");

});

export default router;