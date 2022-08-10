

export type JoinRoomResponseData = {
    roominfo: {
        name: string,
        current: number,
        limit: number,
        explode_time: number
    },
    error: string
}