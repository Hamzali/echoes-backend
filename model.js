module.exports = function (mongoose) {

    soundSchema = new mongoose.Schema({
        position: {
            lat: {type: Number},
            long: {type: Number} 
        }
    });

    let Sound = mongoose.Model('Sound', soundSchema);

    function addSound (lat, long) {
        let s = new Sound({position: {lat, long}});
        s.save(function (err, data) {
            if (err) {
                console.log(err);
                return;
            }

            console.log('sound added.');
            return data._id;
        });
    }

    function findSoundById (id) {
        Sound.find({_id: id}, function (err, data) {
            if (err) {
                console.log(err);
                return;
            }

            return data;
        });
    }

    function removeSound (id) {

    }

    return {
        Sound,
        addSound,
        findSoundById,
        removeSound
    }

}