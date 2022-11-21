import mysql from "mysql";

// var config = {
//         host: 'sql7.freemysqlhosting.net',
//         user: 'sql7573674',
//         password: '2RSm9265gD',
//         database: 'sql7573674'
//     }
var config = {
        host: 'sql7.freemysqlhosting.net',
        user: 'sql7573674',
        password: '2RSm9265gD',
        database: 'sql7573674'
    }
    // var config = {
    //     host: 'localhost',
    //     user: 'root',
    //     password: 'root',
    //     database: 'drives'
    // }
var connection = mysql.createConnection(config); //added the line
connection.connect(function(err) {
    if (err) {
        console.log('error connecting:' + err.stack);
    }
    console.log('connected successfully to DB.');
});

export default function createConnection() {
    return mysql.createConnection(config)
}