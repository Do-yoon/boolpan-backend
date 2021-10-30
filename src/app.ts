import express from "express";

const webpackDevMiddleware = require('webpack-dev-middleware');
const app = express();

//포트번호 3000
app.set("port", 3000);

//bundle된 index.html '/' 주소로 요청
app.get('/', (req: any, res: any) => {
    res.send("Hello world");
});

app.listen(app.get("port"), () => {
    console.log("http://localhost:" + app.get("port"));
});