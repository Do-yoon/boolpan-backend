import express from "express";
import chatRouter from "./controller/ChatRouter";
import userRouter from "./controller/UserRouter";

const router = express.Router();
const cors = require('cors');

//router.get('/', cors(), (req, res) => { res.send('cors!') });

router.use('/chat', chatRouter);
router.use('/user', userRouter)

export default router;