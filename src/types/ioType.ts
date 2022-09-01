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
    sendMessage: (room_id: string, text: string) => void;
    createRoom: (roomData: {
                     name: string
                     category: string
                     password: string
                     limit: number
                     keeping_time: number
                 },
                 callback: (e: {error: string}, data: {
                     room_id: string
                 }) => void) => void;
    joinRoom: (data: {
                   room_id: string,
                   password: string
               },
               callback: (data: {
                   roominfo: {
                       name: string,
                       current: number,
                       limit: number,
                       explode_time: number
                       password?: string
                   },
                   error: string
               }) => void
    ) => void;
    leaveRoom: (args: {
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