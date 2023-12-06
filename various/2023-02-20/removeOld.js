db.houses.aggregate([
    {
        $addFields: {
            count: {
                $size: {
                    $objectToArray: "$priceHistory",
                },
            },
        },
    },
    {
        $match: {
            count: { $gte: 2 },
            "priceHistory.2022-09-20": { $exists: true } ,
        },
    },
]).forEach(element => {
  
  //console.log(element.priceHistory);

  if(element.priceHistory['2022-09-20']) delete element.priceHistory['2022-09-20'];
  else return;
  db.houses.updateOne({id: element.id}, {$set: {priceHistory: element.priceHistory}})

});
