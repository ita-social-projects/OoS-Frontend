export interface Direction {
  id: number;
  title: string;
  description: string;
}
export interface Department {
  id: number;
  directionId: number;
  title: string;
  description: string;
}

export interface IClass {
  id: number;
  title: string;
  description: string;
  departmentId: number;
}
export interface topDirection{
  direction:{
    id: number;
    directionId: number;
    title: string;
    description: string;
  };
  workshopsCount: number,
  applicationsCount: number
}