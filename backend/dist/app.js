"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = require("socket.io")(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});
app.use((0, cors_1.default)());
const PORT = 5000 || process.env.PORT;
app.get("/", (req, res) => {
    console.log(req);
    res.send("<p>Hello and welcome</p>");
});
io.on('connection', (socket) => {
    socket.emit('me', socket.id); // give own id on front end side
    socket.on('disconnect', () => {
        socket.broadcast.emit("Call ended because one user lelf");
    });
    socket.on("callUser", ({ userToCall, signalData, from, name }) => {
        io.to(userToCall).emit("callUser", { signal: signalData, from, name });
    });
    socket.on("answercall", ((data) => {
        io.on(data.to).emit("callaccepted", data.signal);
    }));
});
server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
