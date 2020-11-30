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

    connection.query("SELECT b.id as buyer, d.id as distributor , r.id as representative, b.email as email ,b.name as name, b.status as user_status, d.status as distributor_status, r.status as representative_status FROM public.buyers as b LEFT JOIN public.distributors as d ON b.id = d.buyer_id LEFT JOIN public.representatives as r ON b.id = r.buyer_id", (error, result) => {
        if (error) {
            res.send({
                success: false,
                message: error.message
            })
        }
        else {
            res.send({
                success: true,
                users: result.rows
            })
        }
    })

})

adminRoute.post('/getDistributor', (req, res) => {

    var id = req.body.id

    connection.query("SELECT * FROM distributors WHERE id = $1", [id], (error, result) => {
        if (error) {
            res.send({
                success: false,
                message: error.message
            })
        }
        else {
            connection.query('SELECT * FROM brands WHERE distributor_id = $1', [id], (error1, result1) => {
                if (error1) {
                    res.send({
                        success: false,
                        message: error1.message
                    })
                }
                else {
                    connection.query('SELECT * FROM certificates WHERE distributer_id = $1', [id], (error2, result2) => {
                        if (error2) {
                            res.send({
                                success: false,
                                message: error2.message
                            })
                        }
                        else {
                            res.send({
                                success: true,
                                distributor: result.rows[0],
                                brands: result1.rows,
                                certificates: result2.rows
                            })
                        }
                    })
                }
            })

        }
    })

})

adminRoute.post('/getRepresentative', (req, res) => {

    var id = req.body.id

    connection.query("SELECT * FROM representatives WHERE id = $1", [id], (error, result) => {
        if (error) {
            res.send({
                success: false,
                message: error.message
            })
        }
        else {
            res.send({
                success: true,
                message: "Representative fetched",
                representative: result.rows[0]
            })
        }
    })

})

adminRoute.post('/setDistributorStatus', (req, res) => {
    var id = req.body.id
    var status = req.body.status

    connection.query("UPDATE distributors SET status = $1 WHERE id = $2", [status, id], (error, result) => {
        if (error) {
            res.send({
                success: false,
                message: error.message
            })
        }
        else {
            res.send({
                success: true,
                message: "Status updated"
            })
        }
    })
})

adminRoute.post('/setRepresentativeStatus', (req, res) => {
    var id = req.body.id
    var status = req.body.status

    connection.query("UPDATE representatives SET status = $1 WHERE id = $2", [status, id], (error, result) => {
        if (error) {
            res.send({
                success: false,
                message: error.message
            })
        }
        else {
            res.send({
                success: true,
                message: "Status updated"
            })
        }
    })
})

adminRoute.post('/setBuyerStatus', (req, res) => {
    var id = req.body.id
    var status = req.body.status

    connection.query("UPDATE Buyers SET status = $1 WHERE id = $2", [status, id], (error, result) => {
        if (error) {
            res.send({
                success: false,
                message: error.message
            })
        }
        else {
            res.send({
                success: true,
                message: "Status updated"
            })
        }
    })
})

module.exports = adminRoute