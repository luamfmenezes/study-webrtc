import socket from "./socket/Socket";
import CallController from "./controllers/CallController";

const router = socket.createRouter();

router.channel("chat", "/chat", CallController);

export default router;
