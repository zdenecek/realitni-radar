db.houses.updateMany(
    { addressData: {$exists: true}}, // Filter condition; an empty object {} will match all documents
    [{
        $set: {
            "addressData.postcode": {
                $replaceOne: {
                    input: "$addressData.postcode",
                    find: " ",
                    replacement: ""
                }
            }
        }
    }]
)

db.houses.find({addressData: {$exists: true}}).forEach(function(doc) {
    var main_city = "";
    var keys = ['village', 'town', 'city'];
    
    for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        if (key in doc.addressData) {
            main_city = doc.addressData[key];
            break;
        }
    }

    if (main_city.length > 0) {
        db.houses.updateOne({_id: doc._id}, {$set: {"addressData.mainCity": main_city}});
    }
});