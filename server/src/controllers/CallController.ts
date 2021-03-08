import socketIo from "socket.io";

let users: string[] = [];

interface ISendOrder {
  target: string;
  description: any;
}

interface ISendAnswer {
  target: string;
  description: any;
}

interface IIceCandidate {
  target: string;
  candidate: string;
}

interface IClose {
  target: string;
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

      console.log("user: " + user);

      socket.emit("online-users", users);

      socket.broadcast.emit("online-users", users);

      socket.on("send-offer", (data: ISendOrder) => {
        console.log(`send-offer -> from:${user} , to:${data.target} `);
        namespace.to(`user:${data.target}`).emit("offer", {
          description: data.description,
          caller: user,
        });
      });

      socket.on("send-answer", (data: ISendAnswer) => {
        console.log(`send-answer -> from:${user} , to:${data.target} `);
        namespace.to(`user:${data.target}`).emit("answer", {
          description: data.description,
          caller: user,
        });
      });

      socket.on("send-icecandidate", (data: IIceCandidate) => {
        namespace.to(`user:${data.target}`).emit("icecandidate", {
          caller: user,
          candidate: data.candidate,
        });
      });

      socket.on("send-close", (data: IClose) => {
        namespace.to(`user:${user}`).to(`user:${data.target}`).emit("close");
      });

      socket.on("disconnect", () => {
        users = users.filter((currentUser) => currentUser !== user);
      });
    });
  }
}

export default CallController;
