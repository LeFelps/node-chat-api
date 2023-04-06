import express from "express";
import http from "http";
import { Server } from "socket.io";
import "dotenv/config"

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.ORIGIN,
  },
});

export { app, httpServer, io };