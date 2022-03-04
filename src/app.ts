import express from "express";
import winston from "winston";
import bodyParser from "body-parser";
import controller from "./api";
import mongoose from "mongoose";
import * as process from "process";

const app = express();
const cors = require('cors');
// const logger = winston.createLogger({
//     level: 'info',
//     format: winston.format.json(),
//     defaultMeta: { service: 'user-service' },
//     transports: [
//         new winston.transports.File({ filename: 'error.log', level: 'error' }),
//         new winston.transports.File({ filename: 'combined.log' })
//     ]
// });
//app.use(logger);

//require("dotenv").config();
const PORT = process.env.PORT || 8081;

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
app.use(cors('https://boolpan-frontend.s3.ap-northeast-2.amazonaws.com:443'));
app.use(cors('http://3.37.61.56:3000'));
app.use(cors('http://3.37.61.56:27017'));
app.use(cors('mongodb://mongo:27017'));

mongoose.connect("mongodb://mongo:27017/my_database")
    .then(() => console.log("database link success"))
    .catch((err) => console.log(err));

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