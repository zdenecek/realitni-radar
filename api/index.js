require('./src/init');

const express = require("express");
const cors = require("cors");

const app = express();
var bodyParser = require('body-parser')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors())

const session = require('express-session')
const MongoStore = require('connect-mongo');
const dbUrl = process.env.DB_URL || "mongodb://localhost:27017/rr";
app.use(session({
    store: new MongoStore({
        mongoUrl: dbUrl,
    }),
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
}))

const { passport } = require("./src/auth");
app.use(passport.initialize())
app.use(passport.session())

const routes = require("./routes/routes");
const authRoutes = require("./routes/auth");
app.use("/api", routes);
app.use("/api", authRoutes);

const port = process.env.APP_PORT || 3000;
app.listen(port, () => {
    console.info(`Server Started at ${port}`);
});
