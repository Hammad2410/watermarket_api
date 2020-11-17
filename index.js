var app = require('./src/configs/server')




app.get('/', (req, res) => {
    res.send({
        success: true,
        message: 'server running'
    })
})