var app = require('./src/configs/server')
var authRoute = require('./src/routes/auth')

app.use('/api/auth', authRoute);


app.get('/', (req, res) => {
    res.send({
        success: true,
        message: 'server running'
    })
})