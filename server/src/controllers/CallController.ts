import socketIo from "socket.io";

let activeSockets: string[] = [];

interface ICallUser {
  to: string;
  offer: string;
}

interface IMakeAnswer {
  to: string;
  answer: string;
}

class CallController {
  constructor(private namespace: socketIo.Namespace) {
    namespace.on("connection", (socket) => {
      console.log("connected", socket.id);

      socket.emit("update-user-list", {
        users: activeSockets,
      });

      socket.broadcast.emit("update-user-list", {
        users: activeSockets,
      });

      socket.on("call-user", (data: ICallUser) => {
        socket.to(data.to).emit("call-made", {
          offer: data.offer,
          socket: socket.id,
        });
      });

      socket.on("make-answer", (data: IMakeAnswer) => {
        socket.to(data.to).emit("answer-made", {
          socket: socket.id,
          answer: data.answer,
        });
      });

      socket.on("disconnect", () => {
        console.log("disconnected", socket.id);
        activeSockets = activeSockets.filter(
          (existingSocket) => existingSocket !== socket.id
        );
      });
    });
  }
}

export default CallController;
