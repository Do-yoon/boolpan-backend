import {User} from "../mongo/model/UserSchema";
import mongoose from "mongoose";

/* @type {userinfo: {email: string, password: string}} */
export function login(req: any, res: any) {
    const info = req.body.userinfo;
    console.log(req.body)
    User.findOne({email: info.email}).exec()
        .then((user) => {
            console.log(user)
            if (user) {
                if (user.password === info.password) {
                    const res_obj = {
                        name: user.name,
                        user_id: user._id
                    }
                    res.send(res_obj);
                }
            } else {
                res.send(null)
            }
        }).catch(e => console.log(e))
}

export function signup(req: any, res: any) {
    console.log(req.body);
    const userinfo = req.body.userinfo
    User.init().then(() => {
    });
    const new_user = new User(userinfo);
    new_user._id = new mongoose.Types.ObjectId();
    User.exists({email: new_user.email})
        .then((doc) =>
            doc ? console.log(doc) : res.send({error: "방이 이미 존재합니다."})
        )

    new_user.save((err) => console.log(err));
    res.send({name: req.body.name})
}