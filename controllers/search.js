const Pool = require('pg-pool');
var dbUrl = 'postgres://epkikiazzrgldn:Al1xSejfD3PTo-9yBQdk9TGHIi@ec2-23-21-193-140.compute-1.amazonaws.com:5432/dbjc363gs0d5qb';
var pgConfig = (dbUrl).split(":");
const config = {
  user: pgConfig[1].substr(2),
  password: pgConfig[2].split("@")[0],
  host: pgConfig[2].split("@")[1],
  port: pgConfig[3].split("/")[0],
  database: pgConfig[3].split("/")[1],
  ssl: true
};
var pool = new Pool(config);

exports.search = function (req, res) {
  var query = req.body.searchQuery.toLowerCase();
  pool.query('SELECT * FROM profiles WHERE subject=$1 AND role=$2',
      [query, "tutor"], function (err, result) {
    if (err) {
      res.sendStatus(400);
    } else {
      res.send(result.rows);
    }
  });
}
