import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "https://react-chat-kacn.onrender.com",
  },
});

export { app, httpServer, io };