// dependencies
import express from "express";
import winston from "winston";
import bodyParser from "body-parser";
import controller from "./api";
import mongoose from "mongoose";
import * as process from "process";
//let hash = require('pbkdf2-password')()
let path = require('path');
//let session = require('express-session');


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

// middleware
// app.use(express.urlencoded({ extended: false }))
// app.use(session({
//     resave: false, // don't save session if unmodified
//     saveUninitialized: false, // don't create session until something stored
//     secret: 'shhhh, very secret'
// }));

// Session-persisted message middleware

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
app.use(cors('http://boolpan-frontend.s3-website.ap-northeast-2.amazonaws.com:80/'));
app.use(cors('http://52.219.58.132:80'));
app.use(cors('http://3.37.61.56:3000'));
app.use(cors('http://3.37.61.56:27017'));
app.use(cors('mongodb://mongo:27017'));

const MONGO_URL = process.env.NODE_ENV === 'production'
    ? 'mongodb://mongo:27017'
    : 'http://localhost:27017'

mongoose.connect(MONGO_URL + "/my_database")
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