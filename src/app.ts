import express from "express";
import bodyParser from "body-parser";
import http from "http";
import chatRouter from "./routes/chat";
import userRouter from "./routes/user";
import {initIO} from "./io";
import cors from "cors"

const app = express();

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json());

const corsOptions = {
    origin: ['http://boolpan-frontend.s3-website.ap-northeast-2.amazonaws.com/',
        'https://boolpan-frontend.s3.ap-northeast-2.amazonaws.com/',
        'http://52.219.58.132:80',
        'http://52.219.58.15:443',
        'http://3.37.61.56:3000',
        'http://localhost:3000/',
        'http://3.37.61.56:27017',
        'mongodb://mongo:27017'],
    optionsSuccessStatus: 200
}

app.use(cors(corsOptions));
app.use("/api/chat", chatRouter)
app.use("/api/user", userRouter)


app.get('/', (req: any, res: any) => {
    res.send("Hello world");
});

export const server = http.createServer(app);
export const io = initIO(server);


export default app;
