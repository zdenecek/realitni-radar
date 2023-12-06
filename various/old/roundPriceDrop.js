db.houses.find().forEach((doc) => {
    if(!doc.priceDropPercent) return;

    const pd = doc.priceDropPercent.toFixed(3);
    print(pd);
    db.houses.updateOne({id: doc.id}, {$set: {priceDropPercent: pd}})

});
