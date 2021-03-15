import { v4 } from "uuid";

interface Room {
  status: string;
  started_at: Date;
  peers: any[];
}

class RoomRepository {
  private rooms: any = {};

  create(): string {
    const id = v4();
    this.rooms[id] = {
      status: "pending",
      started_at: new Date(),
      peers: [],
    };
    return id;
  }

  findOne(id: string): Room | undefined {
    return this.rooms[id];
  }

  save(id: string, room: Room): Room {
    this.rooms[id] = room;
    return room;
  }
}

export default new RoomRepository();
