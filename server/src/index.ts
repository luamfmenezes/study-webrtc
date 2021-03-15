import { Server } from "./server";
const { PeerServer } = require("peer");

const server = new Server();

server.listen((port) => {
  console.log(`Server is listening on http://localhost:${port}`);
});

const peerServer = PeerServer({
  port: 9000,
  path: "/myapp",
  proxied: true,
});
