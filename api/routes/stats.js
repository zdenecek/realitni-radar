const express = require("express");
const client = require("../src/database");
const router = express.Router();

module.exports = router;

router.get("/site-stats", async (req, res) => {
    const stats = await client.collection('statistics').findOne({})
    res.json(stats)
})