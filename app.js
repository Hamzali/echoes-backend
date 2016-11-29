let path = require('path');
let fs = require('fs');

// middlewares and express.
let express = require('express'), 
	bodyparser = require('body-parser'),
	logger = require('morgan'),
	multer = require('multer');



// MongoDB integration.
let dbpath = 'mongodb://localhost/recorddb';
let mongoose = require('mongoose');
mongoose.Promise = global.Promise;

mongoose.connect(dbpath, function (err) {
    if (err) throw err;
});

let records = require('./models/records')(mongoose);

const PORT =  3000;

let app = express();

//implement middleware.
app.use(logger('dev'));
app.use(bodyparser.json({limit: 1000}));


app.get('/records', function (req, res) {
	records.allRecords((data) => {
		if (data) {
			res.json(data);
			res.sendStatus(200);
		} else {
			res.sendStatus(500);
		}
	});
});

app.get('/records/:id', function (req, res) {
	// send the record.
	records.findRecordById(req.params.id, function (data) {
		if (data) {
			let fileName = req.params.id + '.mp3';

			var options = {
			    root: __dirname + '/records/',
			    dotfiles: 'deny',
			    headers: {
			    	'Content-Type': 'audio/mpeg',
			        'x-timestamp': Date.now(),
			        'x-sent': true
			    }
			};

			res.sendFile(fileName, options, (err) => {
				if (err) {
				  console.log(err);
				  res.status(err.status).end();
				}
				else {
				  console.log('Sent:', fileName);
				}
			});

		} else {
			res.sendStatus(404);
		}
	});
	
});

app.post('/records/meta', function (req, res) {
	// console.log(req.body);
	let data = req.body;
	if (data && data.position && data.title && data.position.lat && data.position.long) {
		let id = records.addRecord(data);
		if (id) {
			res.json({"id": id});
			res.sendStatus(200);
		}
		res.sendStatus(500);
	} else {
		res.sendStatus(400);
	}
});


let upload = multer({
	dest: __dirname + '/records/',
	limits: {fileSize: 10000000, files:1}
});

app.post('/records/upload/:id', upload.single('record', 1), function (req, res) {
	let ext = req.file.originalname.split('.').pop();
	let newfilename = req.params.id + '.' + ext;

	fs.rename('records/' + req.file.filename, 'records/' + newfilename, (err) => {
		if (err) {
			throw err;
		}

		console.log('renamed, well done!');
	});

	res.sendStatus(200);
});


app.use(function(req, res) {
  res.status(404);
  res.send("File not found!");
});


app.listen(PORT, function () {
	console.log('listening on port: ' + PORT);
});