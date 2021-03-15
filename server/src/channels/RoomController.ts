import socketIo from "socket.io";
import RoomRepository from "../repositories/RoomRepository";

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
      const roomId = socket.handshake.query.room;
      const room = RoomRepository.findOne(roomId);

      console.log(`connect user:${user} at room:${roomId}`);

      socket.on("join-room", (data: any) => {
        // Verify if user can enter here

        console.log(data);

        const { room, userId } = data;

        socket.join(`room:${roomId}`);

        namespace.to(`room:${roomId}`).emit("user-connected", userId);
      });

      socket.on("disconnect", () => {
        namespace.to;
      });
    });
  }
}

export default CallController;
