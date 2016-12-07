var path = require('path');
var fs = require('fs');
var router = require('express').Router();
var multer = require('multer');


module.exports = function (records) {
    
	// Gets all the records and sends it.
    router.get('/', function (req, res) {
        records.allRecords(function (data) {
            if (data) {
            	responseData = [];
            	data.forEach(function(doc) {
            		responseData.push({
            			"id" : doc._id,
            			"title" : doc.title,
            			"location" : {
            				lat : doc.location.coordinates[1],
            				lon : doc.location.coordinates[0]
            			}
            		});
            	});
            	res.json(responseData);
            } else {
                res.sendStatus(404);
            }
        });
    });

	// Get a record audio file.
	router.get('/:id', function (req, res) {
		// send the record.
		records.findRecordById(req.params.id, function (data) {
			if (data) {
				var fileName = req.params.id + '.mp4';

				var options = {
					root: __dirname.replace('routers', 'records'),
					dotfiles: 'deny',
					headers: {
						'Content-Type': 'audio/mpeg',
						'x-timestamp': Date.now(),
						'x-sent': true
					}
				};

				res.sendFile(fileName, options, function (err) {
					if (err) {
						res.status(500).end(err);
					} else {
						console.log('Sent:', fileName);
					}
				});

			} else {
				res.sendStatus(404);
			}
		});
            
    });

	router.post('/meta', function (req, res) {
		var data = req.body;
		if (data
			&& data.title 
			&& data.location) {

				var id = records.addRecord(data);
				if (id) {
					res.json({"id": id});
				} else {
					res.sendStatus(409);
				}
				
		} else {
			res.sendStatus(400);
		}
	});

	// Upload the file.
	var upload = multer({
		dest:  __dirname.replace('routers', 'records'),
		limits: {fileSize: 2000000, files:1}
	});

	router.post('/upload/:id', upload.single('record', 1), function (req, res) {
		if (!req.file) {
			res.sendStatus(400);
			return;
		} 
		var ext = req.file.originalname.split('.').pop();
		var newfilename = req.params.id + '.' + ext;

		fs.rename('records/' + req.file.filename, 'records/' + newfilename, function (err) {
			if (err) {
				return next(err);
			}
		});
		res.json({"message": "ok"});
		res.sendStatus(200);
	});

	return router;
}