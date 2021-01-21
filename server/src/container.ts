import socket from "./Socket";

const depenceRegister = socket.createDependeceRegister();

depenceRegister.registerDependece((Socket) => {
  const chatChannel = Socket.getChannel("/chatChannel");
  // set dependence injection here.
});

export default depenceRegister;
