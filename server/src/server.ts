import express, { Application } from "express";
import { Server as SocketIOServer } from "socket.io";
import { createServer, Server as HTTPServer } from "http";
import cors from "cors";

interface ICallUser {
  to: string;
  offer: string;
}

interface IMakeAnswer {
  to: string;
  answer: string;
}

export class Server {
  private httpServer: HTTPServer;
  private app: Application;
  private io: SocketIOServer;
  private activeSockets: string[] = [];
  private readonly DEFAULT_PORT = 5000;

  constructor() {
    this.initialize();
    this.handleRoutes();
    this.handleSocketConnection();
  }

  private initialize(): void {
    this.app = express();
    this.httpServer = createServer(this.app);
    this.app.use(cors());
    this.io = new SocketIOServer(this.httpServer, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    });
  }

  private handleRoutes(): void {
    this.app.get("/", (req, res) => {
      res.send(`<h1>Hello World</h1>`);
    });
  }

  private handleSocketConnection(): void {
    this.io.on("connection", (socket) => {
      console.log("connected", socket.id);

      const existingSocket = this.activeSockets.find(
        (existingSocket) => existingSocket === socket.id
      );

      if (!existingSocket) {
        this.activeSockets.push(socket.id);
      }

      socket.emit("update-user-list", {
        users: this.activeSockets,
      });

      socket.broadcast.emit("update-user-list", {
        users: this.activeSockets,
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
        this.activeSockets = this.activeSockets.filter(
          (existingSocket) => existingSocket !== socket.id
        );
      });
    });
  }

  public listen(callback: (port: number) => void): void {
    this.httpServer.listen(this.DEFAULT_PORT, () =>
      callback(this.DEFAULT_PORT)
    );
  }
}
