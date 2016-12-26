var nodemailer = require("nodemailer");

/**
 * SMTP email setup.
 */ 
var smtpConfig = {
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: "csc301.mailer@gmail.com",
        pass: "csc301team10"
	}
};
var transporter = nodemailer.createTransport(smtpConfig);

/**
 * Send email nofitication.
 */
exports.postEmail = function(req, res) {
	var data = req.body;
	
	var msg = 'You have a new appointment scheduled at: ' + data.start + ' to ' + data.end;
	var mailOptions = {
		from: '"Notification" <csc301.mailer@gmail.com>', 
		to: data.email, 
		subject: 'New Appointment: ' + data.title,
		text: msg, 
	};

	transporter.sendMail(mailOptions, function(error, info){
		if(error){
			res.sendStatus(400);
		}
		else {
			res.sendStatus(200);
		}
	});
}