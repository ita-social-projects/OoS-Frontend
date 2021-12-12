export class TechAdmin {
  id?: string;
  userId?: number;

  constructor(info) {
    this.id = info.id;
    this.userId = info.userId;
  }
}
