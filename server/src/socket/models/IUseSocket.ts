import ISocket from "./ISocket";

export default interface IUseSocket {
  execute(socket: ISocket): void;
}
