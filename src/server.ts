import {server} from "./app";
import process from "process";
import io from "./io";

const PORT = process.env.PORT || 8081;
console.log(`port: ${PORT}`)


io.on('connection', (socket: any) => {

    console.log("a user connected");

    // 익명 유저 번호와 유저 아이디 매핑
    // Map<Room, Map<SocketId, anonymous_number>>
    const anonymous_user_map = new Map<string, Map<string, number>>();

    socket.on('disconnect', function () {
        console.log('user disconnected');
    });

    socket.on('chatMessage', function (data: any) {
        console.log('message: ' + data);
        socket.broadcast.to(`${data.room}`).emit('message', data.msg);
    });

    // 방 생성
    // client -> `${user} 님이 입장했습니다.`
    socket.adapter.on("create-room", (room_id: string) => {
        socket.in(room_id).emit('new_user', {user: `익명1`})
    });

    // 입장
    socket.on('join_room', (room_id: string) => {
        socket.join(room_id)
        anonymous_user_map.set(room_id, new Map<string, number>())
        const user_map = anonymous_user_map.get(socket.id)
        if (user_map) {
            user_map.set(socket.id, anonymous_user_map.get(room_id).get(socket.id)+1);
            socket.in(room_id).emit('new_user', {user: `익명${}`});
        }
        else {
            socket.to(socket.id).emit()
            return
        }
    });
});

server.listen(PORT, () => {
    console.log("http://localhost:" + PORT);
    console.log("chat server");
});