module.exports = function (mongoose) {

    recordSchema = new mongoose.Schema({
        title: {type: String},
        location: {
            type: {type: String},
            coordinates: [Number]
        },
        date: {type: Date, default: Date.Now}
    });

    var Record = mongoose.model('Record', recordSchema);

    function addRecord (r) {
        var s = new Record({
            title: r.title,
            location: {
                type: "Point",
                coordinates: [r.lat, r.long]
            }
        });
        var id;

        s.save(function (err, data) {
            if (err) {
                console.log(err);
                return;
            }

            console.log('Record added.');
        });

        return s._id;
    }

    function findRecordById (id, callback) {
        Record.find({_id: id}, function (err, data) {
            if (err) {
                console.log(err);
            }

            callback(data);
        });
    }

    function allRecords(callback) {
        Record.find({}, function (err, data) {
            if (err) {
                console.log(err);
            }

            callback(data);
        });
    }

    function removeRecord (id) {

    }

    return {
        Record,
        addRecord,
        findRecordById,
        removeRecord,
        allRecords
    }

}