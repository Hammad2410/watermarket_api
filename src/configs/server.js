var express = require('express')
var app = express()
var multer = require('multer');
var upload = multer();
var https = require('https');
var fs = require('fs');
var path = require('path');


app.use(express.static('public'));
app.use(express.json({ limit: '250mb' }))
app.use(upload.array());
app.use(express.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: false }));

var ca = [fs.readFileSync(path.resolve(__dirname, "domain.tld.ca-bundle"), 'utf8')]
var privateKey = fs.readFileSync(path.resolve(__dirname, "domain.key"), 'utf8');
var certificate = fs.readFileSync(path.resolve(__dirname, "domain.crt"), 'utf8');

const port = process.env.PORT || 3000;

const option = {
    ca: ca,
    cert: certificate,
    key: privateKey
}

//console.log(option.cert)

var server = https.createServer(option, app);


server.listen(3001, () => console.log(`Listening on port 3001`))
app.listen(port, () => console.log(`Listering on port ${port}`))


module.exports = app