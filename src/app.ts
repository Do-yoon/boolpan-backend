import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import * as process from "process";
import http from "http";
import chatRouter from "./routes/chat";
import userRouter from "./routes/user";

const app = express();
const cors = require('cors');

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json());
app.use(cors('http://boolpan-frontend.s3-website.ap-northeast-2.amazonaws.com/'));
app.use(cors('https://boolpan-frontend.s3.ap-northeast-2.amazonaws.com/'));

app.use(cors('http://52.219.58.132:80'));
app.use(cors('http://52.219.58.15:443'));

app.use(cors('http://3.37.61.56:3000'));
app.use(cors('http://localhost:3000/'));
app.use(cors('http://3.37.61.56:27017'));
app.use(cors('mongodb://mongo:27017'));
app.use("/api/chat", chatRouter)
app.use("/api/user", userRouter)
const MONGO_URL = process.env.NODE_ENV === 'production'
    ? 'mongodb://mongo:27017'
    : 'mongodb://localhost:27017'

mongoose.connect(MONGO_URL + "/my_database")
    .then(() => console.log("database link success"))
    .catch((err) => console.log(err));


app.get('/', (req: any, res: any) => {
    res.send("Hello world");
});

export const server = http.createServer(app);
export default app;
