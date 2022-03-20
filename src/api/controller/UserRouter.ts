import express from "express";
import {User} from "../model/UserSchema";
import asyncWrapper from "./Wrapper";
import mongoose from "mongoose";


const userRouter = express.Router();


userRouter.post('/login', asyncWrapper(
    async (req: any, res: any) => {
        const info = req.body.userinfo;
        const user = await User.findOne({email: info.email}).exec()
        console.log(user.password)
        if (!user || user.password !== info.password) {
            res.send(null);
            return;
        }
        console.log('/v0/user/login');

        const res_obj = {
            name: user.name,
            id: user._id
        }
        res.send(res_obj);


        // let msg = {
        //     message: ''
        // }
        //
        // let err = req.session.error;
        // let suc = req.session.success;
        // delete req.session.error;
        // delete req.session.success;
        // if (err) msg.message = err;
        // if (msg) msg.message = suc;

        //TODO: check type of request body


    })
)

const signup = async (userinfo: any) => {
    console.log('signup');
    await User.init();
    const new_user = await new User(userinfo)
    new_user._id = new mongoose.Types.ObjectId();
    if (await User.exists({email: new_user.email})) {
        console.log(await User.exists({email: new_user.email}));
        console.log("exists")
        return false;
    }
    await new_user.save((err: any) => console.log(err));
    return true;
}

userRouter.post('/signup', asyncWrapper(
    async (req: any, res: any) => {
        //TODO: check type of request body
        console.log(req.body);
        if (!await signup(req.body.userinfo)) {
            res.send(null);
            return;
        }

        console.log('/v0/user/signup');

        const user_info = {
            name: "test",
        }

        res.send(user_info);
    })
);


export default userRouter;