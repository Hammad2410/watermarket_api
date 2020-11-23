var { Client } = require('pg');

//const connectionString = 'postgres://postgres:root@localhost:5432/moneyUp'

var con = new Client({
    user: "watermarket",
    password: "admin123",
    database: "postgres",
    port: 5432,
    host: "80.209.226.8",
    //ssl: { rejectUnauthorized: true }

});

con.connect()
module.exports = con