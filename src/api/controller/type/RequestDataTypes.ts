import {JoinRoomResponseData} from "./ResponseDataTypes";

export type CreateRoomParams = {
    data: {
        name: string
        category: string
        password: string
        limit: number
        keeping_time: number
    }
    callback: (response: any) => void
}
export type JoinRoomParams = {
    data: {
        room_id: string
        password: string
    }
    callback: (data: JoinRoomResponseData) => void
}


export type SendMessageParams = {
    room_id: string
    msg: string
}

export type LeaveRoomParams = {
    room_id: string
}