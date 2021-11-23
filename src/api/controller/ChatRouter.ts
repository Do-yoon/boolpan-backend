import express from "express";

const chatRouter = express.Router();

chatRouter.get('/', (req: any, res: any) => {
    const chat_list: Chat[] = [
        {
            id: 0,
            name: 'name',
            limit: 100,
            current: 1
        }
    ]

    res.send(chat_list);
});

chatRouter.get('/:id', (req: any, res: any) => {
    const chat: Chat = {
        id: 0,
        name: 'room_name',
        limit: 100,
        current: 1
    }

    res.send(chat);

})

chatRouter.post('/sendMessage', (req: any, res: any) => {
    const msg = req.body;
    console.log(msg);

    // no problem
    res.send({status: 0});
});

interface Chat {
    id: number
    name: string
    limit: number
    current: number
}

interface ChatList {
    chat_list: Chat[]
}


export default chatRouter;
