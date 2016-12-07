var config = require('./config');

// middlewares and express.
var express = require('express'), 
	bodyparser = require('body-parser'),
	logger = require('morgan');

// MongoDB integration.
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

mongoose.connect(config.dbpath, function (err) {
    if (err) throw err;
});

// Import Models.
var models = {
	records: require('./models/records')(mongoose)
};

// Import Routers.
var records = require('./routers/records')(models.records);

var app = express();

//implement middleware.
app.use(logger('dev'));
app.use(bodyparser.json({limit: 10000}));


app.use('/records', records);

// Error Handler.
app.use(function(req, res) {
  res.status(404);
  res.send("Route not found!");
});

// start the app.
app.listen(config.PORT, function () {
	console.log('listening on port: ' + config.PORT);
});