import {
    CreateRoomParams,
    JoinRoomParams,
    LeaveRoomParams,
    SendMessageParams
} from "../api/controller/type/RequestDataTypes";

export interface ServerToClientEvents {
    init: () => void;
    deleteRoom: (msg: string) => void;
    getMessage: (args: {
        message: {
            sender: string,
            text: string,
            timestamp: string
        }
    }) => void;
    newUser: (name: string) => void;
    error: (e: string) => void;
    leaveUser: (name: string) => void;
}

export interface ClientToServerEvents {
    init: (email: string) => void;
    sendMessage: (args: SendMessageParams) => void;
    createRoom: (args: CreateRoomParams) => void;
    joinRoom: ({callback, data}: JoinRoomParams) => void;
    leaveRoom: (params: LeaveRoomParams) => void;
}

export interface InterServerEvents {
    ping: () => void;
}

export interface SocketData {
    name: string;
    age: number;
}