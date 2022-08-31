import Client from "socket.io-client";
import express from "express";
import http from "http";
import {ClientToServerEvents, InterServerEvents, ServerToClientEvents, SocketData} from "../src/types/ioType";
import {Server} from "socket.io";

describe("my awesome project", () => {
    let serverSocket, clientSocket;

    beforeAll((done) => {
        const app = express();
        const server = http.createServer(app);
        const io = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>(server, {});

    });

    afterAll(() => {
        io.close();
        clientSocket.close();
    });

    test("/user/signin 테스트", (done) => {
        clientSocket.on("hello", (arg) => {
            expect(arg).toBe("world");
            done();
        });
        serverSocket.emit("hello", "world");
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