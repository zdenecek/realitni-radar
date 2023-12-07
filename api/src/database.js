
const dbUrl = process.env.DB_URL;
const { MongoClient } = require("mongodb")

let client = null;

function createDb() {
    const c = new MongoClient(dbUrl);
    c.connect();
    c.on("close", () => {
        console.info("Restarting DB connection")
        client = createDb();
    });
    return c.db(process.env.DB_NAME);
}

client = createDb();

module.exports = client;