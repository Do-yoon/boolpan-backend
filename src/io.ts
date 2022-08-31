import {server} from "./app";
import {Server} from "socket.io";
import process from "process";
import {createRoom, joinRoom} from "./database/transaction";
import {
    CreateRoomParams,
    JoinRoomParams, LeaveRoomParams,
    SendMessageParams
} from "./api/controller/type/RequestDataTypes";
import {JoinRoomResponseData} from "./api/controller/type/ResponseDataTypes";
import user from "./api";
import {Room, User} from "./database/model";
import {getTimestampString} from "./util/getTimestampString";
import {ClientToServerEvents, InterServerEvents, ServerToClientEvents, SocketData} from "./types/ioType";

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
io.on('connection', (socket) => {

    // DB 조회 횟수를 줄이기 위해 런타임에서 채팅방, 유저 정보를 가지고 있음
    // 채팅방은 socket.io 상의 채팅방 이름과 room_id가 같음
    /*
    key: room_id
     */
    const roominfo = new Map<string, {
        name: string
        category: string
        current: number
        password: string
        limit: number
        explode_time: number
    }>()
    /*
    key: socket.id
     */
    const userinfo = new Map<string, {
        user_id: string,
        name: string
    }>()

    const rooms = io.of("/").adapter.rooms;
    const sids = io.of("/").adapter.sids;

    // 소켓 정보와 유저의 DB 식별자를 매핑
    socket.on("init", (email: string) => {
        User.findOne({email: email})
            .then(doc => {
                userinfo.set(socket.id, {...doc})
            })
    })

    socket.on('disconnect', () => {
        console.log('user disconnected');
        user.delete(socket.id);
    });

    socket.on('sendMessage', (params: SendMessageParams) => {
        const user = userinfo.get(socket.id);

        (!!roominfo && !!user && !!user.user_id
                ? User.findOne({_id: user.user_id})
                    .then(doc => {
                        socket.to(params.room_id).emit('getMessage', {
                            message: {
                                sender: doc?.user?.name,
                                text: params.msg,
                                timestamp: getTimestampString()
                            }
                        })
                    })
                : socket.to(socket.id).emit('error', "메시지를 보내지 못했습니다.")
        )
    });

    // 방 생성
    // client -> `${user} 님이 입장했습니다.`
    socket.on("createRoom", (params: CreateRoomParams) => {
        console.log(`createRoom: ${params.data.name}`);
        const explode_time = Date.now() + params.data.keeping_time;

        createRoom({
            ...params.data,
            explode_time: explode_time,
            current: 1
        }).then((room: any) =>
            new Promise((resolve, reject) => {
                console.log(room)
                const res = {
                    error: ''
                }
                const user_id = user.get(socket.id);

                (user_id ?
                        User.findOne({_id: user_id})
                            .then(doc => {
                                //로그
                                socket.in(room._id).emit('newUser', doc?.name)
                            })
                        :
                        res.error = "방을 만들지 못했습니다."
                )
                if (typeof params.callback !== "function") {
                    console.log(`callback is not a function: ${params.callback}`)
                    res.error = `callback is not a function: ${params.callback}`
                }
                params.callback(res)

                socket.join(room._id)
                console.log(`explode_time: ${explode_time}`)
                setTimeout(() => {
                    io.to(room._id).emit("deleteRoom", "펑! 방 유지시간이 끝났어요.")
                    io.socketsLeave(room._id);
                    //로그
                    resolve(room._id)
                }, params.data.keeping_time);
            })
        ).then((id: any) => {
            console.log(`room deleted: ${id}`)
        })
    });

    // 입장
    // client -> `${user} 님이 입장했습니다.`
    socket.on('joinRoom', ({callback, data}: JoinRoomParams) => {
        const {room_id, password} = data

        socket.join(room_id)
        console.log(`join:${room_id}`)

        let res: JoinRoomResponseData = {
            roominfo: {
                name: '',
                current: 0,
                limit: 0,
                explode_time: 0
            },
            error: ''
        }

        const len = rooms.get(room_id)
        joinRoom(room_id, socket.id, password)
            .then((room: any) => {
                if (len && room.limit >= len) {
                    socket.join(room_id)
                } else if (!len) {
                    res.error = "입장하지 못했습니다.";
                } else {
                    res.error = "정원 초과로 입장하지 못했습니다."
                }
            })

        if (typeof callback === "function")
            callback(res)
        else {
            console.log(`callback is not a function: ${callback}`)
            res.error = `callback is not a function: ${callback}`
        }

    })

    socket.on('leaveRoom', (params: LeaveRoomParams) => {
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
