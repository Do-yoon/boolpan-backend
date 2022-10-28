import {Socket as ClientSocket, io as ClientIO} from "socket.io-client";
import express from "express";
import http from "http";
import {ClientToServerEvents, Chat_ServerToClientEvents} from "../src/ioType";
import io from "io";
import {Socket} from "socket.io";

describe("my awesome project", () => {
    let clientSocket: ClientSocket<Chat_ServerToClientEvents, ClientToServerEvents>, serverSocket: any;
    beforeAll((done) => {
        clientSocket = ClientIO("http://localhost:8081", {
            // withCredentials: true,
            transports: ['websocket']
        });
        clientSocket.on("connect", done);
        serverSocket = io;
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

        clientSocket.emit("joinRoom", {room_id: "room_id", user_id: "user_id"},() => {
            done();
        })

        serverSocket.on("joinRoom", (data: {room_id: string, user_id: string}, callback: ()=>any) => {
            console.log(`room_id: ${data.room_id}`)
            console.log(`user_id: ${data.user_id}`)
        })
    });
/*
    test("should work (with ack)", (done) => {
        serverSocket.on("hi", (cb) => {
            cb("hola");
        });
        clientSocket.emit("hi", (arg) => {
            expect(arg).toBe("hola");
            done();
        });
    });
 */
});