var express = require('express')
var connection = require('../configs/db')
var adminRoute = express.Router()



adminRoute.post("/login", (req, res) => {

    var email = req.body.email
    var password = req.body.password

    connection.query("SELECT * FROM admin WHERE email= $1 AND password=$2", [email, password], (error, result) => {

        if (error) {
            res.send({
                success: false,
                message: error.message
            })
        }
        else {
            if (result.rows.length == 0) {
                res.send({
                    success: false,
                    message: "Invalid User Name or password"
                })
            }
            else {
                res.send({
                    success: true,
                    message: "Login sucessfully",
                    user: result.rows[0]
                })
            }
        }
    })
})

adminRoute.post("/register", (req, res) => {

    var email = req.body.email
    var password = req.body.password
    var type = req.body.type
    var phone = req.body.phone

    if (email && password && type && phone) {
        connection.query("SELECT * FROM admin WHERE email = $1", [email], (error, result) => {

            if (error) {
                res.send({
                    success: false,
                    message: error.message
                })
            }
            else {

                if (result.rows.length > 0) {

                    res.send({
                        success: false,
                        message: "User already exists"
                    })

                }
                else {
                    connection.query("Insert INTO admin(email,password,type,phone)  VALUES($1,$2,$3,$4) ", [email, password, type, phone], (error1, result1) => {

                        if (error1) {

                            res.send({
                                success: false,
                                message: error1.message
                            })
                        }
                        else {

                            res.send({
                                success: true,
                                message: "Users Registered"
                            })

                        }
                    })
                }
            }
        })
    }
    else {
        res.send({
            success: false,
            message: "Missing Fields"
        })
    }
})

adminRoute.post("/getallusers", (req, res) => {

    var id = req.body.id

    connection.query("SELECT * FROM Buyers WHERE id= $1 ", [id], (error, result) => {

        if (error) {
            res.send({
                success: false,
                message: error.message
            })
        }
        else {
            if (result.rows.length == 0) {
                res.send({
                    success: false,
                    message: "User not found"
                })
            }
            else {
                res.send({
                    success: true,
                    message: "User fetched",
                    user: result.rows[0]
                })
            }
        }
    })
})

module.exports = adminRoute