require('../src/init')
const { Promise } = require('mongoose');
const client = require("../src/database");

const geoFilter = {
  $geoWithin: {
    $box: [
      [11, 48],
      [20, 52]
    ]
  }
};

const collection = client.collection("houses");
const countAll = collection.countDocuments()
const countLive = collection.countDocuments({ deleted: { $exists: false } })
const countWithoutAddress = collection.countDocuments({ addressData: { $exists: false }, location:  geoFilter })
const countLiveWithoutAddress = collection.countDocuments({ deleted: { $exists: false }, addressData: { $exists: false }, location: geoFilter })

const countByType = collection.aggregate([
  { $match: { deleted: { $exists: false } } },
  {
    $group: {
      _id: { deal: "$deal", prop: "$prop" },
      count: { $sum: 1 }
    }
  }, {
    $project: {
      _id: 0,
      deal: "$_id.deal",
      prop: "$_id.prop",
      count: 1
    }
  }
]).toArray()

Promise.all([countAll, countLive, countWithoutAddress, countByType, countLiveWithoutAddress]).then(async ([countAll, countLive, countWithoutAddress, countByType, countLiveWithoutAddress]) => {

  const stats = {
    countAll,
    countLive,
    countWithoutAddress,
    countByType,

    countLiveWithoutAddress,
  };

  await client.collection('statistics').updateOne({}, { "$set": stats }, { upsert: true })

  console.log(stats)
  process.exit(0);
}).catch((e) => {
  console.error(e.message, e.stack)
  process.exit(1);
})
