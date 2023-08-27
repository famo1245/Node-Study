var mysql = require('mysql');
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'famo1245',
  database: 'opentutorials',
});

connection.connect();
connection.query('SELECT * FROM topic', (err, results, fields) => {
  if (err) {
    console.log(err);
  }

  console.log(results);
});
connection.end();
