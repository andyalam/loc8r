/*
Make sure to place in app.js. (do NOT assign to a variable)
require('./app_server/models/db');

GENERAL NOTES BELOW:
For multiple connections, just use a variable for the function createConnection()

var dbURIlog = 'mongodb://localhost/Loc8rLog';
var logDB = mongoose.createConnection(dbURIlog);

in use:

logDB.on('connected', function() {
    console.log('Mongoose connected to ' + dbURIlog);
});
logDB.close(function() {
    console.log('Mongoose log disconnected');
});
*/
var mongoose = require('mongoose');
var gracefulShutdown;
//URI format
//mongodb://username:password@localhost:27027/database
var dbURI = 'mongodb://localhost/Loc8r';
mongoose.connect(dbURI);

mongoose.connection.on('connected', function() {
   console.log('Mongoose connected to ' + dbURI); 
});
mongoose.connection.on('error', function(err) {
   console.log('Mongoose connection error: ' + err); 
});
mongoose.connection.on('disconnected', function() {
   console.log('Mongoose disconnected'); 
});

gracefulShutdown = function(msg, callback) {
    mongoose.connection.close(function() {
      console.log('Mongoose disconnected through ' + msg);
      callback();  
    });
};

//SIGUSR2 for nodemon users
process.once('SIGUSR2', function() {
   gracefulShutdown('nodemon restart', function() {
      process.kill(process.pid, 'SIGUSR2'); 
   }); 
});
//SIGINT for app termination
process.on('SIGINT', function() {
   gracefulShutdown('app termination', function() {
       process.exit(0);
   });
});
//SIGTERM for heroku app termination
process.on('SIGTERM', function() {
   gracefulShutdown('Heroku app termination', function() {
       process.exit(0);
   });
});

require('./locations');
/*
Earlier Windows systems will need a custom windows SIGINT solution
Dependency: "readline" : "0.0.x"
npm install

Above event listener code add the following:

var readline = require('readline');
if (process.platform === "win32") {
    var r1 = readLine.createInterface({
       input: process.stdin,
       output: process.stdout 
    });
    r1.on('SIGINT', function() {
       process.emit('SIGINT'); 
    });
}

*/