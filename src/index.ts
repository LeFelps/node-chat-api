import { httpServer } from "./http";
import "./websocket";

const port = 3333

httpServer.listen({
  host: "0.0.0.0",
  port: port,
}, () =>
  console.log(`Server is running on port ${port}`)
);