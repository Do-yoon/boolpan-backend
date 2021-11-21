import express from "express";

const chatRoomRouter = express.Router();

chatRoomRouter.get('/', (req: any, res: any) => {
    // Todo: 객체화
    res.send([
        {
            name: 'name',
            limit: 100,
            current_people: 1
        }
    ]);
});

chatRoomRouter.get('/:id', (req: any, res: any) => {
    res.send(
        {
            name: 'roomname',
            limit: 100,
            current_people: 1
        }
    )
})

export default chatRoomRouter;
