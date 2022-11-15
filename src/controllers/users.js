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

    const { name, email, password } = req.body;
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);

    connection.query(`INSERT INTO STUDENT (firstName, universityEmail,password) VALUES (${name},${email},${hashPassword})`, function(error, results) {
        if (results) {
            console.log(results)
        } else {
            console.log(error);
        }
    });
      
    res.json({msg: "Registration Successful"});

}
 
export const Login = async(req, res) => {
    console.log("********2");
    var user = undefined
    console.log(req.body.email.value)
    console.log(req.body.password.value)

    connection.query(`SELECT * FROM STUDENT WHERE universityEmail="${req.body.email.value}"`, function(error, results) {
        if (results) {
            console.log(results)
            users = results;
            var user = users.pop()
            if (user.length < 1) res.status(404).send("User not found.");
            const match =  bcrypt.compare(req.body.password.value, user.password);
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

    console.log(user)
    
  

}
 
export const Logout = async(req, res) => {
    console.log("********3");
    user = req.data
    if(!user[0]) return res.sendStatus(204);

    connection.query(`DELETE FROM STUDENT WHERE ID= ${user[0]}`, function(error, results) {
        if (results) {
            user = results;
        } else {
            console.log(error);
        }
    });

    return res.sendStatus(200);
}