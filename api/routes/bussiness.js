const express = require("express");
const client = require("../src/database");
const axios = require("../src/axios");
const listings = require("../src/listings");
const router = express.Router();
var ObjectId = require('mongodb').ObjectId;

module.exports = router;

const allowedRoles = ['admin', 'user'];
function authenticate(req, res, next) {
    if (!req.user || allowedRoles.indexOf(req.user.role) === -1) {
        return res.status(403).send('Access denied.');
    }
    next();
}


//get all listings, POST because of request size
router.post("/listings", authenticate, async (req, res) => {
    const source = req.body || {};
    const page = parseInt(source.p) || 1;
    const perPage = parseInt(source.perPage) || 20;
    const start = perPage * (page - 1);
    const aggregationChain = [
        {
            $lookup: {
                from: "users",
                let: { listingId: "$_id" },
                pipeline: [
                    { $match: { _id: new ObjectId(req.user.id) } }, 
                    { $project: { isFavorite: { $in: ["$$listingId", "$favoriteListings"] } } }
                ],
                as: "favoriteInfo"
            }
        },
        {
            $addFields: {
                isFavorite: { $anyElementTrue: ["$favoriteInfo.isFavorite"] }
            }
        },
        {
            $project: {
                favoriteInfo: 0 
            }
        },
        {
            $facet: {
                listings: [{ $skip: start }, { $limit: perPage * 2 }],
                total: [{ $count: "count" }],
            },
        },
    ];
    const filter = listings.createFilter(source);
    aggregationChain.unshift(...filter);

    if (source.cities) {
        const pairs = [...source.cities.map((a) =>
            a.split("-"))
            .map(([postcode, name]) => (

                {
                    "addressData.mainCity": name,
                    "addressData.postcode": postcode
                }
            ))];

        aggregationChain.unshift({
            $match: {
                $or: pairs
            },
        });
    }
    const aggregationResult = await client.collection('houses').aggregate(aggregationChain).next();
    const result = {
        listings: aggregationResult.listings.splice(0, perPage), //take first half
        nextPage: aggregationResult.listings,
        count: aggregationResult.total[0]?.count ?? 0,
    };

    res.json(result);
});


// refactor to use GET
router.post("/favorites", authenticate, async (req, res) => {

    const user = req.user;
    const source = req.body || {};
    const page = parseInt(source.p) || 1;
    const perPage = parseInt(source.perPage) || 20;
    const start = perPage * (page - 1);
    const aggregationChain = [
        {
            $facet: {
                listings: [{ $skip: start }, { $limit: perPage }],
                total: [{ $count: "count" }],
            },
        },
    ];
    const filter = listings.createFilter(source);
    aggregationChain.unshift(...filter);

    console.log(user.id);

    aggregationChain.unshift(...[
        {
            $match: {
                _id: new ObjectId(user.id)
            }
        },
        {
            $lookup: {
                from: "houses",
                localField: "favoriteListings",
                foreignField: "_id",
                as: "favoriteListingsDetails"
            }
        },
        {
            $unwind: "$favoriteListingsDetails"
        },
        {
            $replaceRoot: { newRoot: "$favoriteListingsDetails" }
        },
        {
            $addFields: {
                isFavorite: true
            }
        }
    ])

    console.log(aggregationChain);

    const aggregationResult = await client.collection('users').aggregate(aggregationChain).next();
    const result = {
        listings: aggregationResult.listings,
        count: aggregationResult.total[0]?.count ?? 0,
        chain: aggregationChain,
    };


    res.json(result);
});

router.post("/favorites/add", authenticate, async (req, res) => {
    
    const user = req.user;
    const listingId = req.body.id;
    
    await client.collection('users').updateOne({ _id: new ObjectId(user.id) }, { $addToSet: { favoriteListings: new ObjectId(listingId) } });
    
    res.status(204).send();
});

router.delete("/favorites/delete/:id", authenticate, async (req, res) => {
    
    const user = req.user;
    const listingId = req.params.id;
    
    await client.collection('users').updateOne({ _id: new ObjectId(user.id) }, { $pull: { favoriteListings:  new ObjectId(listingId) } });
    
    res.status(204).send();
});

router.get("/listing/:listingId", authenticate, async (req, res) => {

    const query = {
        id: req.params.listingId
    };
    const result = await client.collection('houses').findOne(query);
    res.json(result);
}
);

router.get("/cities", authenticate, async (req, res) => {
    const aggregationChain = listings.createFilter(req.query);
    aggregationChain.push({
        $group: {
            _id: { name: "$addressData.mainCity", postcode: "$addressData.postcode" }, // Group by 
            region: { $first: "$addressData.county" },
            count: { $count: {} },
        },
    }, {
        $project: {
            _id: 0, // Exclude the _id field
            postcode: "$_id.postcode",
            name: "$_id.name",
            region: 1, // Include these fields in the output
            count: 1
        }
    });

    if (req.query.ranges) {
        const ranges = [];
        for (const range of req.query.ranges) {
            const [min, max] = range.split("-").map((a) => parseInt(a));
            const obj = {};
            if (min) obj.$gte = min;
            if (max) obj.$lte = max;
            if (min || max) ranges.push({ count: obj });
        }
        if (ranges.length > 1) aggregationChain.push({ $match: { $or: ranges } });
        else aggregationChain.push({ $match: ranges[0] });
    }

    const result = await (await client.collection('houses').aggregate(aggregationChain)).toArray();

    res.json(result);
});


router.get("/suggest", (req, res) => {
    axios
        .get("https://www.sreality.cz/api/cs/v2/suggest", {
            params: {
                ...req.query,
            },
            headers: {
                Host: "www.sreality.cz",
            },
        })
        .then((response) => {
            res.json(response.data);
        })
        .catch((error) => {
            if (error.response.status === 400) {
                res.json({ count: 0, data: [] })
                return;
            }
            else {

                console.error("Suggest request error", error);
            }
        });
});
