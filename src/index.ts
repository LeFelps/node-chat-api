import { httpServer } from "./http";
import "./websocket";

const port = 10000

httpServer.listen(10000, () =>
  console.log(`Server is running on port ${port}`)
);