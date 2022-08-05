import {server} from "./app";
import process from "process";
import io from "./io";
import {createRoom, joinRoom} from "./database/transaction";

const PORT = process.env.PORT || 8081;
console.log(`port: ${PORT}`)

type RoomInfoType = {
    // 익명 유저 소켓 아이디와 방 이름을 매핑
    anonymous_user_number: Map<string, number>
    explode_time: Date
}

type CreateRoomProps = {
    name: string,
    category: string,
    password: string,
    limit: number,
    explode_time: Date
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
    socket.on("create-room", (data: CreateRoomProps, callback: (response: any) => void) => {
        console.log(data.name)
        const new_room_info: RoomInfoType = {
            ...data,
            anonymous_user_number: new Map<string, number>(),
        }

        createRoom({
            ...data,
            current: 1
        }).then((room: any) =>
            new Promise((resolve, reject) => {
                console.log(room)
                const res = {
                    error: ''
                }
                room_info_map.set(room._id, new_room_info);
                const user_map = room_info_map.get(room._id)
                if (user_map) {
                    user_map.anonymous_user_number.set(socket.id, 1)
                    socket.in(room._id).emit('new_user', {user: 1})
                } else {
                    res.error = "방을 만들지 못했습니다."
                }
                if (typeof callback !== "function") {
                    console.log(`callback is not a function: ${callback}`)
                    res.error = `callback is not a function: ${callback}`
                }
                callback(res)

                socket.join(room._id)
                console.log(data.explode_time)
                setTimeout(() => {
                    io.to(room._id).emit("delete-room", {msg: "펑! 방 유지시간이 끝났어요."})
                    io.socketsLeave(room._id);
                    room_info_map.delete(room._id)
                    resolve(room._id)
                }, data.explode_time.getMilliseconds() - Date.now());
            })
        ).then((id: any) => {
            console.log(`room deleted: ${id}`)
        })
    });


    // 입장
    // client -> `${user} 님이 입장했습니다.`
    socket.on('join-room', (room_id: string, password: string, callback: (data: {
        roominfo: {
            name: string,
            current: number,
            limit: number,
            explode_time: Date
        },
        error: string
    }) => void) => {
        socket.join(room_id)
        console.log(`join:${room_id}`)
        const user_map = room_info_map.get(room_id)
        let res = {
            roominfo: {
                name: '',
                current: 0,
                limit: 0,
                explode_time: new Date
            },
            error: ''
        }

        joinRoom(room_id, socket.id, password)
            .then((room: any) => {
                const len = user_map?.anonymous_user_number.size;

                if (len && room.limit >= len) {
                    user_map.anonymous_user_number.set(socket.id, room.current + 1);
                    socket.in(room_id).emit('new_user', {user: user_map.anonymous_user_number.get(socket.id)});
                } else if (!len) {
                    res.error = "입장하지 못했습니다.";
                } else {
                    res.error = "정원 초과로 입장하지 못했습니다."
                }
            })
        callback(res)
    })


    socket.on('leave-room', (room_id: string) => {
        socket.leave(room_id)
        const room_info = room_info_map.get(room_id)
        if (room_info) {
            room_info.anonymous_user_number.delete(socket.id)
        }
    });

})
;

server.listen(PORT, () => {
    console.log("http://localhost:" + PORT);
    console.log("chat server");
});