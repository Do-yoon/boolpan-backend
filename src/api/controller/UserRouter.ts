import express from "express";
import {User} from "../model/UserSchema";
import asyncWrapper from "./Wrapper";
import mongoose from "mongoose";


const userRouter = express.Router();

const login = async (userinfo: any) => {
    if (await User.exists(userinfo)) {
        console.log('pass')
        return true;
    } else {
        return false;
    }
}

userRouter.post('/login', asyncWrapper(
    async (req: any, res: any) => {
        if (!await login(req.body.userinfo)) {
            res.send(null);
            return;
        }
        //TODO: check type of request body
        console.log(req.body)

        console.log('/v0/user/login');

        const user_info = {
            name: "test",
        }

        res.send(user_info);
    })
)

const signup = async (userinfo: any) => {
    console.log('signup');
    await User.init();
    const new_user = await new User(userinfo)
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