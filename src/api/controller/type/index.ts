export type RoomType = {
    name: string
    category: string
    current: number
    password: string
    limit: number
    explode_time: number
}

export type RoomInfoType = {
    // 익명 유저 소켓 아이디와 방 이름을 매핑
    anonymous_user_number: Map<string, number>
    explode_time: Number
}

export interface UserInfo {
    user_id: string
}

export interface ChatList {
    chat_list: RoomType[]
}

export const ErrorType = {
    ALREADY_EXIST: "같은 이름의 방이 존재합니다.",
    INTERNAL_ERROR: "내부 에러가 발생했습니다. 다시 시도해 주세요."
}