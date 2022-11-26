import { Router } from "express";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { fetchData, generateCreateQuery } from "../functions/functions.js";
import buildQueryConditions from "../utilities/query-builder.js";
import createConnection from "../../config/databaseConfig.js";

var connection = createConnection();

const router = Router();

router.post("/register", (req, res) => {
  var par = req.body;

  connection.query(
    `SELECT * FROM STUDENT WHERE universityEmail = ${par.universityEmail}`,
    function (error, results) {
      if (results) {
        if (results.length > 0) res.status(400).json("Email already in use.");
        else {
          const salt = crypto.randomBytes(16).toString("hex");
          const hash = crypto
            .pbkdf2Sync(par.password, salt, 1000, 64, "sha512")
            .toString("hex");

          var data = fetchData({
            firstName: par.firstName,
            lastName: par.lastName,
            phoneNumber: par.phoneNumber,
            dateOfBirth: par.dateOfBirth,
            universityEmail: par.universityEmail,
            verifiedDriver: "NULL",
            campusId: par.campusId,
            salt,
            hash,
          });

          const query = generateCreateQuery(data[0], [data[1]], "STUDENT");

          connection.query(query, function (error, results) {
            if (results) {
              const userId = results.insertId;
              const accessToken = jwt.sign(
                { userId },
                process.env.ACCESS_TOKEN_SECRET
              );
              res.status(200).json({ accessToken, userId });
            } else {
              console.error(error);
            }
          });
        }
      } else {
        console.error(error);
      }
    }
  );
});

router.post("/login", (req, res) => {
  var par = req.body;
  var queryConditions = buildQueryConditions(
    ["studentID", par.ID],
    ["universityEmail", par.universityEmail]
  );
  connection.query(
    `SELECT * FROM STUDENT${queryConditions}`,
    function (error, results) {
      if (results) {
        if (results.length > 0) {
          let user = results.pop();

          const { salt, hash } = user;
          const valid =
            hash ===
            crypto
              .pbkdf2Sync(password, salt, 1000, 64, "sha512")
              .toString("hex");
          if (!valid) res.status(400).send("Invalid username or password.");
          else {
            const userId = user.ID;
            const firstName = user.firstName;
            const lastName = user.lastName;
            const email = user.email;
            const accessToken = jwt.sign(
              { userId, firstName, email },
              process.env.ACCESS_TOKEN_SECRET
            );
            res.status(200).json({ accessToken, userId, firstName, lastName });
          }
        } else res.status(400).send("Invalid username or password.");
      } else {
        console.error(error);
      }
    }
  );
});

router.get("/universities", (req, res) => {
  connection.query(
    `SELECT ID,name FROM UNIVERSITY `,
    function (error, results) {
      if (results) {
        let universities = results;
        res.json(universities);
      } else {
        console.error(error);
      }
    }
  );
});

router.get("/campuses/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const query = `SELECT ID,name FROM CAMPUS WHERE universityId=${id}`;
  connection.query(`${query};`, function (error, results) {
    if (results) {
      res.status(200).json(results);
    } else {
      console.error(error);
    }
  });
});

export default router;
