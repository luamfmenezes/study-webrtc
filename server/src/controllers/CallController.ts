import socketIo, { Server } from "socket.io";

let users: string[] = [];

interface ICallUser {
  to: string;
  offer: string;
}

interface IMakeAnswer {
  to: string;
  answer: string;
}

class CallController {
  constructor(namespace: socketIo.Namespace) {
    namespace.on("connection", (socket) => {
      const user = socket.handshake.query.user;

      const isOnline = users.find((currentUser) => currentUser === user);

      if (!isOnline) {
        users.push(user);
      }

      socket.join(`user:${user}`);

      socket.emit("connected", "hi");

      socket.emit("online-users", users);

      socket.broadcast.emit("online-users", users);

      socket.on("call-user", (data: ICallUser) => {
        namespace.to(`user:${data.to}`).emit("call-made", {
          offer: data.offer,
          user,
        });
      });

      socket.on("make-answer", (data: IMakeAnswer) => {
        namespace.to(`user:${data.to}`).emit("answer-made", {
          user: user,
          answer: data.answer,
        });
      });

      socket.on("disconnect", () => {
        users = users.filter((currentUser) => currentUser !== user);
      });
    });
  }
}

export default CallController;
