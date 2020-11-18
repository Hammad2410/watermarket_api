var app = require('./src/configs/server')
var authRoute = require('./src/routes/auth')
const adminRoute = require('./src/routes/admin')


app.use('/api/admin', adminRoute)
app.use('/api/auth', authRoute);


app.get('/', (req, res) => {
    res.send({
        success: true,
        message: 'server running'
    })
})