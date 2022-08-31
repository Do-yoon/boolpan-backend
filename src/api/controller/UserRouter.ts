import express from "express";
import {User} from "../../database/model/user/UserSchema";
import asyncWrapper from "./Wrapper";
import mongoose from "mongoose";


const userRouter = express.Router();


userRouter.post('/login', (req: any, res: any) => {
        const info = req.body.userinfo;
        User.findOne({email: info.email}).exec()
            .then((user) => {
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
            })

        //TODO: check type of request body
    }
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

userRouter.post('/signup', (req: any, res: any) => {
    //TODO: check type of request body
    console.log(req.body);
    signup(req.body.userinfo)
        .then((doc) => {
            if (doc) {
                res.send({name: req.body.name})
            } else {
                res.send(null)
            }
        })
})


export default userRouter;