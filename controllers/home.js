var gh = require("github");
var rr = require("request");
var url = require("url");
var google = require("googleapis");

/**
 * Github oauth configuration.
 */
var oauth2Github = require('simple-oauth2')({
	clientID: '1434dc1219b6fafbded2',
	clientSecret: '9c8a3d291c6b4a7e3c4ba51569702ab51afa5bad',
	site: 'https://github.com/login',
	tokenPath: '/oauth/access_token',
	authorizationPath: '/oauth/authorize'
});

/**
 * Github redirection url.
 */
var authorization_uri_github = oauth2Github.authCode.authorizeURL({
	redirect_uri: 'http://csc309-coursescheduler.rhcloud.com/callback/github',
	scope: 'user:email',
	state: '*(A&S%f'
});

/**
 * Github access settings.
 */
var github = new gh({
    debug: true,
    protocol: "https",
    host: "api.github.com",
    headers: {
        "user-agent": "csc309"
    },
    followRedirects: false,
    timeout: 50000
});

/**
 * Google oauth configuration.
 */
var OAuth2 = google.auth.OAuth2;
var oauth2Client = new OAuth2(
	'731364416241-eufkgv278pcgd7l3dujr7bi1huqt9l0k.apps.googleusercontent.com',
	'3RFWTeIOOxFtT8DC5F9wkKrC',
	'http://csc309-coursescheduler.rhcloud.com/callback/google'
);

/**
 * Google access settings.
 */
var googleUrl = oauth2Client.generateAuthUrl({
	scope: 'https://www.googleapis.com/auth/userinfo.email'
});
google.options({
  auth: oauth2Client
});

/**
 * Database connection settings.
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
 * Add new user to database.
 */
exports.postUser = function(req, res) {
	var query = 'INSERT INTO login VALUES ($1, $2)';
	pool.query(query, [(req.body.email).toLowerCase(), req.body.password], function(err) {
		if (err) {
			res.sendStatus(400);
		}
		else {
			req.session.email = (req.body.email).toLowerCase();
			res.sendStatus(200);
		}
	});
}

/**
 * Login and set session variables.
 */
exports.postSignin = function (req, res) {
	var query1 = 'SELECT password FROM login WHERE email=$1';
	pool.query(query1, [(req.body.email).toLowerCase()], function(err, result) {
		if (err || !result.rows.length) {
			res.sendStatus(400);
		}
		else if ((result.rows[0]).password != req.body.password) {
			res.sendStatus(400);
		}
		else if (req.body.email == 'admin') {
			req.session.email = 'admin';
			res.send({'redirect' : '/admin'});
		}
		else {
			var query2 = 'SELECT * FROM profiles WHERE email=$1';
			pool.query(query2, [(req.body.email).toLowerCase()], function(err, result) {
				if (err || !result.rows.length) {
					res.send({'redirect' : '/EditProfileHTML'});
				} else {
				req.session.email = (req.body.email).toLowerCase();
				res.send({'redirect' : '/dashboard'});
				}
			});
		}
	});
}

/**
 * Github redirect.
 */
exports.getGithub = function (req, res) {
	res.send({'redirect': authorization_uri_github});
}

/**
 * Github acquire token.
 */
exports.getCallbackGithub = function (req, res) {
	var para = url.parse(req.url, true);
	var code = para.query.code;

	oauth2Github.authCode.getToken({
		code: code,
		redirect_uri: 'http://csc309-coursescheduler.rhcloud.com/'
	}, saveToken);

	function saveToken(error, result) {
		token = oauth2Github.accessToken.create(result);
		res.redirect('/auth/github?' + token.token);
	}
}

/**
 * Github request API information.
 */
exports.getAuthGithub = function (req, res) {
	var path = (url.parse(req.url, true)).path;
	var tok = path.split('?')[1];

	github.authenticate({
		type: "oauth",
		token: tok
	});

	var headers = {"User-Agent" : "Timpan5"};

	rr({url : 'http://api.github.com/user/emails?' + tok, headers: headers}, function (error, response, body) {
		req.session.email = (JSON.parse(body)[0].email).toLowerCase();
		if (!error && response.statusCode == 200) {
			var query = 'SELECT * FROM profiles WHERE email=$1';
			pool.query(query, [req.session.email], function(err, result) {
				if (err || !result.rows.length) {
					res.redirect('/EditProfileHTML')
				} else {
					res.redirect('/dashboard');
				}
			});
		}
	});
}

/**
 * Send session email.
 */
exports.getSession = function (req, res) {
	res.send(req.session.email);
}

/**
 * Delete session email.
 */
exports.deleteSession = function (req, res) {
	req.session.destroy();
	res.sendStatus(200);
}

/**
 * Get Google redirect.
 */
exports.getGoogle = function (req, res) {
	res.send({"redirect" : googleUrl});
}

/**
 * Get Google callback.
 */
exports.getCallbackGoogle = function (req, res) {
	oauth2Client.getToken(req.query.code, function (err, tokens) {
		if (!err) {
			oauth2Client.setCredentials(tokens);
			res.redirect('/auth/google?id=' + tokens.id_token);
		}
	});
}

/**
 * Access Google api.
 */
exports.getAuthGoogle = function (req, res) {
	var options = {
		url: 'https://www.googleapis.com/oauth2/v1/tokeninfo?id_token=' + req.query.id,
		method: 'POST'
	}
	rr(options, function (err, response, body) {
		if (!err && response.statusCode == 200) {
			req.session.email = ((JSON.parse(body)).email).toLowerCase();
			var query = 'SELECT * FROM profiles WHERE email=$1';
			pool.query(query, [req.session.email], function(err, result) {
				if (err || !result.rows.length) {
					res.redirect('/EditProfileHTML')
				} else {
					res.redirect('/dashboard');
				}
			});
		}
	});
}
