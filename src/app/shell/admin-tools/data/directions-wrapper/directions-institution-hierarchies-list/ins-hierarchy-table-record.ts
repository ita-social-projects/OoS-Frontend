import { Direction } from '../../../../../shared/models/category.model';
import { InstituitionHierarchy } from '../../../../../shared/models/institution.model';

export interface InsHierarchyTableRecord {
  name: string[];
  directions: Direction[];
  insHierarchies: InstituitionHierarchy[];
}
