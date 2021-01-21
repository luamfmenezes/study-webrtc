import socket from "./Socket";
import ChatController from "./controllers/CallController";

const router = socket.createRouter();

router.channel("chat", "/chat", ChatController);

export default router;
