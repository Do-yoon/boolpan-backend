import express from "express";
import asyncWrapper from "../controller/Wrapper";
import {Admin} from "../model/AdminSchema";
import mongoose from "mongoose";
import userRouter from "../controller/UserRouter";

/*
 * /v0/admin/login
 */
const adminRouter = express.Router();

adminRouter.post('/login', asyncWrapper(
    async (req:any, res: any) => {
        const info = req.body.admininfo;
        const admin = await Admin.findOne({email: info.email}).exec()
        // console.log(user.password)
        if (!admin || admin.password !== info.password) {
            res.send(null);
            return;
        }
        console.log('/v0/admin/login');

        const res_obj = {
            name: admin.name,
            id: admin._id
        }
        res.send(res_obj);
    }
))
const signup = async (userinfo: any) => {
    console.log('signup');
    await Admin.init();
    const new_user = await new Admin(userinfo)
    new_user._id = new mongoose.Types.ObjectId();
    if (await Admin.exists({email: new_user.email})) {
        console.log(await Admin.exists({email: new_user.email}));
        console.log("exists")
        return false;
    }
    await new_user.save((err: any) => console.log(err));
    return true;
}

adminRouter.post('/signup', asyncWrapper(
    async (req: any, res: any) => {
        //TODO: check type of request body
        console.log(req.body);
        if (!await signup(req.body.admininfo)) {
            res.send(null);
            return;
        }

        console.log('/v0/admin/signup');

        const admininfo = {
            name: "test",
        }

        res.send(admininfo);
    })
);

export default adminRouter;