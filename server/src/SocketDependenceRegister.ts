import { Namespace } from "socket.io";
import ISocket from "./models/ISocket";
import IUseSocket from "./models/IUseSocket";

type IRegisterCallback = (data: Namespace) => void;

interface IRegister {
  channel: string;
  callback: IRegisterCallback;
}

class SocketDependenceRegister implements IUseSocket {
  registers: IRegister[] = [];

  public registerDependece(channel: string, callback: IRegisterCallback) {
    this.registers.push({ channel, callback });
  }

  public execute(Socket: ISocket) {
    this.registers.forEach((register) => {
      const channel = Socket.getChannel(register.channel);
      if (channel) {
        register.callback(channel);
      }
    });
  }
}

export default SocketDependenceRegister;
