import {server} from "./app";
import {Server} from "socket.io";
import process from "process";
import user from "./api";
import {Room, User} from "./database/model";
import {getTimestampString} from "./util/getTimestampString";
import {ClientToServerEvents, InterServerEvents, ServerToClientEvents, SocketData} from "./types/ioType";
import mongoose from "mongoose";
import EventEmitter from "events";

const PORT = process.env.PORT || 8081;
console.log(`port: ${PORT}`)

const io = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>(server, {
    cors: {
        origin: ["http://localhost:3000/", "http://boolpan-frontend.s3-website.ap-northeast-2.amazonaws.com/:3000"],
        credentials: true
    }
});

// TODO: 에러 종류 세분화
// TODO: 방장 기능 만들기
// TODO: 메시지 유형 분류하기

/* key: room_id */
const roominfo = new Map<string, {
    name: string
    category: string
    // objectId
    current: string[]
    password: string
    limit: number
    explode_time: number
}>()
/* key: socket.id */
const userinfo = new Map<string, {
    user_id: string,
    name: string
}>()

const eventEmitter = new EventEmitter();

io.on('connection', (socket) => {

    // DB 조회 횟수를 줄이기 위해 런타임에서 채팅방, 유저 정보를 가지고 있음
    // 채팅방은 socket.io 상의 채팅방 이름과 room_id가 같음

    const rooms = io.of("/").adapter.rooms;
    const sids = io.of("/").adapter.sids;
    eventEmitter.on("getCurrentHeadCounts", (callback: (rooms: Map<string, Set<string>>) => void) => {
        callback(rooms)
    })

    // 소켓 정보와 유저의 DB 식별자를 매핑
    socket.on("init", (email) => {
        User.findOne({email: email})
            .then(doc => {
                (doc ? userinfo.set(socket.id, {user_id: doc._id.toString(), name: doc.name}) : null)
            })
    })

    socket.on('disconnect', () => {
        user.delete(socket.id);
    });

    socket.on('sendMessage', (room_id, text) => {
        const user = userinfo.get(socket.id);
        if (!!roominfo && !!user && !!user.user_id) {
            User.findOne({_id: user.user_id})
                .then(doc => {
                    if (doc) {
                        socket.to(room_id).emit('getMessage', {
                            message: {
                                sender: doc.name,
                                text: text,
                                timestamp: getTimestampString()
                            }
                        })
                    }
                })
        } else socket.to(socket.id).emit('error', "메시지를 보내지 못했습니다.")
    });

    // 방 생성
    // client -> `${user} 님이 입장했습니다.`
    socket.on("createRoom", (data, callback) => {
        console.log(`createRoom: ${data.name}`);
        const explode_time = Date.now() + data.keeping_time;

        Room.init()
            .then(() => new Room(data))
            .then(new_room => {
                new_room._id = new mongoose.Types.ObjectId();
                return new_room.save()
            })
            .then(room => {
                const res = {
                    error: ''
                }
                const owner = userinfo.get(socket.id);
                const room_id = room._id.toString()

                if (owner) {
                    socket.in(room_id).emit('newUser', owner.name)
                    roominfo.set(room_id, {
                        ...data,
                        explode_time: Date.now() / 1000 + data.keeping_time,
                        current: [owner.user_id]
                    })
                } else res.error = "방을 만들지 못했습니다."

                callback(res, {room_id: room._id.toString()})

                socket.join(room_id)
                console.log(`explode_time: ${explode_time}`)
                setTimeout(() => {
                    io.to(room_id).emit("deleteRoom", "펑! 방 유지시간이 끝났어요.")
                    io.socketsLeave(room_id);
                }, data.keeping_time)
            })
            .then((id: any) => console.log(`room deleted: ${id}`))
            .catch(error => {
                console.log(error)
                return error
            })
    })

// 입장
// client -> `${user} 님이 입장했습니다.`
    socket.on('joinRoom', (data, callback) => {
        const {room_id, password} = data
        const user = userinfo.get(socket.id)
        let res = {}

        if (user) {
            const user_id = user.user_id;
            const room = rooms.get(room_id)
            const count = (room ? room.size : undefined)
            let limit: number;
            res = Object.assign(res, {
                roominfo: {
                    name: '',
                    current: 0,
                    limit: 0,
                    explode_time: 0
                }
            })
            socket.join(room_id)

            Room.findOne({_id: room_id}).exec()
                .then(
                    room => {
                        if (room) {
                            if (!room.password || (room.password === password)) {
                                limit = room.limit;
                            } else {
                                res = Object.assign(res, {error: "비밀번호가 일치하지 않습니다."})
                            }
                        } else {
                            res = Object.assign(res, {error: "존재하지 않는 방입니다."})
                        }

                        if (count && limit >= count) {
                            socket.join(room_id)
                        } else if (!count) {
                            res = Object.assign(res, {error: "입장하지 못했습니다."})
                        } else {
                            res = Object.assign(res, {error: "정원 초과로 입장하지 못했습니다."})
                        }
                    })
                .catch((e) => {
                    console.log(e)
                })
        } else
            res = Object.assign(res, {error: "로그인 해 주세요."})
        callback(res);
    })


    socket.on('leaveRoom', (params) => {
        socket.leave(params.room_id);
        const user = userinfo.get(socket.id);
        (user ? socket.in(params.room_id).emit('leaveUser', user.name) : null);
    });

})
;

server.listen(PORT, () => {
    console.log("http://localhost:" + PORT);
    console.log("chat server");
});

export default io;