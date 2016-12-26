var MongoClient = require( 'mongodb' ).MongoClient;
var _db;

module.exports = {

  connectToServer: function(callback) {
    //MongoClient.connect( "mongodb://localhost:27017/chat", function( err, db ) {
	MongoClient.connect( "mongodb://shafaaf:1234@ds159767.mlab.com:59767/chat", function( err, db ) {
	    if(err)
	      throw err;

	  	else
	  	 {
	     	_db = db;
	    	return callback( err );
	    }	
    });
  },

  getDb: function() {
    return _db;
  }

};