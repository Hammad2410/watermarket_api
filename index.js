var app = require('./src/configs/server')
var authRoute = require('./src/routes/auth')
var path = require('path');
var express = require('express');
var dir = path.join(__dirname, '/uploads');

const adminRoute = require('./src/routes/admin')


app.use('/api/admin', adminRoute)
app.use('/api/auth', authRoute);
app.use(express.static(dir));

app.get('/', (req, res) => {
    res.send({
        success: true,
        message: 'server running'
    })
})