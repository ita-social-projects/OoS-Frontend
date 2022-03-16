export class Direction {
  id: number;
  title: string;
  description: string;
  

  constructor(info, id?) {
    this.id = id;
    this.title = info.title;
    this.description = info.title;
    
  }
}

export class Department {
  id: number;
  directionId: number;
  title: string;
  description: string;

  constructor(info, directionId, id?) {
    this.id = id;
    this.directionId = directionId;
    this.title = info.title;
    this.description = info.title;
  }
}

export interface IClass {
  id: number;
  title: string;
  description: string;
  departmentId: number;
}

export interface DirectionsFilter {
  totalAmount: number;
  entities: Direction[];
}
