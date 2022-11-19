import { Router } from "express";
import createConnection from "../../config/databaseConfig.js";
import searchForDrivers from "../utilities/searchForDrivers.js";
import buildQueryConditions from "../utilities/query-builder.js";
import { fetchData, formatDate, formatTime, generateCreateQuery, generateDeleteQuery } from "../functions/functions.js";

var connection = createConnection();
const router = Router();

router.get("/getAllChats/:id", (req, res) => {
    const studentId = req.params.id;
    try {
        connection.query(
            `SELECT DISTINCT
            M.*, firstName, lastName
            FROM STUDENT S, MESSAGE M
            WHERE S.ID != ${studentId} AND M.chatID IN ( SELECT chatID FROM MESSAGE WHERE studentId = ${studentId}) ORDER BY date(date) DESC, time DESC LIMIT 1;`,
            function(error, results) {
                if (results) {
                    let output = results;
                    console.log(results);
                    res.json(output);
                } else {
                    console.log(error);
                }
            })
    } catch (e) {
        console.log(e)
    }
});

router.get("/:id", (req, res) => {
    const chatId = req.params.id;
    console.log(chatId)
    try {
        connection.query(
            `SELECT * FROM  MESSAGE WHERE chatID =${chatId} ORDER BY date(date) desc, time desc`,
            function(error, results) {
                if (results) {
                    let output = results;
                    console.log(results);
                    res.json(output);
                } else {
                    console.log(error);
                }
            });
    } catch (e) {
        console.log(e)
    }
});

router.post("/sendMessage", (req, res) => {
    var par = req.body;
    console.log(par);
    var data = fetchData(par);
    data[0].push(['date', 'time']);
    data[1].push(formatDate(new Date()).toString());
    data[1].push(formatTime(new Date()).toString());
    const query = generateCreateQuery(data[0], [data[1]], 'MESSAGE');
    console.log(query);
    connection.query(query, function(error, results) {
        if (results) {
            let output = results;
            console.log(results);
            res.json(output);
        } else {
            console.log(error);
        }
    })
})

export default router;