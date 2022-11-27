import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { fetchData, generateCreateQuery } from "../functions/functions.js";
import buildQueryConditions from "../utilities/query-builder.js";
import createConnection from "../../config/databaseConfig.js";

var connection = createConnection();

const router = Router();

router.post('/register', (req, res) => {
    var par = req.body;
    var data = fetchData(par)
    console.log(data);
    const query = generateCreateQuery(data[0], [data[1]], "STUDENT")
        // const salt = await bcrypt.genSalt();
        // const hashPassword = await bcrypt.hash(password, salt);

    connection.query(query, function(error, results) {
        if (results) {
            const userId = results.insertId;
            const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET);
            res.status(200).json({ accessToken, userId });

        } else {
            console.log(error);
        }
    });


});
router.post('/login', (req, res) => {
    var par = req.body;
    var queryConditions = buildQueryConditions(
        ["studentID", par.ID], ["universityEmail", par.universityEmail]
    );
    connection.query(`SELECT * FROM STUDENT${queryConditions}`, function(error, results) {
        if (results) {
            if (results.length > 0) {
                let user = results.pop()
                const match = req.body.password === user.password;
                if (!match) return res.status(400).json({ msg: "Wrong Password" });
                const userId = user.ID;
                const firstName = user.firstName;
                const lastName = user.lastName;
                const email = user.email;
                const accessToken = jwt.sign({ userId, firstName, email }, process.env.ACCESS_TOKEN_SECRET);
                res.status(200).json({ accessToken, userId, firstName, lastName });
            } else res.status(404).send("User not found.");
        } else {
            console.log(error);
        }
    });

});
router.delete('/logout', (req, res) => {
    user = req.data
    if (!user[0]) return res.sendStatus(204);
    return res.sendStatus(200);

});

router.get('/universities', (req, res) => {
    connection.query(`SELECT ID,name FROM UNIVERSITY `, function(error, results) {
        console.log('universities');
        if (results) {
            let universities = results;
            res.json(universities);
        } else {
            console.log(error);
        }
    });
});

router.get("/campuses/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const query = `SELECT ID,name FROM CAMPUS WHERE universityId=${id}`;
    connection.query(`${query};`, function(error, results) {
        if (results) {
            let campuses = results
            console.log(campuses)
            res.json(campuses);
        } else {
            console.log(error);
        }
    });
});

export default router;