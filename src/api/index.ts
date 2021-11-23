import express from "express";
import chatRouter from "./controller/ChatRouter";

const router = express.Router();

router.use('/chat', chatRouter);

export default router;