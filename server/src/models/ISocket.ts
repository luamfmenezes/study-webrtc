import { Namespace, Server } from "socket.io";
import IUseSocket from "./IUseSocket";

interface IChannelDTO {
  name: string;
  route: string;
  Controller: any;
}

export default interface ISocket {
  io: Server;
  channels: IChannelDTO[];
  // channel(name: string, route: string, Controller: any): void;
  // registerChannels(): void;
  getChannel(name: string): Namespace | undefined;
  createRouter(): IUseSocket;
  createDependeceRegister(): IUseSocket;
  use(Router: IUseSocket): void;
  listen(server: any, port: number): void;
}
