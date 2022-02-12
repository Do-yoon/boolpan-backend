import express from "express";

const userRouter = express.Router();

userRouter.post('/login', (req: any, res: any) => {
    //TODO: add validate logic
    //TODO: check type of request body
    console.log(req.body)

    console.log('/v0/user/login');

    const user_info = {
        name: "test",
    }

    res.send(user_info);
})

export default userRouter;