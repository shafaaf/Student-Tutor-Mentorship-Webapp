//This file only for routes. Application logic code is in controllers folder
var path = require('path');
var home = require(path.join(__dirname, 'controllers', 'home'));
var profile = require(path.join(__dirname, 'controllers', 'profile'));
var admin = require(path.join(__dirname, 'controllers', 'admin'));
var search = require(path.join(__dirname, 'controllers', 'search'));
var calendar = require(path.join(__dirname, 'controllers', 'calendar'));
var messages = require(path.join(__dirname, 'controllers', 'messages'));
var email = require(path.join(__dirname, 'controllers', 'email'));

module.exports = function(app) {

  //Home Page
  app.get('/', function(req, res) {
    res.sendFile('views/home/home.html', {root: __dirname});
  });

  //Messaging stuff
  app.get('/messages', messages.getMessages); //send back messages page if logged in, or else alert message
  app.get('/getemail', messages.getEmail);  //send back user email
  app.get('/participants', messages.getParticipants); // get names of pariticipants at start of page

  //Todo:
  app.get('/addparticipant', messages.addParticipant); // add new participant. Done when adding tutor for first time.

  app.post('/specificmessages', messages.specificMessages); // get messages of specific participants
  app.post('/sendmessages', messages.sendMessages); //  receive and update database when user sends messages

/*--< Student page >--------------------------------------------------------- */

  app.get('/dashboard', function(req, res){
    res.sendFile('views/HTMLtemplates/StudentMain.html', {root: __dirname});
  });

/*--< Profile page >--------------------------------------------------------- */
  app.get('/EditProfileHTML', function(req,res) {
    res.sendFile('views/profile/editProfileContent.html', {root: __dirname});
  });

  app.post('/editprofile', profile.edit);

  app.get('/getprofile', profile.getProfile);

/*--< Search >--------------------------------------------------------------- */
  app.get('/searchPage', function(req,res) {
    res.sendFile('views/search/searchPage.html', {root: __dirname});
  });

  app.post('/search', search.search);

/*--< Calendar >------------------------------------------------------------- */
  app.get('/getEvents', calendar.getEvents);

  app.post('/addEvent', calendar.addEvent);

  app.post('/deleteEvent', calendar.deleteEvent);

  //Add in more routes like above...
  app.post('/register', home.postUser);

  app.post('/login/signin', home.postSignin);

  app.get('/login/github', home.getGithub);

  app.get('/login/google', home.getGoogle);

  app.get('/callback/github', home.getCallbackGithub);

  app.get('/callback/google', home.getCallbackGoogle);

  app.get('/auth/github?', home.getAuthGithub);

  app.get('/auth/google?', home.getAuthGoogle);

  app.get('/session', home.getSession);

  app.post('/deleteSession', home.deleteSession)

  app.get('/admin', function(req, res) {
	  res.sendFile('views/admin/admin.html', {root: __dirname});
  });

  app.get('/admin/users', admin.getAllUsers);

  app.post('/admin/edit', admin.postEditUsers);
  
  app.post ('/email', email.postEmail);

}
