//REMEMBER: localhost and 127.0.0.1 difference

var uniqueId = 0;

//------------------------------------------------------------------------------

//Send back messages page if logged in, or else alert message to log in
exports.getMessages = function(req, res) 
{

	//Todo: get proper email
	var email = req.session.email;

	if(email == null){
		res.send("Need to login");
		return;
	}
	res.render('messages/messages.ejs');
}

//------------------------------------------------------------------------------

//just send back user email
exports.getEmail = function(req, res) {
	var email = req.session.email;
	res.json(email);
}

//------------------------------------------------------------------------------

//Called from AJAX at beginning to get names of participants
exports.getParticipants = function (req, res) {
	//Get session from req object later

	var email = req.session.email;

	if(email == null){
		res.send("Need to login");
		return;
	}

	//Get all participants for current user from database
	var mongoUtil = require( '../mongoUtil' );
	var db = mongoUtil.getDb();	
	var participantsCollection = db.collection("participants");

	participantsCollection.find({Users: email}).toArray(function(err, docs) {
		res.json(docs);
		return;
	});
}
//------------------------------------------------------------------------------
//Todo: add participant when tutor is clicked on for messaging
exports.addParticipant = function(req, res)
{

	//Todo: get proper email
	//var email = "shafaaf2";
	var email = req.session.email;

	var participantEmail = req.query.participantEmail;
	//var participantName = "Ahsan";

	//Will add participant in the participants collection
	var mongoUtil = require( '../mongoUtil' );
	var db = mongoUtil.getDb();
	var participantsCollection = db.collection("participants");

	participantsCollection.insertOne({
		Users: [email,participantEmail]
	});

	/*
	messagesCollection.insertOne({
		"From" : email,
		"To" : participantName,
		"Text" : message
	});*/
	return res.json("Added in participant.");
}


//------------------------------------------------------------------------------

//Called from AJAX to get messages for specific user
//Happens when user clicks on a user to see messages, and then when polling 
exports.specificMessages = function (req, res) {

	var email = req.session.email;

	var participantName = req.body.participantName;

	//Getting messages with participant from database
	var mongoUtil = require( '../mongoUtil' );
	var db = mongoUtil.getDb();

	//Get all messages between current user and specific participant passed in from database
	var messagesCollection = db.collection("messages");
	messagesCollection.find({$or:[
		{From: email, To: participantName}, {From: participantName, To: email}]
		}).toArray(function(err, docs) {
		res.json(docs);
		return;
	});
}

//---------------------------------------------------------------------------------

//Add in messages sent from user into database.
//User sends using AJAX calls when selecting a participant and writing text message and hitting enter.
exports.sendMessages = function (req, res) {

	var email = req.session.email;

	var participantName = req.body.participantName;
	var message = req.body.message;


	//Inserting message with current user and participant into database
	var mongoUtil = require( '../mongoUtil' );
	var db = mongoUtil.getDb();
	var messagesCollection = db.collection("messages");
	messagesCollection.insertOne({
		"From" : email,
		"To" : participantName,
		"Text" : message
	});

	res.json("DONE");
	return;
}

//---------------------------------------------------------------------------------
//Need a module to add new participant when someone gets messaged for the first time.
