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

profileRoute.post('/updateDistributorProfile', (req, res) => {

    var id = req.body.id
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


    if (id && service_type && phone && name && email && password && commercial_register && national_id && location && certificates && brands && about) {

        connection.query("SELECT * FROM distributors WHERE id = $1", [id], (error2, result2) => {
            if (error2) {
                res.send({
                    success: false,
                    message: error2.message
                })
            }
            else if (result2.rows.length > 0) {
                try {
                    var commercial_register_path = base64ToImage(commercial_register, "uploads/commercial_register/", { fileName: `${email}.jpeg` })
                    var national_id_path = base64ToImage(national_id, "uploads/national_id/", { fileName: `${email}_distributor.jpeg` })

                    connection.query("UPDATE distributors SET service_type = $1 ,name = $2,email = $3,phone = $4, password = $5,commercial_register = $6,national_id = $7,about = $8,type = $9 WHERE id = $10 ", [service_type, name, email, phone, password, `commercial_register\\${commercial_register_path.fileName}`, `national_id\\${national_id_path.fileName}`, about, "pending", id], (error3, result3) => {
                        if (error3) {
                            res.send({
                                success: false,
                                message: error3.message
                            })
                        }
                        else {
                            certificates.map((cert, index) => {
                                console.log(index)
                                var certificate_path = base64ToImage(cert, "uploads/certificates/", { fileName: `${email}_${index}_${new Date().getMilliseconds()}.jpeg` })
                                connection.query("INSERT INTO certificates(distributer_id, url) VALUES($1,$2)", [id, `certificates\\${certificate_path.fileName}`], (error4, result4) => {
                                    if (error4) {
                                        res.send({
                                            success: false,
                                            message: error4.message
                                        })
                                    }
                                })
                            })
                            brands.map((brand, index) => {
                                var brand_path = base64ToImage(brand, "uploads/brands/", { fileName: `${email}_${index}_${new Date().getMilliseconds()}.jpeg` })
                                connection.query("INSERT INTO brands(distributor_id,url) VALUES($1,$2)", [id, `brands\\${brand_path.fileName}`], (error4, result4) => {
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
                                messsage: 'distributor updated'
                            })
                        }
                    })
                } catch (baseError) {
                    res.send({
                        success: false,
                        message: baseError.message
                    })
                }
            }
            else {
                res.send({
                    success: false,
                    message: "user does not exist"
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

profileRoute.post('/updateRepresentativePersonalInfo', (req, res) => {

    var name = req.body.name
    var id_number = req.body.id_number
    var nationality = req.body.nationality
    var phone = req.body.phone
    var email = req.body.email
    var dob = req.body.dob
    var id = req.body.id

    if (name && id_number && nationality && phone && email && dob && id) {
        connection.query("SELECT * FROM representatives WHERE id = $1", [id], (error, result) => {
            if (error) {
                res.send({
                    success: false,
                    message: error.message
                })
            }
            else if (result.rows.length > 0) {
                connection.query("UPDATE representatives SET name = $1 , id_number = $2, nationality = $3 ,  email = $4, phone = $5 , dob = $6 WHERE id = $7", [name, id_number, nationality, email, phone, dob, id], (error1, result1) => {
                    if (error1) {
                        res.send({
                            success: false,
                            message: ""
                        })
                    }
                    else {
                        res.send({
                            success: true,
                            message: "Profile updated"
                        })
                    }
                })
            }
            else {
                res.send({
                    success: false,
                    message: "User does not exists"
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

profileRoute.post("/updateVehicleInfo", (req, res) => {

    var profile_image = req.body.profile_image
    var car_type = req.body.car_type
    var car_model = req.body.car_model
    var manufacturing_year = req.body.manufacturing_year
    var lettering = req.body.lettering
    var licence_plate = req.body.licence_plate
    var vehicle_type = req.body.vehicle_type
    var area = req.body.area
    var city = req.body.city
    var id = req.body.id
    var email = req.body.email

    if (profile_image && car_type && car_model && manufacturing_year && lettering && licence_plate && vehicle_type && area && city && id && email) {
        connection.query("SELECT * FROM representatives WHERE id = $1", [id], (error, result) => {
            if (error) {
                res.send({
                    success: false,
                    message: error.message
                })
            }
            else if (result.rows.length > 0) {
                try {
                    var profile_image_path = base64ToImage(profile_image, "uploads/profile_image/", { fileName: `${email}.jpeg` })
                    connection.query("UPDATE representatives SET profile_image = $1, car_type = $2, car_model = $3, manufacture_year = $4, lettering = $5, vehicle_type = $6, area = $7, city = $8 WHERE id = $9", [profile_image_path.fileName, car_type, car_model, manufacturing_year, lettering, vehicle_type, area, city, id], (error1, result1) => {
                        if (error1) {
                            res.send({
                                success: false,
                                message: error1.message
                            })
                        }
                        else {
                            res.send({
                                success: true,
                                message: 'profile updated'
                            })
                        }
                    })
                } catch (baseError) {
                    res.send({
                        success: false,
                        message: baseError.message
                    })
                }
            }
            else {
                res.send({
                    success: false,
                    message: 'user does not exists'
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

profileRoute.post("/updateDocumentInfo", (req, res) => {

    var iban = req.body.iban
    var address = req.body.address
    var national_id = req.body.national_id
    var driving_licence = req.body.driving_licence
    var vehicle_registeration = req.body.vehicle_registeration
    var car_front = req.body.car_front
    var car_back = req.body.car_back
    var id = req.body.id
    var email = req.body.email

    if (iban && address && national_id && driving_licence && vehicle_registeration && car_front && car_back && id && email) {
        connection.query("SELECT * FROM representatives WHERE id = $1", [id], (error, result) => {
            if (error) {
                res.send({
                    success: false,
                    message: error.message
                })
            }
            else if (result.rows.length > 0) {
                try {


                    var national_id_path = base64ToImage(national_id, "uploads/national_id/", { fileName: `${email}_representive.jpeg` })
                    var driving_licence_path = base64ToImage(driving_licence, "uploads/driving_licence/", { fileName: `${email}.jpeg` })
                    var vehicle_registeration_path = base64ToImage(vehicle_registeration, "uploads/vehicle_registeration/", { fileName: `${email}.jpeg` })
                    var car_front_path = base64ToImage(car_front, "uploads/car_front/", { fileName: `${email}.jpeg` })
                    var car_back_path = base64ToImage(car_back, "uploads/car_back/", { fileName: `${email}.jpeg` })

                    connection.query("UPDATE representatives SET iban = $1, address = $2, national_id = $3, driving_licence = $4, vehicle_registration = $5, car_front = $6, car_back = $7 WHERE id = $8", [iban, address, national_id_path.fileName, driving_licence_path.fileName, vehicle_registeration_path.fileName, car_front_path.fileName, car_back_path.fileName, id], (error1, result1) => {
                        if (error1) {
                            res.send({
                                success: false,
                                message: error1.message
                            })
                        }
                        else {
                            res.send({
                                success: true,
                                message: 'profile updated'
                            })
                        }
                    })
                } catch (baseError) {
                    res.send({
                        success: false,
                        message: baseError.message
                    })
                }
            }
            else {
                res.send({
                    success: false,
                    message: 'user does not exists'
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

profileRoute.post("/getMyBrands", (req, res) => {
    var id = req.body.id

    if (id) {
        connection.query("SELECT * FROM brands WHERE distributor_id = $1", [id], (error, result) => {
            if (error) {
                res.send({
                    success: false,
                    message: error.message
                })
            }
            else {
                res.send({
                    success: true,
                    message: "brands fetched",
                    brands: result.rows
                })
            }
        })
    } else {
        res.send({
            success: false,
            message: "Missing Fields"
        })
    }

})

profileRoute.post("/getMyCertificates", (req, res) => {
    var id = req.body.id

    if (id) {
        connection.query("SELECT * FROM certificates WHERE distributer_id = $1", [id], (error, result) => {
            if (error) {
                res.send({
                    success: false,
                    message: error.message
                })
            }
            else {
                res.send({
                    success: true,
                    message: "certificates fetched",
                    certificates: result.rows
                })
            }
        })
    } else {
        res.send({
            success: false,
            message: "Missing Fields"
        })
    }

})

profileRoute.post("/removeCertificate", (req, res) => {
    var id = req.body.certificate_id

    if (id) {
        connection.query("DELETE FROM certificates WHERE id = $1", [id], (error, result) => {
            if (error) {
                res.send({
                    success: false,
                    message: error.message
                })
            }
            else {
                res.send({
                    success: true,
                    message: "certificate removed"
                })
            }
        })
    } else {
        res.send({
            success: false,
            message: "Missing Fields"
        })
    }

})

profileRoute.post("/removeBrand", (req, res) => {
    var id = req.body.brand_id

    if (id) {
        connection.query("DELETE FROM brands WHERE id = $1", [id], (error, result) => {
            if (error) {
                res.send({
                    success: false,
                    message: error.message
                })
            }
            else {
                res.send({
                    success: true,
                    message: "brand removed"
                })
            }
        })
    } else {
        res.send({
            success: false,
            message: "Missing Fields"
        })
    }

})

profileRoute.post('/getUserById', (req, res) => {
    var id = req.body.id

    if (id) {
        connection.query("SELECT * FROM buyers WHERE id = $1 ", [id], (error, result) => {
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
                                        message: 'User fetched',
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
                        message: "User Not found"
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


module.exports = profileRoute