import express from "express";

export interface Context {
    requestId: number;
    request: express.Request;
    response: express.Response;
}