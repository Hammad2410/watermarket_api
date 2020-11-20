var express = require('express')
var profileRoute = express.Router()
var connection = require('../configs/db')
var sha1 = require('sha1')
var fs = require('fs')
var base64ToImage = require('base64-to-image');

profileRoute.post('/updateBuyerProfile', (req, res) => {
    var id = req.body.id
    var name = req.body.name
    var phone = req.body.phone
    var email = req.body.email

    if (id && name && phone && email) {
        connection.query(" UPDATE buyers SET name = $1, phone = $2 , email =$3 WHERE id = $4", [name, phone, email, id], (error, result) => {
            if (error) {
                res.send({
                    success: false,
                    message: error.message
                })
            }
            else {
                res.send({
                    success: true,
                    message: "Profile Updated"
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


module.exports = profileRoute