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

// Set up and get events for a specific email
exports.getEvents = function (req, res) {
  var userEmail = req.session.email;
  var tutorEmail = req.query.email;

  if (tutorEmail) {
    pool.query('SELECT events from events WHERE email = $1', [tutorEmail], function(err, result) {
      if (err) {
        res.sendStatus(400);
      } else if (result.rows[0]) {
        res.send(JSON.stringify(result.rows[0].events));
      } else { // First time adding checking calendar
        pool.query('INSERT INTO events values ($1, $2)', [tutorEmail, {"events": []}], function(err) {
          if (err) {
            res.sendStatus(400);
          }
        });

      }
    });
  } else {
    pool.query('SELECT events from events WHERE email = $1', [userEmail], function(err, result) {
      if (err) {
        res.sendStatus(400);
      } else if (result.rows[0]) {
        res.send(JSON.stringify(result.rows[0].events));
      } else { // First time checking calendar
        pool.query('INSERT INTO events values ($1, $2)', [userEmail, {"events" : []}], function(err) {
          if (err) {
            res.sendStatus(400);
          }
        });
      }
    });
  }
}

// Add events for a specific email
exports.addEvent = function (req, res) {
  var dataArray = req.body.dataArray;
  var userEmail = req.session.email;
  var tutorEmail = req.body.email;

  if (tutorEmail) {
    pool.query('UPDATE events SET events = $1 WHERE email=$2', [dataArray, tutorEmail], function(err) {
      if (err) {
        res.sendStatus(400);
      } else {
        res.sendStatus(200);
      }
    });
  } else {
    pool.query('UPDATE events SET events = $1 WHERE email=$2', [dataArray, userEmail], function(err) {
      if (err) {
        res.sendStatus(400);
      } else {
        res.sendStatus(200);
      }
    });
  }

}

// Delete events from a specific email
exports.deleteEvent = function (req, res) {
  var dataArray = req.body.dataArray;
  var userEmail = req.session.email;
  if (!dataArray) {
    dataArray = {"events": []};
  }

  pool.query('UPDATE events SET events = $1 WHERE email=$2', [dataArray, userEmail], function(err) {
    if (err) {
      res.sendStatus(400);
    } else {
      res.sendStatus(200);
    }
  });
}
