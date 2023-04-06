import { httpServer } from "./http";
import "./websocket";

const port = process.env.PORT || 3333;

httpServer.listen(port, () =>
  console.log(`Server is running on port ${port}`)
);