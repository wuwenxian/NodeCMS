var mongoose = require('mongoose');
var settings = require('../settings');

var dbUrl = settings.dbUrl;

exports.getMongoose = function () {
	return mongoose;
}

exports.connect = function (callback) {
	mongoose.connect(dbUrl);
}

exports.disconnect = function (callback) {
	mongoose.disconnect(callback);
}

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function callback() {
	console.log('mongodb is connected...');
});
