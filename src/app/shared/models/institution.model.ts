import { FormControl } from '@angular/forms';
import { Direction } from './category.model';
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
  hierarchyLevel: number;
  parentId: string;
  institutionId: string;
  institution: Institution;
  directions: Direction[];
}
export interface HierarchyElement {
  formControl: FormControl;
  title: string;
  hierarchyLevel: number;
  institutionId: string;
  shouldDisplay: boolean;
  options?: InstituitionHierarchy[];
}
