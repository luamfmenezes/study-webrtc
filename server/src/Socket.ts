import { Server, Namespace } from "socket.io";
import SocketRouter from "./SocketRouter";
import ISocket from "./models/ISocket";
import SocketDependenceRegister from "./SocketDependenceRegister";
import IUseSocket from "./models/IUseSocket";

interface IChannelDTO {
  name: string;
  route: string;
  Controller: any;
}

class Socket implements ISocket {
  public io: Server;
  public channels: IChannelDTO[] = [];

  // --- Channel Approach

  public getChannel(name: string): Namespace | undefined {
    return this.io.of(name);
  }

  public channel(name, route, Controller) {
    this.channels.push({ name, route, Controller });
  }

  public registerChannels() {
    this.channels.forEach((channel) => {
      const socket = this.io.of(channel.route);
      const { Controller } = channel;
      new Controller(socket);
    });
  }

  // --- Route approach

  public createRouter() {
    return new SocketRouter();
  }

  public createDependeceRegister() {
    return new SocketDependenceRegister();
  }

  public useRouter(Router: SocketRouter) {
    Router.routes.forEach((route) => {
      const socket = this.io.of(route.route);
      const { Controller } = route.Controller;
      new Controller(socket);
    });
  }

  public use(Router: IUseSocket) {
    Router.execute(this);
  }

  // --- Listen

  public listen(server: any, port: number) {
    this.io = new Server(server);
    this.io.listen(port);
  }
}

export default new Socket();
