import express, { Request, Response, NextFunction } from "express";
import http from "http";
import cors from "cors";
import { Socket } from "socket.io";
const app = express();



const server = http.createServer(app);

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(cors())

const PORT = 5000 || process.env.PORT;

app.get("/", (req: Request, res: Response) => {
    console.log(req)
  res.send("<p>Hello and welcome</p>");
});


io.on('connection', (socket: Socket) => {
    socket.emit('me', socket.id) ; // give own id on front end side


    socket.on('disconnect', () => {
        socket.broadcast.emit("Call ended because one user lelf")
    })

    socket.on("callUser", ({userToCall, signalData,from , name })=> {
        io.to(userToCall).emit("callUser", {signal: signalData, from , name})
    })

    socket.on("answercall", ((data) => {
        io.on(data.to).emit("callaccepted", data.signal) ;
    }))
})

server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
