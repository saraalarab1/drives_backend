import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import createConnection from "../../config/databaseConfig.js";
var connection = createConnection();

export const getUsers = async(req, res) => {
    connection.query(`SELECT * FROM STUDENT `, function(error, results) {
        if (results) {
            const users = results;
            res.json(users);
        } else {
            console.log(error);
        }
    });
}
 
export const Register = async(req, res) => {
    console.log("********1");
    console.log(req.body)
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const email = req.body.email;
    const password = req.body.password; 
    // const salt = await bcrypt.genSalt();
    // const hashPassword = await bcrypt.hash(password, salt);

    connection.query(`INSERT INTO STUDENT (firstName,lastName, universityEmail,password, campusID) VALUES ("${firstname}","${lastname}","${email}","${password}",1)`, function(error, results) {
        if (results) {
            console.log(results)
        } else {
            console.log(error);
        }
    });
      
    res.json({msg: "Registration Successful"});

}
 
export const Login = async(req, res) => {
    connection.query(`SELECT * FROM STUDENT WHERE universityEmail="${req.body.email}"`, function(error, results) {
        if (results) {
            var users = results;
            var user = users.pop()
            if (user.length < 1) res.status(404).send("User not found.");
            const match =  req.body.password === user.password;
            if(!match) return res.status(400).json({msg: "Wrong Password"});
            const userId = user.id;
            const firstName = user.firstName;
            const email = user.email;
            const accessToken = jwt.sign({userId, firstName, email}, process.env.ACCESS_TOKEN_SECRET);
            res.status(200).json({ accessToken });
        } else {
            console.log(error);
        }
    });    
}
 
export const Logout = async(req, res) => {
    user = req.data
    if(!user[0]) return res.sendStatus(204);

    // connection.query(`DELETE FROM STUDENT WHERE ID= ${user[0]}`, function(error, results) {
    //     if (results) {
    //         user = results;
    //     } else {
    //         console.log(error);
    //     }
    // });

    return res.sendStatus(200);
}