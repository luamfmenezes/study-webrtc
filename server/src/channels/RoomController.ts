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

        console.log(users);
      });

      socket.on("disconnect", () => {
        namespace.to("room:default").emit("user-disconnected", { peerId });
        users = users.filter((el) => el.peerId !== peerId);
      });
    });
  }
}

export default CallController;
