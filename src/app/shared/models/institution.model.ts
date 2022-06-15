import { Direction } from 'src/app/shared/models/category.model';
export interface Institution {
  id: string;
  title: string;
  numberOfHierarchyLevels: number;
}

export interface  InstitutionFieldDescription {
  id: string;
  institutionId: string;
  title: string;
  hierarchyLevel: number;
}
export interface InstituitionHierarchy {
  id: string;
  title: string;
  hierarchyLevel: number,
  parentId: string;
  institutionId: string;
  institution: Institution,
  directions: Direction[]
}
