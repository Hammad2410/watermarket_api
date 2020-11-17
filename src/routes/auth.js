var express = require('express')
const con = require('../configs/db')
var authRoute = express.Router()
var connection = require('../configs/db')
var sha1 = require('sha1')
var fs = require('fs')

authRoute.post('/registerBuyer', (req, res) => {
    var phone = req.body.phone
    var otp = 111111

    if (phone) {

        connection.query("SELECT * FROM buyers WHERE phone = $1", [phone], (error1, result1) => {
            if (error1) {
                res.send({
                    success: false,
                    message: error1.message
                })
            }
            else {
                if (result1.rows.length > 0) {
                    res.send({
                        success: false,
                        message: 'Phone Number already exists'
                    })
                }
                else {
                    connection.query("INSERT INTO buyers(phone,otp) VALUES($1,$2) returning id", [phone, otp], (error, result) => {
                        if (error) {
                            res.send({
                                success: false,
                                message: error.message
                            })
                        }
                        else {
                            res.send({
                                success: true,
                                message: "Activation Code sent",
                                id: result.rows[0].id
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

authRoute.post('/verifyBuyer', (req, res) => {
    var phone = req.body.phone
    var code = req.body.code

    if (phone && code) {
        connection.query("SELECT * FROM buyers WHERE phone = $1 AND otp = $2", [phone, code], (error, result) => {
            if (error) {
                res.send({
                    success: false,
                    message: error.message
                })
            }
            else {
                if (result.rows.length > 0) {
                    res.send({
                        success: true,
                        message: "Activation Code verified"
                    })
                }
                else {
                    res.send({
                        success: false,
                        message: "Invalid Code"
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

authRoute.post("/updateBuyerLocation", (req, res) => {
    var id = req.body.id
    var location = req.body.location

    if (id && location) {
        connection.query("UPDATE buyers SET location = $1 WHERE id = $2 ", [JSON.stringify(location), id], (error, result) => {
            if (error) {
                res.send({
                    success: false,
                    message: error.message
                })
            }
            else {
                res.send({
                    success: true,
                    message: 'location updated'
                })
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



authRoute.post('registerDistributor', (req, res) => {

    var service_type = req.body.service_type
    var phone = req.body.phone
    var name = req.body.name
    var email = req.body.email
    var password = sha1(req.body.password)

    fs.writeFileSync(`../uploads/commercial_register/${phone}`, req.body.commercial_register, (response) => {

    })

})

authRoute.post('/upload', (req, res) => {
    var phone = req.body.phone


    fs.writeFileSync(`../uploads/commercial_register/lll.jpg`, req.body.commercial_register, (response) => {
        console.log(response)
    })

    res.send({
        success: true
    })

})



module.exports = authRoute