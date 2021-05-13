import { Workshop } from "./workshop.model";

export class Provider {
  title: string;
  phone: string;
  email: string;
  workshop: Workshop

  constructor(info) {
    this.title = info.title;
  }
}
