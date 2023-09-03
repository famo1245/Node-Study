const mysql = require('mysql');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'famo1245',
  database: 'opentutorials',
});

db.connect();
module.exports = db;
