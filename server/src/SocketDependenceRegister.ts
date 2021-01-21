import ISocket from "./models/ISocket";
import IUseSocket from "./models/IUseSocket";

type IRegisterDependenceFunction = (data: ISocket) => void;

class SocketDependenceRegister implements IUseSocket {
  registers: IRegisterDependenceFunction[] = [];

  public registerDependece(register: IRegisterDependenceFunction) {
    this.registers.push(register);
  }

  public execute(Socket: ISocket) {
    this.registers.forEach((fn) => {
      fn(Socket);
    });
  }
}

export default SocketDependenceRegister;
