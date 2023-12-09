require('./src/init');

const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors())
var bodyParser = require('body-parser')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const session = require('express-session')
const MongoStore = require('connect-mongo');
const dbUrl = process.env.DB_URL || "mongodb://localhost:27017/rr";
app.use(session({
    store: new MongoStore({
        mongoUrl: dbUrl,
    }),
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        sameSite: 'none',
    }
}))

const { passport } = require("./src/auth");
app.use(passport.initialize())
app.use(passport.session())

const routes = require("./routes/bussiness");
const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
app.use("/api", routes);
app.use("/api", authRoutes);
app.use("/api/admin", adminRoutes);

const port = process.env.APP_PORT || 3000;

app.use((err, req, res, next) => {
    try {
        next(err);
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Error");
    }
});

app.listen(port, () => {
    console.info(`Server Started at ${port}`);
});
