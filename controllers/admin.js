var rr = require("request");
var url = require("url");

/**
 * Establish database connection.
 */
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

/**
 * Send all user information.
 * Query uses join of login and profiles tables.
 */
exports.getAllUsers = function(req, res) {
	if (req.session.email == "admin") {
		var query = "SELECT login.email, password, firstname, lastname, subject, role "
					+ "FROM login LEFT JOIN profiles "
					+ "ON login.email=profiles.email";
		pool.query(query, function(err, result) {
			if (err) {
				res.sendStatus(400);
			}
			else {
				res.send({"users" : result.rows});
			}
		});
	}
	else {
		res.sendStatus(401);
	}
}

/**
 * Make changes to database based on admin edits.
 */
exports.postEditUsers = function(req, res) {
	var data = req.body;
	if (req.session.email == "admin") {
		var query1 = "UPDATE login SET password=$1 WHERE email=$2";
		pool.query(query1, [data.password, data.email], function(err, result) {
			if (err) {
				res.sendStatus(400);
			}
		});
		var query2 = "UPDATE profiles SET firstname=$1, lastname=$2, subject=$3, role=$4 WHERE email=$5";
		pool.query(query2, [data.firstname, data.lastname, data.subject, data.role, data.email], function(err, result) {
			if (err) {
				res.sendStatus(400);
			}
		});
		res.sendStatus(200);
	}
	else {
		res.sendStatus(401);
	}
}