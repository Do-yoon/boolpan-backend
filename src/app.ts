import express from "express";
import winston from "winston";
import bodyParser from "body-parser";
import controller from "./api";
import mongoose from "mongoose";
import * as process from "process";

const app = express();
const cors = require('cors');
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service: 'user-service' },
    transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' })
    ]
});
//app.use(logger);

const main = async () => mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/my_database");
main().catch(err => console.log(err))

//require("dotenv").config();
const PORT = process.env.PORT || 8080;

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
app.use(cors('localhost:3000'));

app.set("port", PORT);

app.get('/', (req: any, res: any) => {
    res.send("Hello world");
});

//const api = require('api');
app.use('/v0', controller);

app.listen(app.get("port"), () => {
    console.log("http://localhost:" + app.get("port"));
});

export default app;