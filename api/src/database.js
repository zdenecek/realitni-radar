
const dbUrl = process.env.DB_URL;


const { MongoClient } = require("mongodb")


function createDb() {
    const client = new MongoClient(dbUrl);
    client.connect();
    return client;
}


module.exports = createDb;