import {server} from "./app";
import process from "process";
import io from "./io";

const PORT = process.env.PORT || 8081;
console.log(`port: ${PORT}`)


io.on('connection', (socket: any) => {

    console.log("a user connected");

    socket.on('disconnect', function () {
        console.log('user disconnected');
    });

    socket.on('chatMessage', function (data: any) {
        console.log('message: ' + data);
        socket.broadcast.to(`${data.room}`).emit('message', data.msg);
    });
});

server.listen(PORT, () => {
    console.log("http://localhost:" + PORT);
    console.log("chat server");
});