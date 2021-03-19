import socketIo from "socket.io";

interface IUser {
  username: string;
  peerId: string;
}

let users: IUser[] = [];

class CallController {
  constructor(namespace: socketIo.Namespace) {
    namespace.on("connection", (socket) => {
      const username = socket.handshake.query.username;
      let peerId = "";

      console.log(`connect user:${username}`);

      socket.on("join-room", (data: any) => {
        peerId = data.peerId;

        socket.join("room:default");

        socket.emit("users-connected", users);

        users.push({ peerId, username });
      });

      socket.on("disconnect", () => {
        console.log("disconnect: " + peerId);
        namespace.to("room:default").emit("user-disconnected", { peerId });
        users = users.filter((el) => el.peerId !== peerId);
      });

      socket.on("close-room", () => {
        console.log("close-room: " + peerId);
        users = [];
        namespace.to("room:default").emit("close-room");
      });
    });
  }
}

export default CallController;
