import {Socket as ClientSocket, io as ClientIO} from "socket.io-client";
import express from "express";
import http from "http";
import {ClientToServerEvents, ServerToClientEvents} from "../src/ioType";
import io from "io";
import {Socket} from "socket.io";

describe("my awesome project", () => {
    let clientSocket: ClientSocket<ServerToClientEvents, ClientToServerEvents>, serverSocket: Socket;

    beforeAll((done) => {
        clientSocket = ClientIO("http://localhost:8081", {
            // withCredentials: true,
            transports: ['websocket']
        });
        clientSocket.on("connect", done);
    });

    afterAll(() => {
        io.close();
        clientSocket.close();
    });

    test("/user/signin 테스트", (done) => {
        const data = {
            name: "test",
            category: "아이돌",
            limit: 100,
            password: "1234",
            keeping_time: 10000
        }

    });

    test("should work (with ack)", (done) => {
        serverSocket.on("hi", (cb) => {
            cb("hola");
        });
        clientSocket.emit("hi", (arg) => {
            expect(arg).toBe("hola");
            done();
        });
    });
});