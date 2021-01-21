import socketIo from "socket.io";

class CallChannel {
  constructor(private namespace: socketIo.Namespace) {
    namespace.on("connection", (socket) => {
      // Get information, if the token was ok pass
      // console.log("connected", JSON.stringify(socket.request._query));

      // save socket_id - user_id -> redis

      // join todos:user_id
      socket.on("create", (socket) => {
        // call a service
        console.log("create todo");
      });
      socket.on("create", (socket) => {
        // call a service
      });
    });
  }
}

export default CallChannel;
