var express = require('express')
var connection = require('../configs/db')
var adminRoute = express.Router()
var jwt = require('jsonwebtoken')


adminRoute.post("/login", (req, res) => {

    var email = req.body.email
    var password = req.body.password
    var token = jwt.sign({ email, password }, "adminToken", { expiresIn: '10000s' })


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
                    user: result.rows[0],
                    token: token
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

adminRoute.get('/getUsers', (req, res) => {

    connection.query("SELECT b.id as buyer, d.id as distributor , r.id as representative, b.email as email ,b.name as name, b.status FROM public.buyers as b LEFT JOIN public.distributors as d ON b.id = d.buyer_id LEFT JOIN public.representatives as r ON b.id = r.buyer_id", (error, result) => {
        if (error) {
            res.send({
                success: false,
                message: error.message
            })
        }
        else {

            console.log("Result: ", result.rows)

            // var users = result.rows.map((user) => {
            //     return ({
            //         buyer: JSON.parse(user.buyer),

            //     })
            // })

            res.send({
                success: true,
                users: result.rows
            })
        }
    })

})

module.exports = adminRoute