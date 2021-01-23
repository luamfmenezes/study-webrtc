import socket from "./Socket";

const depenceRegister = socket.createDependeceRegister();

depenceRegister.registerDependece("/chat", (channel) => {
  // const chatChannel = Socket.getChannel("/chatChannel");
  // set dependence injection here.
});

export default depenceRegister;
