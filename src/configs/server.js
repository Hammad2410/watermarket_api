var express = require('express')
var app = express()
var multer = require('multer');
var upload = multer();


app.use(express.static('public'));
app.use(express.json({ limit: '250mb' }))
app.use(upload.array());
app.use(express.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: false }));

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Listering on port ${port}`))


module.exports = app