db.houses.find().forEach((doc) => {
    const dates = Object.keys(doc.priceHistory);
    dates.sort(function(a,b){
        // Turn your strings into dates, and then subtract them
        // to get a value that is either negative, positive, or zero.
        return new Date(a) - new Date(b);
        });
    let ph = {};
    dates.forEach(d => ph[d] = doc.priceHistory[d]);
    
    db.houses.updateOne({id: doc.id}, {$set: {priceHistory: ph}})

});
