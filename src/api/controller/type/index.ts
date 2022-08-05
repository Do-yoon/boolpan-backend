export type RoomType = {
    current: number
    limit: number
    password: string
    explode_time: Date
    category: string
    name: string
}

export interface ChatList {
    chat_list: RoomType[]
}

export const ErrorType = {
    ALREADY_EXIST: "같은 이름의 방이 존재합니다.",
    INTERNAL_ERROR: "내부 에러가 발생했습니다. 다시 시도해 주세요."
}