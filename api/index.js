require("dotenv").config();
const express = require("express");
const cors = require("cors");	

const port = process.env.APP_PORT || 3000;

const app = express();
const routes = require("./routes/routes");
const logger = require("./src/log");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors())
app.use("/api", routes);

app.listen(port, () => {
    logger.info(`Server Started at ${port}`);
});
