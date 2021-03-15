import socket from "../socket/Socket";
import CallController from "../channels/CallController";
import RoomController from "../channels/RoomController";

const router = socket.createRouter();

router.channel("chat", "/chat", CallController);

router.channel("rooms", "/rooms", RoomController);

export default router;
