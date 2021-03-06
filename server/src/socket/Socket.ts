import { Server, Namespace } from "socket.io";
import SocketRouter from "./SocketRouter";
import ISocket from "../models/ISocket";
import SocketDependenceRegister from "./SocketDependenceRegister";
import IUseSocket from "../models/IUseSocket";

interface IChannelDTO {
  name: string;
  route: string;
  Controller: any;
}

class Socket implements ISocket {
  public io: Server;
  public channels: IChannelDTO[] = [];
  private useSockets: IUseSocket[] = [];

  public getChannel(name: string): Namespace | undefined {
    return this.io.of(name);
  }

  public createRouter() {
    return new SocketRouter();
  }

  public createDependeceRegister() {
    return new SocketDependenceRegister();
  }

  public use(useSocket: IUseSocket) {
    this.useSockets.push(useSocket);
  }

  private configUses() {
    this.useSockets.forEach((useSocket) => {
      useSocket.execute(this);
    });
  }

  public listen(server: any, port: number) {
    this.io = new Server(server);
    this.io.listen(port, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    });
    console.log("socket listen on port: " + port);
    this.configUses();
  }
}

export default new Socket();
