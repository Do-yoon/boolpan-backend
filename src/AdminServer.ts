import express from "express";
import admin from "./api";

const cors = require('cors');

function AdminServer() {
    const admin_app = express();
    const admin_server = require('http').createServer(admin_app);
    const admin_io = require('socket.io')(admin_server);
    const ADMIN_PORT = 8082;

    admin_app.use(cors('mongodb://mongo:27017'));

    admin_app.set("port_boolpan_admin", ADMIN_PORT);
    admin_app.use('/boolpan/admin', admin);
    admin_io.listen(admin_io.get("port_boolpan_admin"), () => {
        console.log("listening to admin port");
    });
}

export default AdminServer;