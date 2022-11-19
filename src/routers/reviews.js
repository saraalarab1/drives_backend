import { Router } from "express";
import createConnection from "../../config/databaseConfig.js";
import buildQueryConditions from "../utilities/query-builder.js";
import {
  fetchData,
  generateCreateQuery,
  generateDeleteQuery,
} from "../functions/functions.js";

var connection = createConnection();
const router = Router();

router.get("/", (req, res) => {
  const {
    driverID,
    rideID,
     
  } = req.query;

  var queryConditions = buildQueryConditions(
      ["studentId", driverID], ["rideId", rideID]
  );

connection.query(
  `SELECT * FROM REVIEW${queryConditions};`,
  function (error, results) {
    if (results) {
      if (results.length > 0) {
        let reviews = results
        res.status(200).json(reviews);
      } else res.status(200).send([]);
    } else {
      console.error(error);
    }
  }
);
});

router.post("/", (req, res) => {
  var par = req.body;
  const now = new Date();
  const reviewDetails = {
    ...par,
    date: now.toISOString().slice(0, 10),
    time: now.toLocaleTimeString().split(" ")[0],
  };
  var data = fetchData(reviewDetails);
  const query = generateCreateQuery(data[0], [data[1]], "REVIEW");
  connection.query(query, function (error, results) {
    if (results) {
      console.log(results);
    } else {
      console.error(error);
    }
  });
  res.status(200).json("Added a review");
});

router.get("/:id", (req, res) => {
  const id = parseInt(req.params.id);

  const query = `SELECT * FROM REVIEW WHERE ID = ${id}`;
  connection.query(`${query};`, function (error, results) {
    if (results) {
      if (results.length > 0) { 
        let review = results.pop();
        res.status(200).json(review);
      } else res.status(404).send("No Review Found.");
    } else {
      console.error(error);
    }
  });
});

router.delete("/:id", (req, res) => {
  var id = req.params.id;
  var query = generateDeleteQuery(id, "ID", "REVIEW");
  connection.query(query, function (error, results) {
    if (results) {
      console.log(results);
    }
  });
  res.status(200).json("Deleted review");
});

router.get("/comments", (req, res) => {
  const { reviewId, studentID } = req.query;
  var queryConditions = buildQueryConditions(
    ["reviewID", reviewId],
    ["studentID", studentID]
  );
  connection.query(
    `SELECT * FROM REVIEW${queryConditions};`,
    function (error, results) {
      if (results) {
        let output = results;
        res.json(output);
      } else {
        console.error(error);
      }
    }
  );
});

router.post("/comments", (req, res) => {
    var par = req.body;
    var data = fetchData(par);
    const query = generateCreateQuery(data[0], [data[1]], "COMMENT");
    connection.query(query, function (error, results) {
      if (results) {
        console.log(results);
      }
    });
    res.status(200).json("add comment");
  });

router.get("/comments/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const query = `SELECT * FROM COMMENT WHERE id = ${id}`;
    connection.query(`${query};`, function (error, results) {
      if (results) {
        let comment = results;
        if (comment.length > 0) res.status(200).json(comment.pop());
        else res.status(404).send("Stop request not found.");
      } else console.error(error);
    });
  });


router.delete("/comments/:id", (req, res) => {
  var id = req.params.id;
  var query = generateDeleteQuery(id, "ID", "COMMENT");
  connection.query(query, function (error, results) {
    if (results) {
      console.log(results);
    }
  });
  res.status(200).json("Deleted stop request");
});
export default router;
