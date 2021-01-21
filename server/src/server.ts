import express, { Application } from "express";
import { createServer, Server as HTTPServer } from "http";
import Socket from "./Socket";
import cors from "cors";
import ISocket from "./models/ISocket";
import socketRoutes from "./routes";
import socketContainer from "./container";

export class Server {
  private httpServer: HTTPServer;
  private app: Application;
  private io: ISocket;
  private readonly DEFAULT_PORT = 3333;

  constructor() {
    this.initialize();
    this.handleRoutes();
    this.handleDependenceInjection();
  }

  private initialize(): void {
    this.app = express();
    this.httpServer = createServer(this.app);
    this.app.use(cors());
    this.io = Socket;
  }

  private handleRoutes(): void {
    this.app.get("/", (req, res) => {
      res.send(`<h1>Hello World</h1>`);
    });
    this.io.use(socketRoutes);
  }

  private handleDependenceInjection(): void {
    this.io.use(socketContainer);
  }

  public listen(callback: (port: number) => void): void {
    this.io.listen(this.httpServer, this.DEFAULT_PORT);
    this.httpServer.listen(this.DEFAULT_PORT, () =>
      callback(this.DEFAULT_PORT)
    );
  }
}
