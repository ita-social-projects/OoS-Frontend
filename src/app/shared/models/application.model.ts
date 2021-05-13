import { Child } from "./child.model";
import { Provider } from "./provider.model";
import { Workshop } from "./workshop.model";

export class Application {
  id: number;
  status: string;
  message: string;
  date: Date;
  workshop: Workshop;
  child: Child;
  provider: Provider;

  constructor(info) {
    this.id = null;
    this.status = info.status;
    this.message = info.message;
    this.date = info.date;
    this.child = info.child;
    this.workshop = info.workshop;
  }
}