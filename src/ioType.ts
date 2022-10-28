export interface Chat_ServerToClientEvents {
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
    getChattingRoomList: (
        callback: (data: {
            room_id: string
            name: string
            limit: number
            current?: number
            isPassword: boolean
        }[]) => void) => void
    sendMessage: (data: {room_id: string, text: string, user_id: string}) => void;
    createRoom: (roomData: {
                     name: string
                     category: string
                     password: string
                     limit: number
                     keeping_time: number
                 },
                 user: {
                     user_id: string
                 },
                 callback: (e: string, data: {
                     room_id: string
                     name: string
                     limit: number
                     current?: number
                     isPassword: boolean
                 }) => void) => void;
    joinRoom: (data: {
                   room_id: string,
                   user_id: string,
                   password?: string
               },
               callback: (data: {
                   roominfo?: {
                       name: string,
                       current: number,
                       limit: number,
                       explode_time: number
                       password?: string
                   },
                   error?: string
               }) => void
    ) => void;
    leaveRoom: (args: {
        user_id: string
        room_id: string
    }) => void;
}

export interface InterServerEvents {
    ping: () => void;
}

export interface SocketData {
    name: string;
    age: number;
}