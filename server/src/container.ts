import socket from "./socket/Socket";

const depenceRegister = socket.createDependeceRegister();

depenceRegister.registerDependece("/chat", (channel) => {
  console.log("Access scr/container.ts to config the dependence injection");
});

export default depenceRegister;
