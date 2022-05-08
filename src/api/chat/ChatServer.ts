import express from "express";
import controller from "../index";
import app from "../../app";
import asyncWrapper from "../controller/Wrapper";

const chatServerRouter = express.Router();
chatServerRouter.post('/room', asyncWrapper(
    async (req: any, res: any) => {



    }
));

export default chatServerRouter;