import { Router } from "express";

const routes = Router();

import RooomRepository from "../repositories/RoomRepository";

routes.post("/rooms", (request, response) => {
  const id = RooomRepository.create();
  return response.json({ id });
});
