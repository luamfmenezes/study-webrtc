import { Namespace, Server } from "socket.io";
import SocketRouter from "../SocketRouter";
import IUseSocket from "./IUseSocket";

interface IChannelDTO {
  name: string;
  route: string;
  Controller: any;
}

export default interface ISocket {
  io: Server;
  channels: IChannelDTO[];
  getChannel(name: string): Namespace | undefined;
  channel(name: string, route: string, Controller: any): void;
  registerChannels(): void;
  createRouter(): void;
  useRouter(Router: SocketRouter): void;
  use(Router: IUseSocket): void;
  listen(server: any, port: number): void;
}
