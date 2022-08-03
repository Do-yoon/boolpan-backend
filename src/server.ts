import {server} from "./app";
import process from "process";
import io from "./io";
import {createRoom} from "./database/transaction";

const PORT = process.env.PORT || 8081;
console.log(`port: ${PORT}`)

type RoomInfoType = {
    // 익명 유저 소켓 아이디와 방 이름을 매핑
    anonymous_user_number: Map<string, number>
    current: number
    limit: number
    password: string
    delete_time: Date
    category: string
}

// TODO: 에러 종류 세분화
// TODO: 방장 기능 만들기
io.on('connection', (socket: any) => {

    console.log("a user connected");

    // 방의 정보와 이름을 매핑
    const room_info_map = new Map<string, RoomInfoType>();
    const rooms = io.of("/").adapter.rooms;
    const sids = io.of("/").adapter.sids;

    socket.on('disconnect', function () {
        console.log('user disconnected');
    });

    socket.on('sendMessage', function (room_id: string, msg: string) {
        const room_info = room_info_map.get(room_id)
        if (room_info && rooms.get(room_id)) {
            socket.to(`${room_id}`).emit('getMessage', {
                sender: room_info.anonymous_user_number.get(socket.id),
                msg: msg
            });
        } else {
            socket.to(socket.id).emit('error', {msg: "메시지를 보내지 못했습니다."})
        }
    });

    // 방 생성
    // client -> `${user} 님이 입장했습니다.`
    socket.on("create-room", (
        room_id: string,
        category: string,
        password: string,
        limit: number,
        delete_time: Date,
        callback: Function
    ) => {
        socket.join(room_id)
        console.log(room_id)
        room_info_map.set(room_id, {
            anonymous_user_number: new Map<string, number>(),
            current: 1,
            limit: limit,
            password: password,
            delete_time: delete_time,
            category: category
        })
        let error = ''
        const user_map = room_info_map.get(room_id)
        if (user_map) {
            user_map.anonymous_user_number.set(socket.id, 1)
            createRoom({
                name: room_id,
                current: 1,
                limit: limit,
                password: password,
                delete_time: delete_time,
                category: category
            }, (room: any) => {
                console.log(room)
            })
            socket.in(room_id).emit('new_user', {user: 1})
        } else {
            error = "방을 만들지 못했습니다."
        }
        if (typeof callback === "function") {
            callback({
                error: error
            })
        } else {
            console.log('callback is not a function')
        }

        setTimeout(() => {
            io.to(room_id).emit("delete-room", {msg: "펑! 방 유지시간이 끝났어요."})
            io.socketsLeave(room_id);
            room_info_map.delete(room_id)
            // Rooms are left automatically upon disconnection.
        }, Date.now() - (+delete_time))
    });


    // 입장
    // client -> `${user} 님이 입장했습니다.`
    socket.on('join-room', (room_id: string) => {
        socket.join(room_id)
        console.log(room_id)
        const user_map = room_info_map.get(room_id)

        if (user_map) {
            const current = user_map.anonymous_user_number.size
            // 정원 초과 검사
            if (user_map.limit >= current) {
                user_map.anonymous_user_number.set(socket.id, current + 1);
                socket.in(room_id).emit('new_user', {user: user_map.anonymous_user_number.get(socket.id)});
            } else {
                socket.to(socket.id).emit('error', {msg: "정원 초과로 입장하지 못했습니다."})
            }
        } else {
            socket.to(socket.id).emit('error', {msg: "입장하지 못했습니다."})
        }
    });

    socket.adapter.on('leave-room', (room_id: string) => {
        socket.leave(room_id)
        const room_info = room_info_map.get(room_id)
        if (room_info) {
            room_info.anonymous_user_number.delete(socket.id)
        }
    });

});

server.listen(PORT, () => {
    console.log("http://localhost:" + PORT);
    console.log("chat server");
});