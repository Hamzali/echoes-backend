let path = require('path');
let fs = require('fs');

let express = require('express');

// middlewares.
let bodyparser = require('body-parser');
let cookie = require('cookie-parser');
let logger = require('morgan');

// MongoDB integration.
// let dbpath = 'mongodb://localhost/sounddb';
// let mongoose = require('mongoose');
// mongoose.promise = global.promise;

// mongoose.connect(dbpath, function (err) {
//     if (err) throw err;
// });

// let sounds = require('./model')(mongoose);



const PORT =  3000;

let app = express();

//implement middleware.
app.use(logger('dev'));
app.use(bodyparser.json({limit: 1000}));
app.use(cookie());



// app.get('/', function (req, res) {
//     res.send('this is the sound app.');
// });

app.get('/sound/:id', function (req, res) {

});

app.post('/sound/meta', function (req, res) {

});

app.put('/sound/upload', function (req, res) {

});



var staticPath = path.join(__dirname, "sounds");
app.use(express.static(staticPath));

var filePath = path.join(__dirname, "sounds/music.mp3"); 
app.use(function(req, res) {
	res.sendFile(filePath);
});

app.use(function(req, res) {
  res.status(404);
  res.send("File not found!");
});


app.listen(PORT, function () {
	console.log('listening on port: ' + PORT);
});