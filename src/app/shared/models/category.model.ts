export class Direction {
  id: number;
  title: string;
  description: string;

  constructor(info) {
    if(info.id){
      this.id = info.id;
    }
    this.title = info.title;
    this.description = info.title;
  }
}
export interface DirectionsFilter {
  totalAmount: number;
  entities: Direction[];
}
