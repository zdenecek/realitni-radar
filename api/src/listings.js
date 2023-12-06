const { Deal, Property } = require("./sreality.js");



const categoryToAddressPart = {
    "region_cz": "county",
    "municipality_cz": ["mainCity", "city", "state"],
    "quarter_cz": ["mainCity", "city", "state"],
    "street_cz": "road"
}

function createFilter(source) {
    aggregationChain = [];

    const match = {};

    if (!source.deleted || source.deleted === 'active') {
        match.deleted = { $exists: false };
    }
    else if (source.deleted === 'deleted') {
        match.deleted = { $exists: true };
    }

    const and = [];
    const norent = { deal: { $in: [Deal.auction, Deal.sell] } };
    const rent = { deal: Deal.rent };

    if ("id" in source) match.id = source.id;

    if ("query" in source && !("lat" in source)) match.$text = { $search: source.query };
    if ("priceMin" in source) and.push({ $or: [{ price: { $gte: parseInt(source.priceMin) } }, rent] });
    if ("priceMax" in source) and.push({ $or: [{ price: { $lte: parseInt(source.priceMax) } }, rent] });
    if ("rentMin" in source) and.push({ $or: [{ price: { $gte: parseInt(source.rentMin) } }, norent] });
    if ("rentMax" in source) and.push({ $or: [{ price: { $lte: parseInt(source.rentMax) } }, norent] });
    if ("ageMin" in source) {
        const toDate = new Date(Date.now() - (parseInt(source.ageMin) - 1) * 60 * 60 * 24 * 1000);
        match.inserted = { $lte: toDate.toISOString() };
    }
    if ("ageMax" in source) {
        const fromDate = new Date(Date.now() - (parseInt(source.ageMax) + 1) * 60 * 60 * 24 * 1000);
        match.inserted = { ...match.inserted, $gte: fromDate.toISOString() };
    }
    if ("priceDropPercent" in source) match.priceDropPercent = { $gte: parseFloat(source.priceDropPercent) / 100 };
    if ("priceDropCzk" in source) match.priceDropCzk = { $gte: parseInt(source.priceDropCzk) };
    if ("pricePerMeterMin" in source)
        and.push({ $or: [{ pricePerMeter: { $gte: parseInt(source.pricePerMeterMin) } }, rent] });
    if ("pricePerMeterMax" in source)
        and.push({ $or: [{ pricePerMeter: { $lte: parseInt(source.pricePerMeterMax) } }, rent] });
    if ("rentPerMeterMin" in source)
        and.push({
            $or: [{ pricePerMeter: { $gte: parseInt(source.rentPerMeterMin) } }, norent],
        });
    if ("rentPerMeterMax" in source)
        and.push({
            $or: [{ pricePerMeter: { $lte: parseInt(source.rentPerMeterMax) } }, norent],
        });


    if ("loc_type" in source) {
        const bbox = source.loc_bbox.map(parseFloat);
        const field = categoryToAddressPart[source.loc_type];

        match.location = {
            $geoWithin: {
                $box: [
                    [bbox[1], bbox[0]],
                    [bbox[3], bbox[2]]
                ]
            }
        };

        if(field instanceof Array) {
            and.push({ $or: field.map(f => ({['addressData.' + f]: source.loc_name})) });
        }
        else {
            match['addressData.' + field] = source.loc_name;
        }
    }

    if ("deal" in source) match.deal = { $in: source.deal.map((a) => parseInt(a)) };
    if ("property" in source) match.prop = { $in: source.property.map(parseInt) };
    if ("subcategory" in source) match.sub = { $in: source.subcategory.map((a) => (a === "0" ? null : parseInt(a))) };
    if ("ownership" in source) match.ownership = { $in: source.ownership.map((a) => (a === "0" ? null : parseInt(a))) };

    if (Object.values(match).length > 0) {
        aggregationChain.unshift({ $match: match });
    }

    if ("lat" in source && "lon" in source) {
        aggregationChain.unshift({
            $geoNear: {
                near: { type: "Point", coordinates: [parseFloat(source.lon), parseFloat(source.lat)] },
                distanceField: "distance",
                spherical: false,
                maxDistance: parseFloat(source.loc_radius) >= 0 ? parseFloat(source.loc_radius) * 1000 : 10000,
            },
        });
    }

    if (and.length > 0) match.$and = and;

    aggregationChain.push(createSortingAgregation(source.orderBy ?? []));

    return aggregationChain;
}

const orderKeyMappings = {
    "priceDrop": "priceDropPercent",
    "age": "inserted",
    "price": "price",
    "pricePerMeter": "pricePerMeter",
}


function createSortingAgregation(orderByList) {
    if (orderByList.length === 0) return { $sort: { inserted: -1 } }
    orderByList = orderByList.map(o => o.split(":")).map(o => ({ desc: o[2] === 'desc', key: o[1], order: parseInt(o[0]) }));

    orderByList.sort((a, b) => a.order > b.order);
    const sort = {};
    for (var s of orderByList) {
        sort[orderKeyMappings[s.key]] = s.desc ? -1 : 1;
    }
    return { $sort: sort };
}

module.exports = { createFilter };
