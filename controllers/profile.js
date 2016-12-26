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

exports.getProfile = function (req, res) {
  var userEmail = req.session.email;
  pool.query('SELECT * FROM profiles WHERE email=$1', [userEmail], function (err, result) {
    if (err || !result.rows[0]) {
      res.sendStatus(400);
    } else {
      req.session.firstName = result.rows[0].firstname;
      res.send(result.rows[0]);
    }
  });
}

exports.edit = function(req, res) {
  var userEmail = req.session.email,
      firstName = (req.body.firstName).toLowerCase(),
      lastName = (req.body.lastName).toLowerCase(),
      subject = (req.body.subject).toLowerCase(),
      role = (req.body.role).toLowerCase();

  pool.query('SELECT * FROM profiles WHERE email=$1', [userEmail], function (err, result) {
    if (err) {
      res.sendStatus(400);
    } else if (result.rows.length === 0) {
      pool.query('INSERT INTO profiles VALUES ($1, $2, $3, $4, $5)', [userEmail,
          firstName, lastName, subject, role], function(err) {

        if (err) {
          res.sendStatus(400);
        } else {
          req.session.firstName = firstName;
          res.sendStatus(200);
        }
      });
    }
    else {
      pool.query("UPDATE profiles SET firstname = $1, lastname = $2, subject = $3, role = $4 WHERE email = $5",
                 [firstName, lastName, subject, role, userEmail], function(err, result) {
        if (err) {
          res.sendStatus(400);
        } else {
          req.session.firstName = firstName;
          res.sendStatus(200);
        }
      })
    }
  });
}
