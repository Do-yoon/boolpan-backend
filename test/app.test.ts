const app = require("../src/app")
const chat = require('../src/api/controller/ChatRouter');
const request = require("supertest");
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