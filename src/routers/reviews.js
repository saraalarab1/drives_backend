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
    connection.query(query, function(error, results) {
        if (results) {
            console.log(results);
        } else {
            console.error(error);
        }
    });
    res.status(200).json("Added a review");
});

router.get("/", (req, res) => {
    var queryConditions = buildQueryConditions(["ID", req.query.ID], ["studentId", req.query.studentId], ["rideID", req.query.rideId]);
    console.log(req.query)
    var query = `SELECT * FROM REVIEW ${queryConditions}`

    if (req.query.studentId)
        query = `SELECT REVIEW.ID as reviewId, REVIEW.*, STUDENT.* FROM REVIEW JOIN STUDENT ON REVIEW.studentId = STUDENT.ID WHERE REVIEW.studentID = ${req.query.studentId}`
    connection.query(`${query};`, function(error, results) {
        if (results) {
            if (results.length > 0) {
                res.status(200).json(results);
            } else res.status(404).send("No Review Found.");
        } else {
            console.error(error);
        }
    });
});

router.delete("/:id", (req, res) => {
    var id = req.params.id;
    var query = generateDeleteQuery(id, "ID", "REVIEW");
    connection.query(query, function(error, results) {
        if (results) {
            console.log(results);
        }
    });
    res.status(200).json("Deleted review");
});

router.get("/comments", (req, res) => {
    console.log('fetching comments')
    const { reviewId, studentID } = req.query;
    var queryConditions = buildQueryConditions(
        ["reviewID", req.query.reviewId], ["studentID", req.query.studentId]
    );
    var query = `SELECT * FROM COMMENT ${queryConditions};`
    if (reviewId) {
        query = `SELECT COMMENT.ID as commentId, COMMENT.*, STUDENT.* FROM COMMENT JOIN STUDENT ON STUDENT.ID = COMMENT.studentId WHERE reviewID = ${reviewId} ORDER BY COMMENT.ID DESC`;
    }
    connection.query(
        query,
        function(error, results) {
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
    console.log(query);
    connection.query(query, function(error, results) {
        if (results) {
            console.log(results);
        } else {
            console.error(error);
        }
    });
    res.status(200).json("add comment");
});

router.get("/comments/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const query = `SELECT * FROM COMMENT WHERE id = ${id}`;
    connection.query(`${query};`, function(error, results) {
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
    connection.query(query, function(error, results) {
        if (results) {
            console.log(results);
        }
    });
    res.status(200).json("Deleted stop request");
});
export default router;