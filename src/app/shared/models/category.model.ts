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

export class Department {
  id: number;
  directionId: number;
  title: string;
  description: string;

  constructor(info, directionId) {
    if(info.id){
      this.id = info.id;
    }
    this.directionId = directionId;
    this.title = info.title;
    this.description = info.title;
  }
}

export class IClass {
  id: number;
  departmentId: number;
  title: string;
  description: string;

 constructor(info, departmentId, id?) {
    this.id = id,
    this.departmentId = departmentId,
    this.title = info.title,
    this.description = info.title
  }
}
export interface IClasses {
  IclassId: string;
}

export interface DirectionsFilter {
  totalAmount: number;
  entities: Direction[];
}
