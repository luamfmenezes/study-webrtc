import ISocket from "../models/ISocket";
import IUseSocket from "../models/IUseSocket";

interface ISocketRoute {
  name: string;
  route: string;
  Controller: any;
}

class SocketRouter implements IUseSocket {
  public routes: ISocketRoute[] = [];

  public channel(name: string, route: string, Controller: any) {
    console.log(Controller);
    this.routes.push({ name, route, Controller });
  }

  public registerChannels(Router: SocketRouter) {
    this.routes.push(...Router.routes);
  }

  public execute(Socket: ISocket) {
    this.routes.forEach((route) => {
      const socket = Socket.io.of(route.route);
      const { Controller } = route;
      new Controller(socket);
      console.log(`Register ${route.route}`);
    });
  }
}

export default SocketRouter;
