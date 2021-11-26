import express from "express";
import chatRouter from "./controller/ChatRouter";

const router = express.Router();
const cors = require('cors');

//router.get('/', cors(), (req, res) => { res.send('cors!') });

router.use('/chat', chatRouter);

export default router;