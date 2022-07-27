const server = require("./app").server
const {Server} = require("socket.io");
const io = new Server(server, {
    cors: {
        origin: ["http://localhost:3000/", "http://boolpan-frontend.s3-website.ap-northeast-2.amazonaws.com/:3000"],
        credentials: true
    }
});


export default io;