import app from "../src/app";
import * as request from "supertest";
const version = 'v0'

describe("/chat", () => {
    test("채팅 목록 반환", done => {
        request(app)
            .get(`/${version}/chat`)
            .then(response => {
                expect(response.statusCode).toBe(200);
                done();
            });
    });
});