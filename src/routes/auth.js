var express = require('express')
var authRoute = express.Router()
var connection = require('../configs/db')
var sha1 = require('sha1')
var fs = require('fs')
var base64ToImage = require('base64-to-image');

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

    console.log(code)

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



authRoute.post('/registerDistributor', (req, res) => {

    var service_type = JSON.stringify(req.body.service_type)
    var phone = req.body.phone
    var name = req.body.name
    var email = req.body.email
    var password = sha1(req.body.password)
    var commercial_register = req.body.commercial_register
    var national_id = req.body.national_id
    var location = req.body.location
    var certificates = req.body.certificates
    var brands = req.body.brands
    var about = req.body.about
    var otp = 111111



    if (service_type && phone && name && email && password && commercial_register && national_id && location && certificates && brands && about) {
        connection.query("SELECT * FROM distributors WHERE phone = $1 OR email = $2", [phone, email], (error, result) => {
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
                        message: "user already exists"
                    })
                }
                else {

                    connection.query("SELECT * FROM buyers WHERE phone = $1", [phone], (error1, result1) => {
                        if (error1) {
                            res.send({
                                success: false,
                                message: error1.message
                            })
                        }
                        else {
                            if (result1.rows.length == 0) {
                                connection.query("INSERT INTO buyers(phone,otp) VALUES($1,$2) returning id", [phone, otp], (error2, result2) => {
                                    if (error) {
                                        res.send({
                                            success: false,
                                            message: error2.message
                                        })
                                    }
                                    else {
                                        var commercial_register_path = base64ToImage(commercial_register, "uploads/commercial_register/", { fileName: `${email}.jpeg` })
                                        var national_id_path = base64ToImage(national_id, "uploads/national_id/", { fileName: `${email}_distributor.jpeg` })

                                        connection.query("INSERT INTO distributors(service_type,name,email,phone, password,commercial_register,national_id,about,type,buyer_id) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9, $10) returning id", [service_type, name, email, phone, password, `commercial_register\\${commercial_register_path.fileName}`, `national_id\\${national_id_path.fileName}`, about, "pending", result2.rows[0].id], (error3, result3) => {
                                            if (error3) {
                                                res.send({
                                                    success: false,
                                                    message: error3.message
                                                })
                                            }
                                            else {
                                                certificates.map((cert, index) => {
                                                    console.log(index)
                                                    var certificate_path = base64ToImage(cert, "uploads/certificates/", { fileName: `${email}_${index}.jpeg` })
                                                    connection.query("INSERT INTO certificates(distributer_id, url) VALUES($1,$2)", [result3.rows[0].id, `certificates\\${certificate_path.fileName}`], (error4, result4) => {
                                                        if (error4) {
                                                            res.send({
                                                                success: false,
                                                                message: error4.message
                                                            })
                                                        }
                                                    })
                                                })
                                                brands.map((brand, index) => {
                                                    var brand_path = base64ToImage(brand, "uploads/brands/", { fileName: `${email}_${index}.jpeg` })
                                                    connection.query("INSERT INTO brands(distributor_id,url) VALUES($1,$2)", [result3.rows[0].id, `brands\\${brand_path.fileName}`], (error4, result4) => {
                                                        if (error4) {
                                                            res.send({
                                                                success: false,
                                                                message: error4.message
                                                            })
                                                        }
                                                    })
                                                })
                                                res.send({
                                                    success: true,
                                                    messsage: 'distributor added'
                                                })
                                            }
                                        })
                                    }
                                })
                            }
                            else {
                                var commercial_register_path = base64ToImage(commercial_register, "uploads/commercial_register/", { fileName: `${email}.jpeg` })
                                var national_id_path = base64ToImage(national_id, "uploads/national_id/", { fileName: `${email}_distributor.jpeg` })

                                console.log(result1.rows)

                                connection.query("INSERT INTO distributors(service_type,name,email,phone, password,commercial_register,national_id,about,type,buyer_id) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9, $10) returning id", [service_type, name, email, phone, password, `commercial_register\\${commercial_register_path.fileName}`, `national_id\\${national_id_path.fileName}`, about, "pending", result1.rows[0].id], (error2, result2) => {
                                    if (error2) {
                                        res.send({
                                            success: false,
                                            message: error2.message
                                        })
                                    }
                                    else {
                                        certificates.map((cert, index) => {
                                            console.log(index)
                                            var certificate_path = base64ToImage(cert, "uploads/certificates/", { fileName: `${email}_${index}.jpeg` })
                                            connection.query("INSERT INTO certificates(distributer_id, url) VALUES($1,$2)", [result2.rows[0].id, `certificates\\${certificate_path.fileName}`], (error3, result3) => {
                                                if (error3) {
                                                    res.send({
                                                        success: false,
                                                        message: error3.message
                                                    })
                                                }
                                            })
                                        })
                                        brands.map((brand, index) => {
                                            var brand_path = base64ToImage(brand, "uploads/brands/", { fileName: `${email}_${index}.jpeg` })
                                            connection.query("INSERT INTO brands(distributor_id,url) VALUES($1,$2)", [result2.rows[0].id, `brands\\${brand_path.fileName}`], (error3, result3) => {
                                                if (error3) {
                                                    res.send({
                                                        success: false,
                                                        message: error3.message
                                                    })
                                                }
                                            })
                                        })
                                        res.send({
                                            success: true,
                                            messsage: 'distributor added'
                                        })
                                    }
                                })
                            }
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


authRoute.post('/registerRepresentative', (req, res) => {

    var name = req.body.name
    var id_number = req.body.id_number
    var nationality = req.body.nationality
    var phone = req.body.phone
    var email = req.body.email
    var dob = req.body.dob
    var profile_image = req.body.profile_image
    var car_type = req.body.car_type
    var car_model = req.body.car_model
    var manufacturing_year = req.body.manufacturing_year
    var lettering = req.body.lettering
    var licence_plate = req.body.licence_plate
    var vehicle_type = req.body.vehicle_type
    var iban = req.body.iban
    var address = req.body.address
    var national_id = req.body.national_id
    var driving_licence = req.body.driving_licence
    var vehicle_registeration = req.body.vehicle_registeration
    var car_front = req.body.car_front
    var car_back = req.body.car_back
    var otp = 111111

    console.log(manufacturing_year)

    if (name && id_number && nationality && phone && email && dob && profile_image && car_type && car_model && manufacturing_year && lettering && licence_plate && vehicle_type && iban && address && national_id && driving_licence && vehicle_registeration && car_front && car_back) {
        connection.query("SELECT * FROM representatives WHERE phone = $1 OR email = $2", [phone, email], (error, result) => {
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
                        message: "user already exists"
                    })
                }
                else {
                    connection.query("SELECT * FROM buyers WHERE phone = $1", [phone], (error1, result1) => {
                        if (error1) {
                            res.send({
                                success: false,
                                message: error1.message
                            })
                        }
                        else {
                            if (result1.rows.length == 0) {
                                connection.query("INSERT INTO buyers(phone,otp) VALUES($1,$2) returning id", [phone, otp], (error2, result2) => {
                                    if (error) {
                                        res.send({
                                            success: false,
                                            message: error2.message
                                        })
                                    }
                                    else {

                                        var profile_image_path = base64ToImage(profile_image, "uploads/profile_image/", { fileName: `${email}.jpeg` })
                                        var national_id_path = base64ToImage(national_id, "uploads/national_id/", { fileName: `${email}_representive.jpeg` })
                                        var driving_licence_path = base64ToImage(driving_licence, "uploads/driving_licence/", { fileName: `${email}.jpeg` })
                                        var vehicle_registeration_path = base64ToImage(vehicle_registeration, "uploads/vehicle_registeration/", { fileName: `${email}.jpeg` })
                                        var car_front_path = base64ToImage(car_front, "uploads/car_front/", { fileName: `${email}.jpeg` })
                                        var car_back_path = base64ToImage(car_back, "uploads/car_back/", { fileName: `${email}.jpeg` })

                                        connection.query('INSERT INTO representatives(name, id_number, nationality, phone, email, dob, profile_image, car_type, car_model, manufacture_year, licence_plate,national_id,driving_licence, vehicle_registration, car_front, car_back, lettering, vehicle_type,iban,address, buyer_id ) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21)',
                                            [name, id_number, nationality, phone, email, dob, profile_image_path.fileName, car_type, car_model, manufacturing_year, licence_plate, national_id_path.fileName, driving_licence_path.fileName, vehicle_registeration_path.fileName, car_front_path.fileName, car_back_path.fileName, lettering, vehicle_type, iban, address, result2.rows[0].id], (error3, result3) => {
                                                if (error3) {
                                                    res.send({
                                                        success: false,
                                                        message: error3.message
                                                    })
                                                }
                                                else {
                                                    res.send({
                                                        success: true,
                                                        message: "Representative added"
                                                    })
                                                }


                                            })
                                    }
                                })

                            } else {
                                var profile_image_path = base64ToImage(profile_image, "uploads/profile_image/", { fileName: `${email}.jpeg` })
                                var national_id_path = base64ToImage(national_id, "uploads/national_id/", { fileName: `${email}_representive.jpeg` })
                                var driving_licence_path = base64ToImage(driving_licence, "uploads/driving_licence/", { fileName: `${email}.jpeg` })
                                var vehicle_registeration_path = base64ToImage(vehicle_registeration, "uploads/vehicle_registeration/", { fileName: `${email}.jpeg` })
                                var car_front_path = base64ToImage(car_front, "uploads/car_front/", { fileName: `${email}.jpeg` })
                                var car_back_path = base64ToImage(car_back, "uploads/car_back/", { fileName: `${email}.jpeg` })

                                connection.query('INSERT INTO representatives(name, id_number, nationality, phone, email, dob, profile_image, car_type, car_model, manufacture_year, licence_plate,national_id,driving_licence, vehicle_registration, car_front, car_back, lettering, vehicle_type, iban,address, buyer_id ) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21)',
                                    [name, id_number, nationality, phone, email, dob, profile_image_path.fileName, car_type, car_model, manufacturing_year, licence_plate, national_id_path.fileName, driving_licence_path.fileName, vehicle_registeration_path.fileName, car_front_path.fileName, car_back_path.fileName, lettering, vehicle_type, iban, address, result1.rows[0].id], (error3, result3) => {
                                        if (error3) {
                                            res.send({
                                                success: false,
                                                message: error3.message
                                            })
                                        }
                                        else {
                                            res.send({
                                                success: true,
                                                message: "Representative added"
                                            })
                                        }


                                    })
                            }
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

authRoute.post('/signin', (req, res) => {
    var phone = req.body.phone
    var otp = 111111

    if (phone) {
        connection.query("SELECT * FROM buyers WHERE phone = $1", [phone], (error, result) => {
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
                        message: 'User does not exists'
                    })
                }
                else {
                    connection.query("UPDATE buyers SET otp = $1 WHERE phone = $2", [otp, phone], (error1, result1) => {
                        if (error1) {
                            res.send({
                                success: false,
                                message: error1.message
                            })
                        }
                        else {
                            res.send({
                                success: true,
                                message: "otp sent"
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

authRoute.post('/verifyUser', (req, res) => {
    var phone = req.body.phone
    var code = req.body.code

    console.log(code)

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

                    connection.query("SELECT * FROM distributors WHERE buyer_id = $1", [result.rows[0].id], (error1, result1) => {
                        if (error1) {
                            res.send({
                                success: false,
                                message: error1.message
                            })
                        }
                        else {
                            connection.query("SELECT * FROM representatives WHERE buyer_id = $1", [result.rows[0].id], (error2, result2) => {
                                if (error2) {
                                    res.send({
                                        success: false,
                                        message: error2.message
                                    })
                                }
                                else {
                                    res.send({
                                        success: true,
                                        message: 'User loggged in',
                                        buyer: result.rows[0],
                                        distributor: result1.rows[0],
                                        representative: result2.rows[0]
                                    })
                                }
                            })
                        }
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



authRoute.post('/upload', (req, res) => {
    var phone = req.body.phone


    var base64Str = req.body.commercial_register;
    var path = 'uploads/commercial_register/';
    var optionalObj = { 'fileName': 'image', 'type': 'jpeg' };


    var imageInfo = base64ToImage(base64Str, path, optionalObj);

    console.log(imageInfo)

    //var bitmap = Buffer.from(req.body.commercial_register.replace(/^data:image\/jpeg;base64,/, ""), 'base64').toString('binary');

    //console.log(bitmap)


    // fs.writeFileSync('uploads/commercial_register/image.jpeg', bitmap, (response) => {
    //     console.log(response)
    // })

    res.send({
        success: true
    })

})



module.exports = authRoute