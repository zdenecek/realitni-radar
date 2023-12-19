const dotenv = require("dotenv")
dotenv.config();
const dbUrl = process.env.DB_URL || "mongodb://localhost:27017/rr";
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
mongoose.connect(dbUrl);


