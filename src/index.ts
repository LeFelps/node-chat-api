import { httpServer } from "./http";
import "./websocket";

httpServer.listen(5000, () =>
  console.log("Server is running on port 5000")
);