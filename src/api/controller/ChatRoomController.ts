import app from "../../app";

const ChatRoomController = {
    '/chatRoomList': {
        'get': (req: any, res: any) => {
            res.send({id: 0, name: 'test', current: 10, max: 100});
        }
    }
}