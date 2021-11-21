import express from "express";
import chatRoomRouter from "./controller/ChatRoomRouter";

const router = express.Router();

router.use('/chatRoomList', chatRoomRouter);

export default router;