import express from "express";
import chatRouter from "./controller/ChatRouter";
import userRouter from "./controller/UserRouter";
import adminRouter from "./admin/AdminRouter";
import chatServerRouter from "./chat/ChatServer";
import cors from "cors";
const user = express.Router();

// export const chat = express.Router();
// export const admin = express.Router();

//router.get('/', cors(), (req, res) => { res.send('cors!') });

// TODO: 도메인 단위, router 정리하기
user.use(cors({
    credentials: true
}))
user.use('/chat', chatRouter);
user.use('/user', userRouter);
user.use('/chatRoom', chatServerRouter)
// admin.use('/admin', adminRouter);
// chat.use('/')

export default user;